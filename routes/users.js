const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Image = require('../models/Image'); // Make sure the model is created
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// Configure multer for file uploads (we won't store the file on the disk anymore)
const storage = multer.memoryStorage(); // Store file in memory instead of disk

const upload = multer({ storage });

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));


router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const images = await Image.find(); // Ambil semua gambar dari database

    // Modifikasi data gambar untuk menambahkan base64 string
    const imagesWithBase64 = images.map((image) => {
      return {
        ...image.toObject(),
        imageData: `data:image/jpeg;base64,${image.imageData}`, // Menambahkan base64 image
      };
    });

    res.render('dashboard', {
      user: req.user,
      images: imagesWithBase64, // Kirim gambar dengan base64
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Handle Image Upload
router.post('/dashboard/upload', upload.single('image'), async (req, res) => {
  const { description } = req.body;
  const imageBuffer = req.file.buffer; // Get the buffer of the uploaded file
  const base64Image = imageBuffer.toString('base64'); // Convert to base64

  const newImage = new Image({
    imageData: base64Image, // Store base64 encoded image in the database
    description,
  });

  await newImage.save();
  res.redirect('/users/dashboard');
});


// Handle Image Deletion
router.post('/dashboard/delete/:id', async (req, res) => {
  const { id } = req.params;
  const image = await Image.findById(id);

  if (image) {
    // Remove from database
    await Image.findByIdAndDelete(id);
  }

  res.redirect('/users/dashboard');
});

// Handle Edit Image Description
router.post('/dashboard/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    // Temukan gambar berdasarkan ID
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).send('Image not found');
    }

    // Update deskripsi gambar
    image.description = description;

    // Simpan perubahan ke database
    await image.save();

    res.redirect('/users/dashboard'); // Kembali ke dashboard
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
