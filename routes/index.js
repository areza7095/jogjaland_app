const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Image = require("../models/Image");
const Message = require('../models/Messages');

// Welcome Page
router.get("/", (req, res) => res.render("index"));

// Explore Page
router.get("/explore", async (req, res) => {
  try {
    const images = await Image.find({});
    res.render("explore", { images });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).send("Server error");
  }
});

// About Page
router.get("/about", (req, res) => res.render("about"));

// Contact Page
router.get("/contact", (req, res) => res.render("contact"));

// API: Get all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send("Server error");
  }
});

// API: Save new message
router.post("/message", async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

// Admin Messages Page
router.get("/admin/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.render("adminMessages", { messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Server error while fetching messages");
  }
});

// Dashboard Page
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const images = await Image.find();

    // Convert images to base64
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

module.exports = router;
