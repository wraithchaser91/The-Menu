const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
    menu:{
        type: String,
        required: true
    },
    name:{
        type:String
    },
    numChildren:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Page", pageSchema);