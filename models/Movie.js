const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    backdrop_path: {
        type: String,
        required: false
    },
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    overview: { 
        type: String, 
        required: false 
    }, 
    poster_path: { 
        type: String, 
        required: false 
    }, 
   
    release_date: { 
        type: Date, 
        required: false 
    }, 
   
    vote_average: { 
        type: Number, 
        required: true 
    },
    vote_count: { 
        type: Number, 
        required: true 
    }
});


module.exports = mongoose.model('Movie', movieSchema);