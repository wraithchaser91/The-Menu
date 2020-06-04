const express = require("express");
const router = express.Router();
const {errorLog, render} = require("../utils.js");
const {cleanBody} = require("../middleware");
const errors = require("../errors");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {checkAuthentication} = require("../middleware");

router.get("/", checkAuthentication, (req, res)=>{
    render(req,res,"index");
});

router.post("/newuser", cleanBody, async(req,res)=>{
    let user = new User({
        username:req.body.username
    })
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
        await user.save();
    }catch(e){
        if(errorLog(e,req,res,"Failed to create new user"))return;
    }
    req.logOut();
    res.redirect("/");
});

module.exports = router;