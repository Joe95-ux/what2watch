const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { S3Client, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const bcrypt = require("bcrypt");
const { subcribeHandler } = require("../utils/mailchimp");
const { ensureAuth, ensureGuest, ensureToken } = require("../middleware/auth");
const { formatDate, dateWithTime, sortCats, getCats, trendingMovies, editorsPicks } = require("../helpers/helper");
const User = require("../models/User");
const Story = require("../models/Story");
const format = "MMMM Do YYYY, h:mm:ss a";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

//s3 config

const s3 = new S3Client({
  region:process.env.S3_BUCKET_REGION,
  credentials:{
    accessKeyId:process.env.S3_ACCESS_KEY_ID,
    secretAccessKey:process.env.S3_SECRET_ACCESS_KEY,
  }
  
})


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
  storage: multerS3({
    s3,
    bucket:"what2watch-uploads",
    metadata: function(req, file, cb){
      cb(null, {fieldName: file.fieldname})
    },
    key:function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  })
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

router.get("/category/:catName", async (req, res) => {
  const title = req.params.catName;
  const userEmail = req.flash("user");
  const cat = req.params.catName;
  let sortedCats;
  try {
    let allStories = await Story.find({ status:"Public"});
    const allTrending = await trendingMovies();
    const trending = await allTrending.slice(0, 6);
    let stories = await Story.find({ category: cat, status:"Public"})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    if (stories) {
      stories = stories.map(story => {
        story.createdAt = formatDate(story.createdAt);
        return story;
      });
      let categories = getCats(allStories);
      if(categories.length){
        sortedCats = sortCats(categories);
      }
      
    }
    res.render("blogCategory", { title, userEmail, stories, sortedCats, cat, trending });
  } catch (err) {
    console.log(err);
  }
});

router.get("/compose", ensureAuth, async (req, res) => {
  const title = "compose";
  res.render("compose", { title });
});

router.post("/compose", upload.single("photo"), ensureAuth, async (req, res) => {
    let post;
    try {
      req.body.user = req.user.id;
      post = req.body
      post.photo = req.file.location;
      await Story.create(post);
      res.redirect("/blog/posts");
    } catch (err) {
      console.error(err);
    }
  }
);

router.get("/posts", async (req, res) => {
  const title = "blog posts";
  const userEmail = req.flash("user");
  let sortedCats;
  let picks;
  try {
    const allTrending = await trendingMovies();
    const trending = await allTrending.slice(0, 6);
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
      let categories = getCats(stories);
      if(categories.length){
        sortedCats = sortCats(categories);
      }
      picks = editorsPicks(stories);
      picks = picks.slice(0, 9);
      
    }
    res.render("blogHome", { title, userEmail, stories, sortedCats, trending, picks });
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
      return res.render("error/400");
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
router.put("/posts/:id", upload.single("photo"), ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean();
      let newStory = req.body;

      if (!story) {
        return res.render("error/400");
      }

      if (story.user != req.user.id) {
        res
          .status(401)
          .json("action not authorised. You can only edit your story");
      } else {
        if (req.file) {
          newStory.photo = req.file.location;
        }
        story = await Story.findByIdAndUpdate(
          req.params.id,
          {
            $set: newStory
          },
          { new: true }
        );

        res.redirect("/blog/dashboard/" + story.user);
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
      return res.render("error/400");
    }

    if (story.user != req.user.id) {
      res
        .status(401)
        .json("action not authorised. You can only delete your story");
    } else {
      await Story.deleteOne({ _id: req.params.id });
      res.redirect("/blog/dashboard/" + story.user);
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
      return res.render("error/400");
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
  let sortedCats;
  try {
    let stories = await Story.find({ status: "Public" });
    let story = await Story.findOne({ slug: req.params.slug })
      .populate("user")
      .lean()
      .exec();

    if (!story || story.status == "Draft") {
      return res.render("error/400");
    } else {
      story.createdAt = formatDate(story.createdAt);
      title = story.title;
      if (stories) {
        let categories = getCats(stories);
        if(categories.length){
          sortedCats = sortCats(categories);
        }
        
      }
      res.render("post", { title, userEmail, story, sortedCats });
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
        newProfile.photo = req.file.location;
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
        res.status(200).redirect("/blog/dashboard/" + req.params.id);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your account!");
    }
  }
);

router.get("/dashboard/:id", ensureAuth, async (req, res) => {
  const title = "dashboard";
  let created;
  try {
    let stories = await Story.find({ user: req.params.id }).sort({ createdAt: "desc" }).lean();
    let user = await User.findById(req.params.id);
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
        res.redirect("/blog/dashboard/" + user._id);
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
        res.redirect("/blog/dashboard/" + req.user.id);
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
