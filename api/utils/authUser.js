import CustomError from "./CustomErrors.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export default async function authUser(req, res, next) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          req.userId = decoded.id;
          return next();
          
        }
      }
    }

    throw new CustomError(404, "No auth");
  } catch (err) {
    console.error(err)
    next(err);
  }
}
