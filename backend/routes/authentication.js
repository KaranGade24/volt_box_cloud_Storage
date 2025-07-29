import express from "express";
import { signup, login } from "../controller/authentication.js";
import { authMiddlewareP } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/user", authMiddlewareP);

export default router;
