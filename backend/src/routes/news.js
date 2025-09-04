import express from "express";
import {
  getNews,
  getNewsById,
  createNews,
  loadNews,
  chatGptAPI,
} from "../controllers/news.js";

const router = express.Router();

router.get("/", getNews);
router.get("/load", loadNews);
router.get("/:id", getNewsById);
router.post("/chatgpt", chatGptAPI);
router.post("/", createNews);

export default router;
