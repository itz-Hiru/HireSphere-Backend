import express from "express";
import {
  register,
  login,
  getUser,
} from "../controllers/userController.controller";
import { protect } from "../middlewares/authMiddleware.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get", protect, getUser);

export default router;
