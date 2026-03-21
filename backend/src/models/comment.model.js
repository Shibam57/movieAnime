const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "contentModel"
    },
    contentModel: {
        type: String,
        enum: ["movie", "series", "episode"],
        required: true
    } 
}, {timeseries: true})

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment