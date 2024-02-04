const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
    },
    movie: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    prettyDate: {
        type: String
    }
});

module.exports = mongoose.model('Comment', commentSchema);
