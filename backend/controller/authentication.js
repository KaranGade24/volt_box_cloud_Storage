import User from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    console.log("Received request to signup:", req.body);

    // Validate request body
    const { fullName, email, password, confirmPassword, agreeTerms } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields (name, email, password)" });
    }

    // Basic email format validation (can be more sophisticated with a library)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check for existing user
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" }); // Use 409 Conflict for existing resource
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 15);

    // Create new user
    const newUser = new User({
      name: fullName,
      email: email,
      password: hashedPassword,
    });

    // Save new user to the database
    await newUser.save();

    // Generate JWT
    // It's recommended to use an environment variable for the JWT secret
    const jwtSecret = process.env.JWT_SECRET || "secret"; // Use environment variable for secret
    const token = jwt.sign({ user: newUser._id }, jwtSecret, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure to true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send success response
    res
      .status(201)
      .send({ message: "User created successfully", token, user: newUser }); // Use 201 Created for successful resource creation
  } catch (error) {
    console.error("Error during signup:", error); // Log the full error for debugging

    // Handle specific Mongoose validation errors if needed
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    // Generic error response for unexpected errors
    res.status(500).json({ message: "An error occurred during signup." });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Received request to login:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields (email, password)" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // Make sure this is defined in your .env file
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set true in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send success response
    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

export const logout = async (req, res) => {
  try {
    // If using JWT → clear token from cookies
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" });

    // If using session → destroy session
    if (req.session) {
      req.session.destroy(() => {
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(200).json({ message: "Logged out successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
};
