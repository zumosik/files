import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

//Import Routes
import authRoutes from "./routes/auth.js"
import fileRoutes from "./routes/files.js"
import groupRoutes from "./routes/group.js"

//CONFIG
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static/file", express.static("uploads"))
//Routes
app.use("/auth", authRoutes)
app.use("/file", fileRoutes)
app.use("/group", groupRoutes)
//Error middleware
app.use((err, req, res, next) => {
  // Handle the error
  if (err.code === 500)console.error(err);

  // Set an appropriate status code
  res.status(err.code || 500);

  // Send an error response
  res.send(err.message || 'Internal Server Error');
});

//GET DOTENV VARS
const PORT = process.env.PORT || 8075;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) console.log("🆘 No mongodb url")
else {
  //START SERVER
  try {
    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() =>   app.listen(PORT, () => console.log(`🟩 MONGODB is connected\n🟩 Server is running on port ${PORT} `)))
  } catch (err) {
    console.error(err)
  }
  
}

