const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: "No desciption provided for this menu"
    },
    user:{
        type: String,
        required: true
    },
    status:{
        type: Number,
        default:0
    },
    isPrimary:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Menu", menuSchema);