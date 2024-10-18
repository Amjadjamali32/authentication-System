import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const { Schema } = mongoose; 

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    profileImage: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    refreshToken: {
        type: String
    },
    adminSecret: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    } 

}, { timestamps: true })

// pre hook to encrypt password before saving
userSchema.pre("save" , async function(next) {
    if(!this.isModified("password")) {
        return next();
    }   
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

// password verification custom method
userSchema.methods.isPasswordCorrect = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword , this.password)
}

// custom method to generate access tokens
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id:this._id,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// custom method to generate refresh tokens
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role,
        },
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User" , userSchema)