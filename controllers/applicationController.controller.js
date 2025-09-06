import Application from "../models/Application.model.js";
import Job from "../models/Job.model.js";

// @description Apply to a job
// @route /api/application/apply/:jobId
// @access private job seeker
export const applyJob = async (req, res) => {
  try {
    if (req.user.role != "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    const existingJob = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });
    if (existingJob) {
      return res.status(403).json({ message: "Already applied to job" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.user.resume,
    });

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
