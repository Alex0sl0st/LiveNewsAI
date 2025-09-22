import express from "express";
import adminRouter from "./admin.js";
import generalRouter from "./general.js";

const router = express.Router();

router.use("/admin", adminRouter);
router.use("/", generalRouter);

export default router;
