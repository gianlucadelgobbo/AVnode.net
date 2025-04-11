import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from 'mongoose';
import { logger, requestLogger, errorLogger } from '../utilities/logger.js'; // Logger

const User = mongoose.model('User'); // Ensure User model is registered

// Serialize & Deserialize User
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  logger.debug(`deserializeUser: ${id}`);
  try {
    const user = await User.findOne({ _id: id })
    .select('name surname stagename slug is_pro is_admin stats image crews email mobile addresses likes')
    .populate([{ path: 'crews', select: 'stagename' }])
    .exec();
    const result = {
      ...user.toObject({ virtuals: true }),
      crews: user.crews.map(({ _id, stagename }) => ({ _id, stagename }))
    };
    delete result.password;
    delete result.image;
    delete result.id;
    done(null, result);
  } catch (err) {
    done(err, null);
  }
});

// Local Strategy for authentication
passport.use(
  new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    logger.debug(`LocalStrategy passport.use: ${email}`);

    try {
      const user = await User.findOne({
        $or: [
          { email: { $regex: new RegExp(email, 'i') } },
          { slug: { $regex: new RegExp(email, 'i') } },
          { 'emails.email': { $regex: new RegExp(email, 'i') } }
        ]
      })
      .select('name surname stagename slug password is_pro is_admin stats image crews email mobile addresses likes')
      .populate([{ path: 'crews', select: 'stagename' }])
      .exec();

      if (!user) {
        logger.debug(`User not found: ${email}`);
        return done(null, false, {
          msg: { errors: { email: { message: 'Invalid email or password.' } } },
          redirect: '/login'
        });
      }

      logger.debug(`Checking password for: ${email}`);
      const isMatch = await user.comparePassword(password);

      if (isMatch) {
        logger.debug('User password match');
        const result = {
          ...user.toObject({ virtuals: true }),
          crews: user.crews.map(({ _id, stagename }) => ({ _id, stagename }))
        };
        delete result.password;
        delete result.image;
        delete result.id;
        return done(null, result);
      } else {
        logger.debug('User password does not match');
        return done(null, false, {
          msg: { errors: { email: { message: 'Invalid email or password.' } } },
          redirect: '/login'
        });
      }
    } catch (err) {
      logger.debug(`Error in authentication: ${JSON.stringify(err)}`);
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
