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
    },
    currency:{
        type: String,
        default: "£, Great British Pound"
    },
    activeFilters:{
        type: [String],
        default: []
    },
    apiKey:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);