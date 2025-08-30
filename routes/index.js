var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const upload = require("./multer");


passport.use(new LocalStrategy(userModel.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ✅ Routes

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/feed",isLoggedIn ,async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("user", "username dp") 
      .sort({ createdAt: -1 });

    console.log("Posts fetched:", posts); 

    res.render("feed", { posts });  
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).send("Error loading feed: " + err.message);
  }
});

router.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const newPost = new postModel({
      postText: req.body.postText || req.body.title || '',
      image: req.file.filename,
      user: user._id,
      createdAt: new Date(),
      likes: []
    });

    await newPost.save();

    user.posts.push(newPost._id);
    await user.save();

    res.redirect("/feed");
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Error uploading post");
  }
});

router.get("/forgot", function (req, res) {
  res.send("forgot password page");
});

router.get("/profile", isLoggedIn, async function (req, res) {
  try {
    const user = await userModel.findById(req.user._id).populate("posts");
    res.render("profile", { user: user });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

router.post("/register", function (req, res) {
  const { username, email, fullname, password } = req.body;

  if (!password) {
    return res.send("Password is required!");
  }

  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, password, function (err, user) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    }

    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});



// router.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     const newPost = new postModel({
//       postText: req.body.postText,
//       image: req.file.filename,
//       user: req.user._id
//     });

//     await newPost.save();

//     // user ke posts array me bhi add karo
//     const user = await user.findById(req.user._id);
//     user.posts.push(newPost._id);
//     await user.save();

//     res.redirect("/feed");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error uploading post");
//   }
// });


// router.post("/upload", isLoggedIn, upload.single('image'), async function (req, res) {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const user = await userModel.findById(req.session.passport.user);
//   if (!user) {
//     return res.status(404).send('User not found.');
//   }

//   const newPost = await postModel.create({
//     image: "/images/uploads/" + req.file.filename,
//     postText: req.body.title,
//     user: user._id,
//     createdAt: new Date(),
//     likes: []
//   });

//   user.posts.push(newPost._id);
//   await user.save();
//   await newPost.save();

//   res.redirect("/profile");
// });

router.get("/forgot", function (req, res) {
  res.send("forgot password page");
});

// ✅ PROFILE: Show user and posts
router.get("/profile", isLoggedIn, async function (req, res) {
  try {
    const user = await userModel.findById(req.user._id).populate("posts");
    res.render("profile", { user: user });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

router.post("/register", function (req, res) {
  const { username, email, fullname, password } = req.body;

  if (!password) {
    return res.send("Password is required!");
  }

  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, password, function (err, user) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    }

    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.get("/login", function (req, res) {
  res.render("login", { error: req.flash("error") });
});

router.post("/login", 
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureFlash: true,
    failureRedirect: "/login"
  })
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;