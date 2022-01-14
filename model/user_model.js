
const mongoose = require("../db");



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean
    },
    isPhoneVerified: {
        type: Boolean
    },
    isAdmin: {
        type: Boolean
    },
    status: {
        type: String,
        enum: ["Active", "Blocked", "Deleted"],
        default: 'Active'
    },
    isDeleted: {
        type: Boolean
    },
    blockedFor: {
        type: String
    },
    blockedAt: {
        type: String
    },
    blockedBy: {
        type: String
    }

});



module.exports = mongoose.model("info", userSchema);
