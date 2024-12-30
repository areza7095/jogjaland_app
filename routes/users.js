const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const multer = require("multer");
const User = require("../models/User");
const Image = require("../models/Image");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, (req, res) => res.render("register"));

// Dashboard Page
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const images = await Image.find();

    const imagesWithBase64 = images.map((image) => ({
      ...image.toObject(),
      imageData: `data:image/jpeg;base64,${image.imageData}`,
    }));

    res.render("dashboard", {
      user: req.user,
      images: imagesWithBase64,
    });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.status(500).send("Server error");
  }
});

// Upload Image
router.post("/dashboard/upload", upload.single("image"), async (req, res) => {
  try {
    const { description } = req.body;
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString("base64");

    const newImage = new Image({
      imageData: base64Image,
      description,
    });

    await newImage.save();
    res.redirect("/users/dashboard");
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).send("Server error while uploading image");
  }
});

// Delete Image
router.post("/dashboard/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).send("Image not found");
    }

    await Image.findByIdAndDelete(id);
    res.redirect("/users/dashboard");
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).send("Server error while deleting image");
  }
});

// Edit Image Description
router.post("/dashboard/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).send("Image not found");
    }

    image.description = description;
    await image.save();

    res.redirect("/users/dashboard");
  } catch (err) {
    console.error("Error editing image:", err);
    res.status(500).send("Server error while editing image");
  }
});

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    return res.render("register", { errors, name, email, password, password2 });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      errors.push({ msg: "Email already exists" });
      return res.render("register", { errors, name, email, password, password2 });
    }

    const newUser = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    req.flash("success_msg", "You are now registered and can log in");
    res.redirect("/users/login");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Server error");
  }
});

// Login User
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout User
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
