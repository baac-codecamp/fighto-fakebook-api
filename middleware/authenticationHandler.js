const config = require('../config/index');
const User = require('../models/userModel');
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {}
opts.secretOrKey = config.JWT_SECRET;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        
       const user = await User.findById(jwt_payload.id); 
       if (!user) {
        return done(new Error('Connot find this user'), false);
       }

       return done(null, user);

    } catch (error) {
        done(error);
    }
}));

module.exports.isLoggedIn = passport.authenticate('jwt', { session: false });