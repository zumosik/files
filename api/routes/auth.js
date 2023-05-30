import CustomError from "../utils/CustomErrors.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email)
      throw new CustomError(400, "No all required data");
    const user = await User.findOne({ email });
    const user2 = await User.findOne({ username });
    if (user || user2)
      throw new CustomError(
        409,
        "User with this username or email alreay exists"
      );
    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    });
    newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

    res.json(token);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { usernameEmail, password } = req.body;
    if (!password) throw new CustomError(400, "No all required data");
    let user = await User.findOne({ email : usernameEmail });
    if (!user) {
      user = await User.findOne({ username : usernameEmail });
      if (!user)
        throw new CustomError(404, "No user with this email or this username");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new CustomError(401, "Incorrect password");

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json(token);
  } catch (err) {
    next(err);
  }
});

export default router;
