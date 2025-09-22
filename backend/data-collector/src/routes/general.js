import express from "express";

import {
  startCollecting,
  endCollecting,
} from "../controllers/generalControllers.js";

const router = express.Router();

router.get("/start", startCollecting);
router.get("/end", endCollecting);

export default router;
