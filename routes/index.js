const express = require("express");
const router = express.Router();
const {errorLog, render} = require("../utils.js");
const {cleanBody} = require("../middleware");
const errors = require("../errors");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Menu = require("../models/menu");
const {checkAuthentication} = require("../middleware");
let currencyOptions = [
    "£, Great British Pound",
    "$, United States Dollar",
    "€, Euro",
    "¥, Japanese Yen"
];

router.get("/", checkAuthentication, async(req, res)=>{
    let menus;
    try{
        menus = await Menu.find({user:req.user._id});
    }catch(e){
        errorLog(e,req,res,"Could not find menus");
        render(req,res,"error",{error:errors.notFoundError});
        return;
    }
    render(req,res,"index",{menus});
});

router.get("/profile", checkAuthentication, (req,res)=>{
    render(req,res,"profile",{css:["profile"]});
});

router.get("/profile/edit", checkAuthentication, (req,res)=>{
    render(req,res,"profile/edit", {css:["profile"], currencyOptions});
});

router.post("/profile/edit", cleanBody, async(req,res)=>{
    try{
        req.user.currency = req.body.currency;
        await req.user.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not save new currency", "/"))return;
    }
    res.redirect("/profile");
});

router.get("/filters", checkAuthentication, (req,res)=>{
    render(req,res,"filters");
})

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