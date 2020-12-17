const mongoose = require("mongoose");

const shapeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    sides:{
        type:Number,
        required: true
    },
    area:{
        type: String,
        required: true
    }
});


module.exports = mongoose.model("Shape", shapeSchema);