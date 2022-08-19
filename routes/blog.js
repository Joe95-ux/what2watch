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
const {
  ensureAuth,
  ensureGuest,
  ensureToken,
  ensureAdminToken,
  ensureAdmin
} = require("../middleware/auth");
const {
  formatDate,
  dateWithTime,
  sortCats,
  getCats,
  trendingMovies,
  editorsPicks,
  latestPosts,
  relatedPosts,
  recentPosts,
  storyMap,
  paginate
} = require("../helpers/helper");
const User = require("../models/User");
const Story = require("../models/Story");
const format = "MMMM Do YYYY, h:mm:ss a";
const crypto = require("crypto");
const async = require("async");
const nodemailer = require("nodemailer");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

//s3 config

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
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
  storage: multerS3({
    s3,
    bucket: "what2watch-uploads",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, callback) {
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
    req.flash("user", "Thank You for Subscribing!");
    res.redirect(req.originalUrl);
  } catch (e) {
    console.log(e);
  }
});


// Get a post by its category

router.get("/category/:catName", async (req, res) => {
  const title = req.params.catName;
  const cat = req.params.catName;
  const category = encodeURI(cat);
  let sortedCats;
  let pages;
  let pageNum = 1;
  try {
    let allStories = await Story.find({ status: "Public" });
    const allTrending = await trendingMovies();
    const trending = await allTrending.slice(0, 6);
    let stories = await Story.find({ category: cat, status: "Public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    if (stories) {
      stories = stories.map(story => {
        story.createdAt = formatDate(story.createdAt);
        return story;
      });
      const paginated = paginate(stories, 8);
      currentPage = paginated[pageNum - 1];
      pages = paginated.length;
      let categories = getCats(allStories);
      if (categories.length) {
        sortedCats = sortCats(categories);
      }
    }
    res.render("blogCategory", {
      title,
      stories:currentPage,
      pages,
      pageNum,
      sortedCats,
      cat,
      category,
      trending
    });
  } catch (err) {
    console.log(err);
  }
});

// category next page

router.get("/category/:catName/:num", async (req, res) => {
  const title = req.params.catName;
  const cat = req.params.catName;
  const category = encodeURI(cat);
  let sortedCats;
  let pages;
  let pageNum = parseInt(req.params.num);
  try {
    let allStories = await Story.find({ status: "Public" });
    const allTrending = await trendingMovies();
    const trending = await allTrending.slice(0, 6);
    let stories = await Story.find({ category: cat, status: "Public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    if (stories) {
      stories = stories.map(story => {
        story.createdAt = formatDate(story.createdAt);
        return story;
      });
      const paginated = paginate(stories, 8);
      currentPage = paginated[pageNum - 1];
      pages = paginated.length;
      let categories = getCats(allStories);
      if (categories.length) {
        sortedCats = sortCats(categories);
      }
    }
    res.render("blogCategory", {
      title,
      stories:currentPage,
      pages,
      pageNum,
      sortedCats,
      cat,
      category,
      trending
    });
  } catch (err) {
    console.log(err);
  }
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
    let post;
    try {
      req.body.user = req.user.id;
      post = req.body;
      if (req.file) {
        post.photo = req.file.location;
      }
      await Story.create(post);
      res.redirect("/blog/posts");
    } catch (err) {
      console.error(err);
    }
  }
);

// Get all blog posts

router.get("/posts", async (req, res) => {
  const title = "blog posts";
  let sortedCats;
  let picks;
  let latest;
  let allStories;
  let pages;
  let pageNum = 1;
  let currentPage;
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
      allStories = paginate(stories, 6);
      currentPage = allStories[pageNum - 1];
      pages = allStories.length;

      let categories = getCats(stories);
      if (categories.length) {
        sortedCats = sortCats(categories);
      }
      picks = editorsPicks(stories);
      if(picks.length){
         picks = picks.slice(0, 6);
      }
      latest = latestPosts(stories);
    }
    res.render("blogHome", {
      title,
      stories,
      sortedCats,
      trending,
      picks,
      latest,
      currentPage,
      pages,
      pageNum
    });
  } catch (err) {
    console.log(err);
  }
});

// next page: bloghome
router.get("/posts/page=:num", async (req, res) => {
  const title = "blog posts";
  let sortedCats;
  let picks;
  let latest;
  let allStories;
  let pages;
  let pageNum = parseInt(req.params.num);
  let currentPage;
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
      allStories = paginate(stories, 6);
      currentPage = allStories[pageNum - 1];
      pages = allStories.length;

      let categories = getCats(stories);
      if (categories.length) {
        sortedCats = sortCats(categories);
      }
      picks = editorsPicks(stories);
      if(picks.length){
         picks = picks.slice(0, 6);
      }
      latest = latestPosts(stories);
    }
    res.render("blogHome", {
      title,
      stories,
      sortedCats,
      trending,
      picks,
      latest,
      currentPage,
      pages,
      pageNum
    });
  } catch (err) {
    console.log(err);
  }
});


router.get("/edit/:id", ensureAuth, async (req, res) => {
  const title = "edit post";
  try {
    const story = await Story.findOne({
      _id: req.params.id
    })
      .populate("user")
      .lean();

    if (!story) {
      return res.render("error/400");
    }

    if (story?.user?._id.equals(req.user._id) || req.user.privilege === "admin") {
      res.render("editblog", { title, story });
    } else {
      res
        .status(401)
        .json("action not authorised. you can only edit your own articles");
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
  upload.single("photo"),
  ensureAuth,
  async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).populate("user").lean();
      let newStory = req.body;

      if (!story) {
        return res.render("error/400");
      }

      if (
        story.user?._id.equals(req.user._id) ||
        req.user.privilege === "admin"
      ) {
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

        res.redirect("/blog/posts/");
      } else {
        res
          .status(401)
          .json("action not authorised. You can only edit your story");
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
    let story = await Story.findById(req.params.id).populate("user").lean();
    let user = await User.findById(req.user.id);

    if (!story) {
      return res.render("error/400");
    }

    if (story?.user?._id.equals(req.user._id) || req.user.privilege === "admin") {
      await Story.deleteOne({ _id: req.params.id });
      if (req.user.privilege === "admin") {
        res.redirect("/blog/admin/dashboard/" + req.user._id);
      } else {
        res.redirect("/blog/dashboard/" + req.user._id);
      }
    } else {
      res
        .status(401)
        .json("action not authorised. You can only delete your story");
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

    if (user._id.equals(req.user.id )|| req.user.privilege === "admin") {
      await User.findByIdAndDelete(req.params.id);
      req.flash("info", user.username + "'s account was successfully deleted")
      if(req.user.privilege === "admin"){
        res.redirect("/blog/admin/dashboard/" + req.user.id)
      }else{
        res.redirect("/blog/register");
      }
      
    } else {
      res
        .status(401)
        .json("action not authorised. You can only delete your acount");
      
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// see all stories by a writer
router.get("/profiles/:id", async (req, res)=>{
  let title;
  let sortedCats;
  let first;
  let rest;
  let trending;
  let writers;
  let users;
  try{
    let user = await User.findById(req.params.id);

    if(!user){
      res.status(401).json("Sorry, we couldn't find the requested user.");
    }
    title = user.name || user.username;
    let allStories = await Story.find({status:"Public"})
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    let stories = await Story.find({ user: req.params.id, status:"Public"})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    if (stories) {
      stories = stories.map(story => {
        story.createdAt = formatDate(story.createdAt, format);
        return story;
      });
      first = stories.slice(0,1);
      rest = stories.slice(1);
    }
    if (allStories) {
      let categories = getCats(stories);
      if (categories.length) {
        sortedCats = sortCats(categories);
      }
      trending = allStories.slice(0, 4);
    }
    
    if (user) {
      created = formatDate(user.createdAt);
    }
    writers = await User.aggregate([
      {
        $lookup: {
          from: "stories",
          let: { userId: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: ["$$userId", "$user"] } } }],
          as: "posts_count"
        }
      },
      { $addFields: { posts_count: { $size: "$posts_count" } } }
    ]);
    writers = writers.filter(writer=> !writer._id.equals(user._id))
    users = writers.filter(writer=> writer.posts_count > 0);
    res.render("singleuser", {title, first, writer:user, rest, stories, trending, users, sortedCats})
  
  }catch(err){
    console.log(err)
  }
  
})

// get a single post
router.get("/posts/:slug", async (req, res) => {
  let title;
  let sortedCats;
  let related;
  let recent;
  try {
    let stories = await Story.find({ status: "Public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    let story = await Story.findOne({ slug: req.params.slug })
      .populate("user")
      .lean()
      .exec();

    if (!story || story.status == "Draft") {
      return res.render("error/400");
    } else {
      story.createdAt = formatDate(story.createdAt);
      title = story.title;
      if (stories.length) {
        stories = stories.map(story => {
          story.createdAt = formatDate(story.createdAt);
          return story;
        });
        related = relatedPosts(stories, story.category, story._id);
        recent = recentPosts(stories, story._id);

        let categories = getCats(stories);
        if (categories.length) {
          sortedCats = sortCats(categories);
        }
      }
      res.render("post", { title, story, sortedCats, related, recent });
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

//get admin login

router.get("/admin/register", ensureGuest, async (req, res) => {
  const title = "Register as admin";
  res.render("adminlogin", { title });
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
      let newProfile = {};
      newProfile.name = req.body.name;
      newProfile.email = req.body.email;
      newProfile.role = req.body.role;
      newProfile.bio = req.body.bio;
      newProfile.facebook = req.body.facebook;
      newProfile.instagram = req.body.instagram;
      newProfile.twitter = req.body.twitter;
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
        if (req.user.privilege === "admin") {
          res.status(200).redirect("/blog/admin/dashboard/" + req.user.id);
        } else {
          res.status(200).redirect("/blog/dashboard/" + req.user.id);
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your account!");
    }
  }
);

// user dashboard
router.get("/dashboard/:id", ensureAuth, async (req, res) => {
  const title = "dashboard";
  let sortedCats;
  let created;
  try {
    let allStories = await Story.find({})
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    let stories = await Story.find({ user: req.params.id })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    let user = await User.findById(req.params.id);
    if (stories) {
      stories = stories.map(story => {
        story.createdAt = dateWithTime(story.createdAt, format);
        return story;
      });
    }
    if (allStories) {
      let categories = getCats(stories);
      if (categories.length) {
        sortedCats = sortCats(categories);
      }
    }
    if (user) {
      created = formatDate(user.createdAt);
    }
    res.render("dashboard", {
      title,
      stories,
      name: req.user.name,
      created,
      user,
      sortedCats
    });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

// admin dashboard

router.get(
  "/admin/dashboard/:id",
  ensureAuth,
  ensureAdmin,
  async (req, res) => {
    const title = "dashboard";
    let sortedCats;
    let created;
    try {
      let stories = await Story.find({})
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean()
        .exec();
      let users = await User.find({});
      let user = await User.findOne({ _id: req.params.id });
      if (user) {
        created = formatDate(user.createdAt);
      }
      if (stories) {
        stories = stories.map(story => {
          story.createdAt = dateWithTime(story.createdAt, format);
          return story;
        });
        let categories = getCats(stories);
        if (categories.length) {
          sortedCats = sortCats(categories);
        }
        users = storyMap(stories, users);
      }
      if (users) {
        users.map(user => {
          user.createdAt = formatDate(user.createdAt);
          return user;
        });
      }
      res.render("dashboard", {
        title,
        stories,
        name: req.user.name,
        created,
        users,
        user,
        sortedCats
      });
    } catch (err) {
      console.log(err);
      res.render("error/500");
    }
  }
);

// change user's privilege
router.put("/admin-action/edit-role/:id", ensureAuth, ensureAdmin, async (req, res) => {
  const user = await User.findOne({_id:req.params.id});
  let newRole;
  let name;
  if(user.name){
    name = user.name;
  }else{
    name = user.username;
  }
  if (user.privilege === "admin"){
    newRole = "";
    req.flash("info", name + "'s admin privilege was removed.")
    
  }else{
    newRole = "admin";
    req.flash("info", name + " has been made admin ")
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set:{privilege:newRole}
      },
      { new: true }
    );
    res.status(200).redirect("/blog/admin/dashboard/" + req.user.id);
  }catch (err) {
    res.status(500).json(err);
  }
});

router.post("/register", ensureToken, function(req, res) {
  const title = "register";
  User.register({ username: req.body.username }, req.body.password, function(
    err,
    user
  ) {
    if (err) {
      console.log(err);
      req.flash("info", "Sorry! A user with this email already exists.");
      return res.render("register", { title });
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
  req.login(user, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        if (req.user.privilege === "admin") {
          res.redirect("/blog/admin/dashboard/" + req.user.id);
        } else {
          res.redirect("/blog/dashboard/" + req.user.id);
        }
      });
    }
  });
});

// post to admin login
router.post("/admin/register", ensureAdminToken, function(req, res) {
  req.body.privilege = "admin";
  User.register(
    { username: req.body.username, privilege: req.body.privilege },
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        req.flash("info", "Sorry! A user with this email already exists.");
        res.redirect("/blog/admin/register");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/blog/admin/dashboard/" + user._id);
        });
      }
    }
  );
});

router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/blog/login");
  });
});

// request to reset password
router.get("/reset-password", ensureGuest, async (req, res) => {
  const title = "Reset password";
  res.render("forgotpass", { title });
});

// Reset user password : get token and password link
router.post("/reset-password", function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          let token = buf.toString("hex");
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ username: req.body.username }, function(err, user) {
          if (!user) {
            req.flash(
              "error",
              "Sorry, No account with that email address exists."
            );
            return res.redirect("/blog/reset-password");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        let smtpTransport = nodemailer.createTransport({
          pool: true,
          host: "smtp.zoho.com",
          port: 465,
          secure: true, // use SSL
          auth: {
            type: "login",
            user: process.env.ZOHO_USER,
            pass: process.env.ZOHO_PASS
          }
        });
        let mailOptions = {
          to: user.username,
          from: "what2watch@what2watch.net",
          subject: "what2watch.net Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.hostname +
            "/blog/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash(
            "info",
            "An e-mail has been sent to " +
              user.username +
              " with further instructions."
          );
          done(err, "done");
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect("/blog/reset-password");
    }
  );
});

