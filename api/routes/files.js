import express from "express";
import authUser from "../utils/authUser.js";
import upload from "../multer.js";
import CustomError from "../utils/CustomErrors.js";
import User from "../models/User.js";
import Group from "../models/FileGroup.js";
import multer from "multer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const router = express.Router();

router.post(
  "/upload",
  authUser,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) throw new CustomError(400, "No files");
      const filename = req.file.filename;
      const { groupId, name } = req.body;
      if (!groupId || !name) throw new CustomError(400, "No all data");
      const group = await Group.findById(groupId);
      if (!group) throw new CustomError(404, "No group");
      const user = await User.findById(req.userId);
      const allGroups = await Group.find().where("_id").in(user.groups).exec();
      let isMatch = false;
      allGroups.forEach((e) => {
        if (e._id.toString() === group._id.toString()) {
          isMatch = true;
        }
      });
      if (!isMatch) throw new CustomError(401, "You can't access this group");
      group.files.push({
        filename,
        name,
        timestamp: Date.now(),
        size: req.file.size,
      });
      group.save();
      res.json(group);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  (err, req, res, next) => {
    // Multer error handler
    if (err instanceof multer.MulterError) {
      // Handle specific Multer errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send("File size exceeds the limit");
      } else {
        return res.status(500).send("Error working with file");
      }
    }

    fs.unlink(`uploads/${req.file.filename}`, (error) => {
      if (error) {
        next(error);
        return;
      }
    });
    // Forward other errors to the default error handler
    next(err);
  }
);

router.post("/get", authUser, async (req, res, next) => {
  try {
    const { groupId } = req.body;
    if (!groupId) throw new CustomError(400, "No group");
    const group = await Group.findById(groupId);
    if (!group) throw new CustomError(400, "No group");
    const user = await User.findById(req.userId);
    const allGroups = await Group.find().where("_id").in(user.groups).exec();
    let isMatch = false;
    allGroups.forEach((e) => {
      if (e._id.toString() === group._id.toString()) {
        isMatch = true;
      }
    });
    if (!isMatch) throw new CustomError(401, "You can't access this group");
    res.json(group);
  } catch (err) {
    next(err);
  }
});

router.get("/download/:filename", authUser, async (req, res, next) => {
  try {
    const { filename } = req.params;
    const user = await User.findById(req.userId);
    const allGroups = await Group.find().where("_id").in(user.groups).exec();

    allGroups.forEach((el) => {
      const files = el.files;
      files.forEach((file) => {
        if (file.filename === filename) {
          const filePath = `uploads/${filename}`; // Replace with the actual directory path
          console.log(filePath);

          res.download(filePath, (err) => {
            if (err) throw new CustomError(404, "File not found");
          });

          return;
        }
      });
    });
  } catch (err) {
    next(err);
  }
});

router.post("/delete", authUser, async (req, res, next) => {
  try {
    const { filename } = req.body;
    const user = await User.findById(req.userId);
    const allGroups = await Group.find().where("_id").in(user.groups).exec();

    allGroups.forEach((el) => {
      const files = el.files;
      el.files = files.filter((file) => {
        if (file.filename === filename) {
          return false; // Exclude the element from the array
        }
        return true; // Keep the element in the array
      });
      fs.unlink(`uploads/${filename}`, (err) => {
        if (err) {
          throw new CustomError(500, "Error deleting file");
        } else {
          el.save();
          res.send("Deleted");
        }
      });
    });
  } catch (err) {
    next(err);
  }
});

export default router;

/* 

  async (req, res, next) => {
    try {
      if (!req.files) throw new CustomError(400, "No files");
      const filename = req.files.filename;

      let group;
      const groupName = req.body.groupName;
      if (!groupName) throw new CustomError(400, "No group name");
      const user = await User.findById(req.userId);
      const allGroups = await Group.find().where("_id").in(user.groups).exec();
      let groupExist = false;
      allGroups.forEach((e) => {
        if (e.name === groupName) {
          groupExist = true;
          group = e;
        }
      });

      if (!groupExist) {
        const newGroup = await new Group({
          name: groupName,
          author: user._id,
          files: [],
        });

        user.groups.push(newGroup._id);

        newGroup.save();
        user.save();
        group = newGroup;
      }

      group.files.push(filename);
      group.save();

      res.json(filename);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

*/
