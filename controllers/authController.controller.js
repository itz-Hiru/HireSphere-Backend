import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

// @description Register new user
// @route /api/register
// @access public
export const register = async (req, res) => {
  try {
    const { name, email, password, avatar, role } = req.body;
    const existUser = await User.findOne({ email });

    if (existUser)
      return res.status(400).message({ message: "User already exists" });

    const user = await User.create({ name, email, password, role, avatar });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      companyLogo: user.companyLogo || "",
      resume: user.resume || "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @description Login new user
// @route /api/login
// @access public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ message: "Couldn't find user from the email" });
    if (!(await user.matchPassword(password))) {
      return res
        .status(400)
        .json({ message: "Password Invalid. Please enter correct password" });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      companyLogo: user.companyLogo || "",
      resume: user.resume || "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @description Get excisting user
// @route /api/get
// @access private
export const getUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
