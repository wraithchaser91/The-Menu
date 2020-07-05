const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    parent:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type:String
    },
    status:{
        type: Number,
        default: 0
    },
    order:{
        type:Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    hasImage:{
        type: Boolean,
        required: true
    },
    categories:{
        type: [String],
        required:true,
    }
});

module.exports = mongoose.model("Item", itemSchema);