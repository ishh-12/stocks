//Models define the structure of your data and handle database operations.
// Why Models?

// Define data structure and validation rules
// Provide methods to interact with database (find, save, update, delete)
// Abstract database operations from your controllers
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true, 
    unique: true,
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add username and password fields and methods for authentication
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // Use email as the username
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
// Why Models?

// Define data structure and validation rules
// Provide methods to interact with database (find, save, update, delete)
// Abstract database operations from your controllers
