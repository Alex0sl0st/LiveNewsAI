import express from "express";
import newsRouter from "./news.js";

const router = express.Router();

router.use("/news", newsRouter);

export default router;
