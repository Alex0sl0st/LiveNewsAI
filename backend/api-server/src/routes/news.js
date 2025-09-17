import express from "express";
import {
  getNews,
  getNewsById,
  createNews,
  chatGptAPI,
  getAllNewsFromDb,
} from "../controllers/news.js";

const router = express.Router();

router.get("/", getNews);
router.get("/db", getAllNewsFromDb);
router.get("/:id", getNewsById);
router.post("/chatgpt", chatGptAPI);
router.post("/", createNews);

export default router;
