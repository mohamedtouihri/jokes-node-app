const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.model');

// JWT strategy configuration options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret', // Make sure to set this in your environment variables
};

// Passport JWT strategy configuration
passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      // Find user by id from JWT payload
      const user = await User.findById(jwt_payload.user.id);

      // If user not found
      if (!user) {
        return done(null, false, { message: 'User not found.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Since we're using JWT, we don't need session handling
// These are kept for backwards compatibility but won't be used
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
