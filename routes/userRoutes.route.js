import express from "express";
import {
  updateProfile,
  deleteResume,
  getPublicProfile,
} from "../controllers/userController.controller.js";
import { protect } from "../middlewares/authMiddleware.middleware.js";

const router = express.Router();

router.put("/update/profile", protect, updateProfile);
router.post("/delete/resume", protect, deleteResume);
router.get("/:id", getPublicProfile);

export default router;
