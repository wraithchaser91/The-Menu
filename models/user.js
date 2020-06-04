const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    permissionLevel:{
        type: Number,
        required: true,
        default:0
    }
});

module.exports = mongoose.model("User", userSchema);