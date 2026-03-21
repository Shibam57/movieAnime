const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    videoFile:{
        type: String,
        required: true,
        trim: true
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        min: 0,
        default: 0
    },

    series:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Series",
        required: false
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    }
},{timestamps: true})

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie