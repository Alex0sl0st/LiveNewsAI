import express from "express";
import { getAdminPage } from "../controllers/adminControllers.js";
import { doNewsAction } from "../controllers/adminControllers.js";

const router = express.Router();

router.get("/", getAdminPage);
router.post("/newsAction", doNewsAction);

export default router;
