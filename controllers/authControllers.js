const auth = require("../models/authSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
require("dotenv").config();

const registerUser = async (req, res) => {
  userName = req.body.userName;
  email = req.body.email;
  password = req.body.password;
  confirmPassword = req.body.confirmPassword;
  try {
    if (!validator.isEmail(email)) {
      return res.json({ msg: `enter valid email` });
    }

    if (!validator.isStrongPassword(password)) {
      return res.json({ msg: `password should be strong` });
    }

    if (!userName || !email || !password || !confirmPassword) {
      return res.json({ msg: `all fields are required` });
    } else if (password != confirmPassword) {
      return res.json({ msg: "Passwords do not match" });
    } else {
      const existingUser = await auth.findOne({ email: email });
      if (existingUser) {
        return res.status(409).send(`user already exists. You can log in`);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new auth({
          username: userName,
          email: email,
          password: hashedPassword,
        });
        await user.save();
        const authToken = jwt.sign(
          { username: user.username },
          process.env.TOKEN_SECRET
        );
        return res.status(201).send({ authToken, user });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

const loginUser = async (req, res) => {
  try {
    //either of email or username is required
    if (!req.body.email && !req.body.userName) {
      return res.status(400).json({
        msg: `enter either email or usesrName for logging in `,
      });
    }

    //if user opts to login using userName, email would be NULL
    if (!req.body.email) {
      const user = await auth.findOne({ username: req.body.userName });

      if (!user) {
        return res.status(400).json({ msg: "invalid username" });
      }

      if (await bcrypt.compare(req.body.password, user.password)) {
        const authToken = jwt.sign(
          { username: req.body.userName },
          process.env.TOKEN_SECRET
        ); //generating token using the userName
        return res.json({ authToken });
      }
      return res.status(400).json({ msg: `incorrect password` });
    }

    //if user opts to login using email, userName would be NULL
    if (!req.body.userName) {
      if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ msg: `enter valid email` });
      }

      const user = await auth.findOne({ email: req.body.email });

      if (!user) {
        return res
          .status(404)
          .json({ msg: `No account with this email found.` });
      }

      if (await bcrypt.compare(req.body.password, user.password)) {
        const authToken = jwt.sign(
          { username: user.username },
          process.env.TOKEN_SECRET
        ); //generating token using userName
        return res.json({ authToken });
      }
      return res.status(400).json({ msg: `passwords do not match` });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: `Internal server error` });
  }
};

const updateUser = async (req, res) => {
  try {
    //either of the email or userName is required
    if (!req.body.email && !req.body.userName) {
      return res.status(400).json({
        msg: `enter either email or usesrName for logging in `,
      });
    }

    //user tries to access it using userName
    if (!req.body.email) {
      const user = await auth.findOne({ username: req.body.userName });

      //checks if the user is already there in the db or not
      if (!user) {
        return res.status(400).json({ msg: "invalid username" });
      }

      const comparePass = await bcrypt.compare(
        req.body.newPassword,
        user.password
      );
      if (!comparePass) {
        if (!validator.isStrongPassword(req.body.newPassword)) {
          return res.json({ msg: `password is too weak` });
        }
        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);

        const updatedUser = await auth.updateOne({
          password: hashedNewPassword,
        });
        return res.status(200).json({ msg: `password updated successfully` });
      }
    }

    //if user tries to access using email
    if (!req.body.userName) {
      if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ msg: `email invalid` });
      }
      const user = await auth.findone({ username: req.body.email });

      //checks if the user is already there in the db or not
      if (!user) {
        return res.status(400).json({ msg: "invalid username" });
      }

      const comparePass = await bcrypt.compare(
        req.body.newPassword,
        user.password
      );
      if (!comparePass) {
        if (!validator.isStrongPassword(req.body.newPassword)) {
          return res.json({ msg: `password is too weak` });
        }
        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);

        const updatedUser = await auth.findOneAndUpdate({
          password: hashedNewPassword,
        });
        return res.status(200).json({ msg: `password updated successfully` });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: `internal server error` });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!req.body.userName || !req.body.email || !req.body.password) {
      return res.json({ msg: `all fields are required` });
    }
    if (!validator.isEmail(req.body.email)) {
      return res.status(401).json({ msg: `email is invalid` });
    }
    // const id = req.params.id;

    const user = await auth.findOne({ username: req.body.userName });
    if (!user) {
      return res.status(404).json({ msg: "No User Found!" });
    }

    const deletingUser = await auth.findOneAndDelete({ email: req.body.email });
    return res.status(200).json({ msg: `user deleted successfully` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser };
