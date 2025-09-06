import express from "express";
import {
  getNews,
  getNewsById,
  createNews,
  chatGptAPI,
} from "../controllers/news.js";

const router = express.Router();

router.get("/", getNews);
router.get("/:id", getNewsById);
router.post("/chatgpt", chatGptAPI);
router.post("/", createNews);

export default router;
