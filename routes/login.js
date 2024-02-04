const express = require('express');

const {
    registerView,
    loginView,
    registerUser,
    loginUser,
    logoutView,
    profileView,
    updateProfile
} = require('../controllers/loginController');

const router = express.Router();

router.get('/register', registerView);
router.get('/login', loginView);
router.get('/profile', profileView);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutView);
router.patch('/update', updateProfile);

module.exports = router;