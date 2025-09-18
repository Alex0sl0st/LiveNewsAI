import express from "express";
import { chatGptAPI, getAllNewsFromDb } from "../controllers/news.js";

const router = express.Router();

// router.get("/", getNews);
router.get("/db", getAllNewsFromDb);
// router.get("/:id", getNewsById);
router.post("/chatgpt", chatGptAPI);

export default router;
