import fs from "fs";
import path from "path";
import User from "../models/User.model.js";

// @description Update user profile
// @route /api/user/update/profile
// @access private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User not found" });

    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
    user.resume = resume || user.resume;

    // If employer allow updating company info
    if (user.role === "employer") {
      user.companyName = companyName || user.companyName;
      user.companyDescription = companyDescription || user.companyDescription;
      user.companyLogo = companyLogo || user.companyLogo;
    }

    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      companyName: user.companyName,
      companyDescription: user.companyDescription,
      companyLogo: user.companyLogo,
      resume: user.resume || "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @description Delete resume
// @route /api/user/delete/resume
// @access private (job seeker)
export const deleteResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body;
    const fileName = resumeUrl?.split("/")?.pop();

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "jobseeker")
      return res
        .status(403)
        .json({ message: "Only job seekers can delete resume" });

    const filePath = path.join(__dirname, "../uploads", fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    user.resume = "";
    await user.save();

    res.status(201).json({ message: "Resume deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @description Get public profile
// @route api/user/:id
// access public
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
