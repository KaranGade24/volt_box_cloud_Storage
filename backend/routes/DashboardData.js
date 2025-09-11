import express from "express";
import { getDashboardData } from "../controller/DashboardData.js";

const router = express.Router();

router.get("/", getDashboardData);

export default router;
