const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Image = require("../models/Image"); // Import model Image
const Message = require('../models/Messages'); // Ganti path ini sesuai struktur proyek Anda

// Welcome Page
router.get("/", (req, res) => res.render("index"));

router.get("/explore", async (req, res) => {
  try {
    const images = await Image.find({});
    res.render("explore", { images });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).send("Server error");
  }
});

router.get("/about", (req, res) => res.render("about"));

router.get("/contact", (req, res) => res.render("contact"));

// Route to get all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }); // Sort messages by creation date
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching messages');
  }
});

router.post("/message", async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    const newMessage = new Message({
      firstName,
      lastName,
      email,
      message
    });

    await newMessage.save();
    res.status(200).json({ message: "Message saved successfully!" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Server error while saving message" });
  }
});

// Route untuk mengambil semua pesan
router.get("/admin/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.render("adminMessages", { messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Server error while fetching messages");
  }
});



// Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const images = await Image.find(); // Fetch all images from the database

    // Convert each image to base64 format for rendering in the template
    const imagesWithBase64 = images.map((image) => {
      return {
        ...image.toObject(),
        imageData: `data:image/jpeg;base64,${image.imageData}`, // Append base64 image string
      };
    });

    res.render("dashboard", {
      user: req.user,
      images: imagesWithBase64, // Pass base64 image data to the template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
