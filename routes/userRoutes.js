const express = require("express");
const axios = require("axios");
const User = require("../models/User");

const router = express.Router();

/* ----------------------------------
   1️⃣ STORE USER (Already working)
----------------------------------- */
router.post("/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const user = await User.create({ name, email, age });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ----------------------------------
   2️⃣ FETCH FROM EXTERNAL API & STORE
----------------------------------- */
router.get("/users/fetch-external", async (req, res) => {
  try {
    // 🔹 Fetch external API data
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );

    const externalUsers = response.data;

    // 🔹 Map external data → your schema
    const usersToSave = externalUsers.map((user) => ({
      name: user.name,
      email: user.email,
      age: Math.floor(Math.random() * 20) + 20, // fake age
    }));

    // 🔹 Store in MongoDB
    const savedUsers = await User.insertMany(usersToSave);

    res.status(200).json({
      success: true,
      message: "External users fetched and stored",
      count: savedUsers.length,
      data: savedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
