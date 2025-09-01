import express from "express";
import {
  applyJob,
  getMyApplications,
  getApplicantsForJob,
  getApplicationById,
  updateStatus,
} from "../controllers/applicationController.controller.js";
import { protect } from "../middlewares/authMiddleware.middleware.js";

const router = express.Router();

router.post("/apply/:jobId", protect, applyJob);
router.get("/my", protect, getMyApplications);
router.get("/applicants/:jobId", protect, getApplicantsForJob);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, updateStatus);

export default router;
