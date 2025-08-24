import express from "express";
import {
  register,
  login,
  getUser,
} from "../controllers/authController.controller.js";
import { protect } from "../middlewares/authMiddleware.middleware.js";
import upload from "../middlewares/uploadMiddleware.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get", protect, getUser);

router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file chosen" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: imageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
});

export default router;
