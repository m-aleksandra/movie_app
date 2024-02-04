const Movie = require('../models/Movie');
const Comment = require('../models/Comment');

const cutOverview = (overview) => {
    return overview.length > 100 ? overview.substring(0, 100) + '...' : overview;
}

const getPrettyDate = (dateObject) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObject.toLocaleDateString(undefined, options);
};


const getMovies = async (req, res) => {
    try {
        const user = req.user;
    
        let movies = await Movie.find({});
        movies = movies.map(movie => ({
          ...movie.toObject(),
          shortOverview: cutOverview(movie.overview),
          prettyDate: getPrettyDate(movie.release_date)
        }));
        
        res.render('home', { movies, user });
    } catch (error) {
        res.status(500).send(error);
    }
}

const getMovie = async (req, res) => {
    try {
        const user = req.user;
        const movieId = req.params.movieId;
        let movie = await Movie.findOne({ id: movieId });
        let comments = await Comment.find({ movie: movie.id }).populate('user');

        movie = { 
            ...movie.toObject(),
            prettyDate: getPrettyDate(movie.release_date)
        }
       
        comments = comments.map(comment => ({
            ...comment.toObject(),
            username: comment.user.username,
            profile: comment.user.profile
        }));
        
        res.render('movie', { movie, user, comments }); 
    } catch (error) {
        res.status(500).send(error);
    }
}
const submitComment = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { comment: commentText, rate } = req.body;
        
        if (!rate) {
            req.flash('error', 'You need to submit a rating');
            return res.redirect(`/movie/${movieId}`);
        }

        const { _id: userId } = req.user;
        const rating = parseInt(rate, 10); 
        const prettyDate = getPrettyDate(new Date()); 

        const comment = new Comment({
            rating: rating,
            text: commentText,
            movie: movieId,
            user: userId,
            prettyDate: prettyDate
        });

        await comment.save();

        const movie = await Movie.findOne({ id: movieId });

        const newVoteCount = movie.vote_count + 1;
        const newVoteAverage = ((movie.vote_average * movie.vote_count) + rating) / newVoteCount;

        movie.vote_count = newVoteCount;
        movie.vote_average = parseFloat(newVoteAverage.toFixed(2));

        await movie.save();

        res.redirect(`/movie/${movieId}`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};
const deleteComment = async (req, res) => {
    try {
        const { movieId, commentId } = req.params;

        const comment = await Comment.findById(commentId);
        const movie = await Movie.findOne({ id: movieId });

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        const newVoteCount = movie.vote_count - 1;
        const newVoteAverage = newVoteCount > 0 
            ? ((movie.vote_average * movie.vote_count) - comment.rating) / newVoteCount
            : 0;
        
        movie.vote_count = newVoteCount;
        movie.vote_average = parseFloat(newVoteAverage.toFixed(2));
        await movie.save();
        

        await Comment.findByIdAndDelete(commentId);

        res.redirect(`/movie/${movieId}`);
    } catch (error) {
        res.status(500).send(error);
    }
}

const getResults = async (req, res) => {
    const payload = req.body.payload.trim();
    let search = await Movie.find({
        title: {$regex: new RegExp('^' + payload + '.*', 'i')}
    }).exec();

    search = search.slice(0, 10);
    res.json(search);
}

module.exports = { 
    getMovies,
    getMovie,
    submitComment,
    deleteComment,
    getResults
};