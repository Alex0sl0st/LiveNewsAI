import express from "express";
import { getNews, getNewsById, createNews } from "../controllers/news.js";

const router = express.Router();

router.get("/", getNews);
router.get("/:id", getNewsById);
router.post("/", createNews);

export default router;
