const mongoose = require('mongoose')

const episodeSchema = new mongoose.Schema({
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Season",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    episodeNumber: {
        type: Number, 
        required: true
    },
    videoUrl: {
        type: String,
        required:true
    },
    thumbnail: {
        type: String
    },
    releaseDate: {
      type: Date,
      default: Date.now // useful if you want scheduled weekly releases
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0,
        
    }
}, {timestamps: true})

const Episode = mongoose.model("Episode", episodeSchema);

module.exports = Episode