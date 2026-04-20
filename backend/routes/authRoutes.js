const express = require("express");
const router = express.Router(); // Create a router instance
const authController = require("../controllers/authController");
const { passport } = require("../middleware/authMiddleware");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Not authenticated",
  });
};

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post("/signup", authController.signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", authController.login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", isAuthenticated, authController.logout);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", isAuthenticated, authController.getMe);

module.exports = router;
//How Routes Work:

// router is like a mini Express app for specific paths
// HTTP methods: GET, POST, PUT, DELETE
// The path is relative to where the router is mounted (/api/auth)
// Middleware like isAuthenticated runs before the controller