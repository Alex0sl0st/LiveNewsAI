import express from "express";
import {
  getAdminPage,
  doNewsAction,
} from "../controllers/adminControllers/index.js";

const router = express.Router();

router.get("/", getAdminPage);
router.post("/newsAction", doNewsAction);

export default router;
