const jwt = require("jsonwebtoken");

// Use an environment variable for the secret
const secret = process.env.JWT_SECRET || "default_secret";

// Function to create JWT token
function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secret,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
}

// Function to verify JWT token
function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};