const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
    // username: { type: String, required: true },
    exercise: { type: String, required: true },
    duration: { type: Number },
    caption: { type: String },
    photoPath: { type: String, required: true },
    photoName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(`workout`, workoutSchema);
