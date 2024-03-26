const auth = require("../models/authSchema");
const workouts = require("../models/workoutSchema");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const getWorkoutInfo = async (req, res) => {
  try {
    const userName = req.body.userName;

    const user = await workouts.findOne({ username: userName });
    if (!user) {
      return res.status(404).json(`no user with such username found`);
    }
    return res.status(200).json(`${user}`);
  } catch (err) {
    console.log(err);
    return res.status(500).json(`internal server error`);
  }
};

const createWorkout = async (req, res) => {
  try {
    if (!req.file) {
      return res.json(400).send("No file provided");
    }

    const newWorkout = new workouts({
      // user: auth._id,
      // username: req.user.username,
      // username: req.body.userName,
      exercise: req.body.exercise,
      duration: req.body.duration,
      caption: req.body.caption,
      photoPath: "uploads/" + req.file.filename,
      photoName: req.file.filename,
    });

    console.log(newWorkout.username);

    const createdWorkout = await newWorkout.save();

    return res.status(200).json(createdWorkout);
  } catch (err) {
    console.log(err);
    return res.status(500).json(`internal server error`);
  }
};

module.exports = {
  getWorkoutInfo,
  createWorkout,
};
