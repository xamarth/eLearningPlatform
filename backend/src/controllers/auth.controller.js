import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash
  });

  const token = signToken({ id: user._id });

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ id: user._id });

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email }
  });
};

export const me = async (req, res) => {
  res.json(req.user);
};
