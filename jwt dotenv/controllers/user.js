const User = require("../models/user");
const { setUser } = require("../service/auth"); // Function to generate JWT token

// Handle user signup
async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  try {
    const newUser = await User.create({ name, email, password });
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user" });
  }
}

// Handle user login and generate JWT token
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    // Find user
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    // Generate JWT token
    const token = setUser(user);
    console.log("Generated JWT Token:", token); // Log token to confirm generation

    // Set token in an HTTP-only cookie with a 1-hour expiration
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    // Return token in response JSON for visibility in Postman
    return res.json({
      message: "Login successful",
      token: token, // Token included for verification in Postman
    });
  } catch (error) {
    console.error("Error during login:", error); // Log any errors for debugging
    return res.status(500).json({ error: "Login failed" });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
