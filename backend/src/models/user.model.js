const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
    watchHistory: [
        {
            contentId: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: "watchHistory.contentModel",
                required: true
            },
            contentModel: {
                type: String,
                enum: ["Movie", "Episode"],
                required: true
            }
        }
    ],
    purchasedContent: [
        {
            contentId:{
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            contentType:{
                type: String,
                enum: ["Movie", "Series", "Episode"],
                required: true
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
},{timestamps: true});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User', userSchema)

module.exports = User