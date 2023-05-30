import express from "express";
import CustomError from "../utils/CustomErrors.js";
import User from "../models/User.js";
import Group from "../models/FileGroup.js";
import authUser from "../utils/authUser.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/new", authUser, async (req, res, next) => {
  try {
    const { groupName } = req.body;
    if (!groupName) throw new CustomError(400, "No group name");
    const user = await User.findById(req.userId);
    const allGroups = await Group.find().where("_id").in(user.groups).exec();
    let group;
    allGroups.forEach((e) => {
      if (e.name === groupName) {
        group = e;
      }
    });
    if (group) {
      const token = jwt.sign({ id: group._id }, process.env.JWT_SECRET);
      console.log(jwt.verify(token, process.env.JWT_SECRET));
      return res.json(token);
    } else {
      const newGroup = await new Group({
        name: groupName,
      });
      newGroup.users.push(user._id);
      user.groups.push(newGroup._id);
      newGroup.save();
      user.save();
      return res.json(newGroup);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});
router.get("/user", authUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const allGroups = await Group.find().where("_id").in(user.groups).exec();
    res.json(allGroups);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
