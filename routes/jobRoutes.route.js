import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleCloseJob,
  getJobsEmployer,
} from "../controllers/jobController.controller.js";
import { protect } from "../middlewares/authMiddleware.middleware.js";

const router = express.Router();

router.post("/create", protect, createJob);
router.get("/", protect, getJobs);
router.get("/get-jobs-employer", protect, getJobsEmployer);
router.get("/:id", protect, getJobById);
router.put("/toggle/:id", toggleCloseJob);
router.put("/update/:id", protect, updateJob);
router.delete("/delete/:id", protect, deleteJob);

export default router;
