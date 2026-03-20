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
