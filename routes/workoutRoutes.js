const express = require("express");
const {
  getWorkoutInfo,
  createWorkout,
} = require("../controllers/workoutControllers");
const { verifyToken } = require("../middlewares/token");
const { upload } = require("../upload");

const router = express.Router();

router.use(verifyToken);

router.get("/getWorkout", getWorkoutInfo);
router.post("/createWorkout", upload.single("image"), createWorkout);

module.exports = router;
