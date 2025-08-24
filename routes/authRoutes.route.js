import express from "express";
import {
  register,
  login,
  getUser,
} from "../controllers/authController.controller.js";
import { protect } from "../middlewares/authMiddleware.middleware.js";
import { upload } from "../middlewares/uploadMiddleware.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get", protect, getUser);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file choosen" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});

export default router;
