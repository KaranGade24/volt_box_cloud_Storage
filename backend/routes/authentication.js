import express from "express";
import { signup, login, logout } from "../controller/authentication.js";
import { authMiddlewareP } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/user", authMiddlewareP);
router.post("/logout", logout);

export default router;
