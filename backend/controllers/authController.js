//Controllers contain the actual business logic for handling requests.
const UserModel = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const JWT_SECRET = process.env.JWT_SECRET;

const isDatabaseUnavailable = (res) => {
  if (mongoose.connection.readyState === 1) {
    return false;
  }

  res.status(503).json({
    success: false,
    message: "Database is not connected. Please start the backend database and try again.",
  });
  return true;
};

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    if (isDatabaseUnavailable(res)) {
      return;
    }


 // Get data from request
    const { email, password, phone, username } = req.body; 

// Business logic (create user, hash password, etc.)

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user
    const newUser = new UserModel({
      username: username || email.split("@")[0],
      email,
      phone,
      balance: 0,
    });

    // Register user (password hashing handled automatically)
    await UserModel.register(newUser, password);

    // Generate JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ // Send response
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        balance: newUser.balance || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Request-Response Flow:

// req (request) contains data from the client
// res (response) is what you send back
// Controllers process the request and return appropriate responses

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    if (isDatabaseUnavailable(res)) {
      return;
    }

    const { email, password } = req.body;

    // Authenticate using passport-local-mongoose
    UserModel.authenticate()(email, password, (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          balance: user.balance || 0,
        },
      });
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= VERIFY TOKEN =================
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ================= LOGOUT =================
exports.logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// ================= GET CURRENT USER =================
exports.getMe = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    UserModel.findById(decoded.id)
      .select("email username balance")
      .lean()
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found.",
          });
        }

        return res.status(200).json({
          success: true,
          user: {
            id: decoded.id,
            email: user.email,
            username: user.username,
            balance: user.balance || 0,
          },
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
