const mongoose = require("mongoose");

const relationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    shapes:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Shape",
        default: []
    }
});

module.exports = mongoose.model("Relation", relationSchema);