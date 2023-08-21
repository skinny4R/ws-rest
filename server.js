const express = require("express");

const app = express();
const mongoose = require("mongoose");
const colors = require("colors");
const bodyParser = require("body-parser");

require("dotenv").config({ path: "./config/.env" });

app.use(express.json());

const User = require("./models/User");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`db connected`.cyan))
  .catch((err) => console.log(`err`.red));

const PORT = process.env.PORT || 4400;

app.post("/newuser", async (req, res) => {
  const newUser = req.body;
  try {
    await newUser.save();
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/update/:id", async (req, res, next) => {
  try {
    const updateUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (!updateUser) {
      res.status(404).send("not found");
    }
    res.status(201).send(updateUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/allusers", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(201).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/user/delete/:id", async (req, res, next) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id });
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`server is running on ${PORT} `)
);
