import User, { findOne } from "../models/User";
import { sign } from "jsonwebtoken";

// Register user
export async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Login user
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get user profile
export async function getProfile(req, res) {
  res.json(req.user);
}