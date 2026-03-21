const mongoose = require("mongoose")

const seriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Series title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    genre: [{
        type: String,
        trim: true,
    }],
    isPaid: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    }
},{timestamps: true})

const Series = mongoose.model("Series", seriesSchema)

module.exports = Series