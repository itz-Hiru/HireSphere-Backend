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

// @description Get jobs
// @route /api/jobs/
// access private
export const getJobs = async (req, res) => {
  const { keyword, location, category, type, minSalary, maxSalary, userId } =
    req.query;

  const query = {
    isClosed: false,
    ...(keyword && { title: { $regex: keyword, $options: "i" } }),
    ...(location && { location: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(type && { type }),
  };

  if (minSalary || maxSalary) {
    query.$and = [];

    if (minSalary) {
      query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
    }

    if (maxSalary) {
      query.$and.push({ salaryMin: { $gte: Number(maxSalary) } });
    }

    if (query.$and.length === 0) {
      delete query.$and;
    }
  }
  try {
    const jobs = await Job.find(query).populate(
      "company",
      "name companyName companyLogo"
    );

    let savedJobIds = [];
    let appliedJobStatusMap = {};

    if (userId) {
      // Saved Jobs
      const savedJobs = await SavedJob.find({ jobseeker: userId }).select(
        "job"
      );
      savedJobIds = savedJobs.map((s) => String(s.job));

      // Applications
      const applications = await Application.find({ applicant: userId }).select(
        "job status"
      );
      applications.forEach((app) => {
        appliedJobStatusMap[String(app.job)] = app.status;
      });
    }

    // Add isSaved and applicationStatus to each job
    const jobsWithExtras = jobs.map((job) => {
      const jobIdStr = String(job._id);
      return {
        ...job.toObject(),
        isSaved: savedJobIds.includes(jobIdStr),
        applicationStatus: appliedJobStatusMap[jobIdStr] || null,
      };
    });

    res.status(201).json(jobsWithExtras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @description Get posted jobs by employer
// @route /api/jobs/get-jobs-employer
// @access private
export const getJobsEmployer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;

    if (role !== "employer") {
      return res.status(401).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ company: userId })
      .populate("company", "name companyName companyLogo")
      .lean();

    const jobsWithApplicationCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          job: job._id,
        });
        return {
          ...job,
          applicationCount,
        };
      })
    );

    res.status(201).json(jobsWithApplicationCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @description Get a job by Id
// @route /api/jobs/:id
// @access private
export const getJobById = async (req, res) => {
  try {
    const { userId } = req.query;
    const job = await Job.findById(req.params.id).populate(
      "company",
      "name companyName companyLogo"
    );

    if (!job) {
      return res.status(403).json({ message: "Job not found" });
    }

    let applicationStatus = null;

    if (userId) {
      const application = await Application.findOne({
        job: job._id,
        applicant: userId,
      }).select("status");

      if (application) {
        applicationStatus = application.status;
      }
    }

    res.status(201).json({
      ...job.toObject(),
      applicationStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @description Update a job
// @route /api/jobs/update/:id
// @access private - employer
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(403).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "No permission to update this job" });
    }

    Object.assign(job, req.body);

    const updatedJob = await Job.save();
    res.status(201).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @description Delete a job
// @route /api/jobs/delete/:id
// @access private - employer
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(403).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "No permission to delete this job" });
    }

    await job.deleteOne();
    res.status(201).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @description Toggle close status for a job
// @route /api/jobs/toggle/:id
// @access private - employer
export const toggleCloseJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(403).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "No permission to toggle status for this job" });
    }

    job.isClosed = !job.isClosed;
    await job.save();

    res.status(201).json({ message: "Job closed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
