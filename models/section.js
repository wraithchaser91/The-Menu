const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    page:{
        type: String,
        required: true
    },
    parent:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: "No desciption provided for this section"
    },
    status:{
        type: Number,
        default: 1
    },
    order:{
        type: Number,
        required: true
    },
    numChildren:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Section", sectionSchema);