const express = require("express");
const router = express.Router();
const {errorLog,variables} = require("../utils.js");

router.get("/", (req,res)=>{
    res.send({"test":"1"});
});

module.exports = router;