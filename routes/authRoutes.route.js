import express from "express";
import {
  register,
  login,
  getUser,
} from "../controllers/authController.controller.js";
import { protect } from "../middlewares/authMiddleware.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get", protect, getUser);

export default router;
