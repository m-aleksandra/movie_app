const bcrypt = require("bcryptjs");
LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

const loginCheck = passport => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
          }
          
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect password.' });
            }
          });
        })
        .catch((error) => console.log(error));
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
});
  

};

module.exports = { loginCheck };


