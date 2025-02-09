import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from 'mongoose';
import { info, debugLog as debug, error } from '../utilities/logger.js'; // Logger
import { mySendMailer } from '../utilities/mailer.js'; // Email sender

const User = mongoose.model('User'); // Ensure User model is registered

// Serialize & Deserialize User
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ _id: id })
      .select('name surname stagename slug is_pro is_admin stats image crews email mobile addresses likes')
      .populate([{ path: 'crews', select: 'stagename' }])
      .exec();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Local Strategy for authentication
passport.use(
  new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    debug(`passport.use: ${email}`);

    try {
      const user = await User.findOne({
        $or: [
          { email: { $regex: new RegExp(email, 'i') } },
          { slug: { $regex: new RegExp(email, 'i') } },
          { 'emails.email': { $regex: new RegExp(email, 'i') } }
        ]
      }).select('stagename slug password email');

      if (!user) {
        debug(`User not found: ${email}`);
        return done(null, false, {
          msg: { errors: { email: { message: 'Invalid email or password.' } } },
          redirect: '/login'
        });
      }

      debug(`Checking password for: ${email}`);
      const isMatch = await user.comparePassword(password);

      if (isMatch) {
        debug('User password match');
        return done(null, user);
      } else {
        debug('User password does not match');
        return done(null, false, {
          msg: { errors: { email: { message: 'Invalid email or password.' } } },
          redirect: '/login'
        });
      }
    } catch (err) {
      debug(`Error in authentication: ${JSON.stringify(err)}`);
      return done(err);
    }
  })
);

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Export the configured passport and authentication middleware
export { passport, isAuthenticated };
