const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash')
const methodOverride = require('method-override');

const app = express();

const { loginCheck } = require('./auth/passport');
loginCheck(passport);

const DATABASE_URI = 'mongodb+srv://aleksandramartynuska:nylah@blog.5xwyqoo.mongodb.net/';
mongoose.connect(DATABASE_URI)
    .then(() => console.log('connected'))
    .catch(err => console.log(err));


app.use(express.json());
app.use(flash());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret:'secret6580',
    saveUninitialized: true,
    resave: true
}));

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});


app.use(passport.initialize());
app.use(passport.session());


app.use('/', require('./routes/login'));
app.use('/', require('./routes/movies'));


const PORT = process.env.PORT || 5500;
app.listen(PORT, console.log("Server running on port: " + PORT));
