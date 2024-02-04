const express = require('express');

const {
    getMovies,
    getMovie,
    submitComment,
    deleteComment,
    getResults
} = require('../controllers/movieController');

const router = express.Router();

router.get('/', getMovies);
router.get('/movie/:movieId', getMovie);
router.post('/getResults', getResults);
router.post('/:movieId/submit-comment', submitComment);
router.delete('/:movieId/delete-comment/:commentId', deleteComment);

module.exports = router;