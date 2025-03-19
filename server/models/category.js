const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    image: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema); 