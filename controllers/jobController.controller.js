import Job from "../models/Job.model.js";
import User from "../models/User.model.js";
import Application from "../models/Application.model.js";
import SavedJob from "../models/SavedJob.model.js";

// @description Create job
// @route /api/jobs/create
// @access private - employer
export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(404)
        .json({ message: "Only employers can create jobs" });
    }

    const job = await Job.create({ ...req.body, company: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
