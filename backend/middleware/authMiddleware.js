const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../model/UserModel");

// Passport Local Strategy
const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      // Find user by email
      const user = await UserModel.findOne({ email });
      
      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      // Check password
      const isMatch = await user.authenticate(password);
      
      if (!isMatch) {
        return done(null, false, { message: "Invalid password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = {
  passport,
  localStrategy,
};
