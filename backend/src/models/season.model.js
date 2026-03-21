const mongoose = require('mongoose')

const seasonSchema = new mongoose.Schema({
    series: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Series",
        required: true
    },
    seasonNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String
    },
    thumbnail: {
        type: String,
        required: true
    }
},{timestamps: true})

const Season = mongoose.model("Season", seasonSchema)

module.exports= Season