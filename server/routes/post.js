import express from "express";
import { getFeeds, getUserPosts, likePost } from "../controllers/post.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeeds);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);

export default router;
