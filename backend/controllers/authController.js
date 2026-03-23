const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { createUser, findUserByEmail } = require("../models/userModel");



exports.signup = async (req, res) => {
  try {
    const { full_name, email, password, phone_number } = req.body;

    if (!full_name || !email || !password || !phone_number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      full_name,
      email,
      password_hash: hashedPassword,
      phone_number
    });

  
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || "applicant"
      },
      "secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role || "applicant"
      }
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      "secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};