const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


const registerView = (req, res) => {
  res.render("register", { user: req.user });
};

const registerUser = (req, res) => {
  const { username, email, location, password, confirm } = req.body;

  if (!username || !email || !password || !confirm) {
    req.flash('error', 'Please fill in all fields');
    return res.redirect('/register');
  }

  if (password !== confirm) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/register');
  }

  if (password.length < 6) {
    req.flash('error', 'Password should be at least 6 characters');
    return res.redirect('/register');
  }

  User.findOne({ email: email }).then(user => {
    if (user) {
      req.flash('error', 'Email is already registered');
      res.redirect('/register');
    } else {
      const newUser = new User({
        username,
        email,
        location,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err; 

        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;

          newUser.save()
            .then(user => {
              res.redirect('/login');
            })
            .catch(err => {
              console.error(err);
              req.flash('error', 'An error occurred during registration');
              res.redirect('/register');
            });
        });
      });
    }
  }).catch(err => {
    console.error(err);
    req.flash('error', 'An error occurred checking existing users');
    res.redirect('/register');
  });
};


const loginView = (req, res) => {
  res.render("login", { user: req.user });
};


const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'Fill both fields');
    res.redirect("/login");
  } else {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res);
  }
};


const profileView = (req, res) => {
  res.render('profile', { user: req.user });
}

const updateProfile = async (req, res) => {
  const { imagePath, username } = req.body;
  const userId = req.user._id;

  try {
      await User.findByIdAndUpdate(
        userId, 
        { profile: imagePath, username: username }
      );

      res.redirect('/');
  } catch (error) {
      console.error('Update error:', error);
      res.status(500).send(error);
  }
}

const logoutView = (req, res) => {
  req.logout(function(err) {
    if (err) { 
      req.flash('error', 'Failed to log out');
      return next(err); 
    }
    res.redirect('/login');
  });
};

module.exports = {
  registerView,
  loginView,
  logoutView,
  registerUser,
  loginUser,
  profileView,
  updateProfile
};