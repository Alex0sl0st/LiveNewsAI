import express from "express";
import { getAdminPage } from "../controllers/adminControllers.js";

const router = express.Router();

router.get("/", getAdminPage);

export default router;