// password reset link

router.get("/reset/:token", ensureGuest, (req, res) => {
  const title = "Reset password";
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(err, user) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/blog/reset-password");
      }
      res.render("reset", {
        user,
        title
      });
    }
  );
});

router.post("/reset/:token", function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        User.findOneAndUpdate(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          {
            $unset: {
              resetPasswordToken: 1,
              resetPasswordExpires: 1
            }
          },
          {
            new: true
          },
          function(err, user) {
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("/blog/reset-password");
            }
            if (req.body.password) {
              user.setPassword(req.body.password, (err, user) => {
                if (err) {
                  console.log(err);
                }
                user.save(function(err) {
                  req.logIn(user, function(err) {
                    done(err, user);
                  });
                });
              });
            }
          }
        );
      },
      function(user, done) {
        const smtpTransport = nodemailer.createTransport({
          pool: true,
          host: "smtp.zoho.com",
          port: 465,
          secure: true, // use SSL
          auth: {
            type: "login",
            user: process.env.ZOHO_USER,
            pass: process.env.ZOHO_PASS
          }
        });
        var mailOptions = {
          to: user.username,
          from: "what2watch@what2watch.net",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.username +
            " has just been changed.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash(
            "success",
            "Success! Your password was changed successfully."
          );
          done(err);
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect("/blog/posts");
    }
  );
});

module.exports = router;
