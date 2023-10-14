import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { Signup } from "./controllers/auth.js";
import { createPost } from "./controllers/post.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

import connectDB from "./db.js";
import { verifyToken } from "./middlewares/auth.js";
const PORT = process.env.PORT;

// Middlewares config //
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  cors({
    origin: "https://oasis-front.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Routes
app.post("/auth/signup", upload.single("picture"), Signup);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Mongoose
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on : ${PORT}`);
});
