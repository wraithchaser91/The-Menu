const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    section:{
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
    filters:{
        type: [String],
        required:true,
    }
});

module.exports = mongoose.model("Item", itemSchema);