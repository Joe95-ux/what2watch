const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const { subcribeHandler } = require("../utils/mailchimp");
const { ensureAuth, ensureGuest, ensureToken } = require("../middleware/auth");
const { formatDate, dateWithTime } = require("../helpers/helper");
const User = require("../models/User");
const Story = require("../models/Story");
const format = "MMMM Do YYYY, h:mm:ss a";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

// Passport config
require("../config/passport")(passport);

// define storage for images
const storage = multer.diskStorage({
  //destination for files
  destination: function(req, file, callback) {
    callback(null, "./public/uploads/images");
  },
  //fileName
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

//upload parameters for multer
const upload = multer({
  storage: storage
});

router.post("/posts", async (req, res) => {
  const subscribingUser = {
    firstName: "",
    lastName: "",
    email: req.body.subscriber
  };
  try {
    await subcribeHandler(subscribingUser);
    req.flash("user", subscribingUser.email);
    res.redirect(req.originalUrl);
  } catch (e) {
    console.log(e);
  }
});

router.get("/category", async (req, res) => {
  const title = "category";
  const userEmail = req.flash("user");
  res.render("blogCategory", { title, userEmail });
});

router.get("/compose", ensureAuth, async (req, res) => {
  const title = "compose";
  res.render("compose", { title });
});

router.post(
  "/compose",
  upload.single("photo"),
  ensureAuth,
  async (req, res) => {
    try {
      req.body.user = req.user.id;
      req.body.photo = req.file.filename;
      await Story.create(req.body);
      res.redirect("/blog/posts");
    } catch (err) {
      console.error(err);
    }
  }
);

router.get("/posts", async (req, res) => {
  const title = "blog posts";
  const userEmail = req.flash("user");
  try {
    let stories = await Story.find({ status: "Public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    if (stories) {
      stories = stories.map(story => {
        story.createdAt = formatDate(story.createdAt);
        return story;
      });
    }
    res.render("blogHome.ejs", { title, userEmail, stories });
  } catch (err) {
    console.log(err);
  }
});

router.get("/edit/:id", ensureAuth, async (req, res) => {
  const title = "edit post";
  try {
    const story = await Story.findOne({
      _id: req.params.id
    }).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res
        .status(401)
        .json("action not authorised. you can only edit your own articles");
    } else {
      res.render("editblog", { title, story });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Update story
// @route   PUT /blog/posts/:id
router.put(
  "/posts/:id",
  ensureAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean();

      if (!story) {
        return res.render("error/404");
      }

      if (story.user != req.user.id) {
        res
          .status(401)
          .json("action not authorised. You can only edit your story");
      } else {
        if (req.body.photo) {
          req.body.photo = req.file.filename;
        }
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true
        });

        res.redirect("/blog/dashboard");
      }
    } catch (err) {
      console.error(err);
      return res.render("error/500");
    }
  }
);

// @desc    delete story
// @route   delete /blog/posts/:id
router.delete("/posts/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res
        .status(401)
        .json("action not authorised. You can only delete your story");
    } else {
      await Story.remove({ _id: req.params.id });
      res.redirect("/blog/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    delete user
// @route   delete /blog/profile/delete/:id
router.delete("/profile/delete/:id", ensureAuth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id).lean();

    if (!user) {
      return res.render("error/404");
    }

    if (user._id != req.user.id) {
      res
        .status(401)
        .json("action not authorised. You can only delete your acount");
    } else {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/blog/register");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

router.get("/posts/:slug", async (req, res) => {
  let title;
  const userEmail = req.flash("user");
  try {
    let story = await Story.findOne({ slug: req.params.slug })
      .populate("user")
      .lean()
      .exec();

    if (!story || story.status == "Draft") {
      return res.render("error/400");
    } else {
      story.createdAt = formatDate(story.createdAt);
      title = story.title;
      res.render("post", { title, userEmail, story });
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/register", ensureGuest, async (req, res) => {
  const title = "register";
  res.render("register", { title });
});

router.get("/login", ensureGuest, async (req, res) => {
  const title = "Login";
  res.render("login", { title });
});

router.get("/profile/:id", ensureAuth, async (req, res) => {
  const title = "Edit profile";
  try {
    const profile = await User.findById(req.user.id);
    if (!profile) {
      return res.render("/error/400");
    } else {
      res.render("profile", { title, profile });
    }
  } catch (err) {
    console.log(err);
  }
});

router.put(
  "/profile/:id",
  ensureAuth,
  upload.single("photo"),
  async (req, res) => {
    if (req.user.id === req.params.id) {
      let newProfile = req.user;
      newProfile.name = req.body.name;
      newProfile.email = req.body.email;
      newProfile.role = req.body.role;
      newProfile.bio = req.body.bio;
      if (req.file) {
        newProfile.photo = req.file.filename;
      }

      try {
        if (req.body.password) {
          const user = await User.findById(req.user.id);
          const newPass = await user.setPassword(req.body.password);
          await user.save();
        }

        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: newProfile
          },
          { new: true }
        );
        res.status(200).redirect("/blog/dashboard");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your account!");
    }
  }
);

router.get("/dashboard", ensureAuth, async (req, res) => {
  const title = "dashboard";
  let created;
  try {
    let stories = await Story.find({ user: req.user.id }).lean();
    let user = await User.findById(req.user.id);
    if (stories) {
      stories = stories.map(story => {
        story.createdAt = dateWithTime(story.createdAt, format);
        return story;
      });
    }
    if (user) {
      created = formatDate(user.createdAt);
    }
    res.render("dashboard", {
      title,
      stories,
      name: req.user.name,
      created,
      user
    });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

router.post("/register", ensureToken, function(req, res) {
  User.register({ username: req.body.username }, req.body.password, function(
    err,
    user
  ) {
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/blog/dashboard");
      });
    }
  });
});

router.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    passsword: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/blog/dashboard");
      });
    }
  });
});

router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/blog/login");
  });
});

module.exports = router;
