const passport = require('passport');
const SECRET_KEY = "kg@#jvjh68hkzdoi"

const userSchema = require("../userSchema");

var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

let opts1 = {};
opts1.secretOrKey = SECRET_KEY;
opts1.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

module.exports = passport => {
  // super admin Verification
  passport.use(new jwtStrategy(opts1, (jwt_payload, done) => {
    userSchema.find({ _id: jwt_payload._id })
      .then(user => {
        if (user == null) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      })
      .catch(error => console.log(error));
  }
  ));
}


module.exports = passport;