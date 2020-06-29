const express = require("express");
const router = express.Router();
const {errorLog, render, checkValue} = require("../utils.js");
const {cleanBody} = require("../middleware");
const errors = require("../errors");
const Menu = require("../models/menu");
const Page = require("../models/page");
const Section = require("../models/section");
const {checkAuthentication} = require("../middleware");
const css = ["menu"];

router.get("/view/:id", checkAuthentication, async(req, res)=>{
    let menu;
    let pages;
    let sections;
    try{
        menu = await Menu.findById(req.params.id);
        if(typeof menu == "undefined" || menu == null){
            render(req,res,"error",{error:errors.notFoundError});
            return;
        }
        pages = await Page.find({menu:menu._id});
        if(typeof pages == "undefined" || pages == null){
            render(req,res,"error",{error:errors.notFoundError});
            return;
        }
        sections = [];
        for(let page of pages){
            let s = await Section.find({page:page._id}).sort({order:1}).exec();
            sections.push(s);
        }
    }catch(e){
        errorLog(e,req,res,"Could not find menu");
        render(req,res,"error",{error:errors.notFoundError});
        return;
    }
    render(req,res,"menu", {css,menu,pages,sections});
});

router.get("/new", checkAuthentication, (req,res)=>{
    render(req,res,"menu/new",{css});
});

router.post("/new", cleanBody, async(req,res)=>{
    let menu = new Menu({
        name:req.body.name,
        user: req.user._id
    })
    if(req.body.description!="")menu.description = req.body.description;
    try{
        await menu.save();
        
        let pageNum = req.body.pages;
        for(let i = 0; i < pageNum; i++){
            let page = new Page({menu:menu._id});
            await page.save();
        }
    }catch(e){
        if(errorLog(e,req,res,"Error creating new menu, could not save","/"))return;
    }
    req.flash("info", "New menu created");
    res.redirect("/");
});

router.get("/edit/:id", checkAuthentication, async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to edit"))return;
    let menu;
    try{
        menu = await Menu.findById(req.params.id);
        
    }catch(e){
        if(errorLog(e,req,res,"Could not make a menu primary", "/"))return;
    }
    if(typeof menu == "undefined" || menu == null){
        render(req,res,"error",{error:errors.notFoundError});
        return;
    }
    render(req,res,"menu/edit", {menu});
});

router.post("/edit/:id", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to save an edit"))return;
    let menu;
    try{
        menu = await Menu.findById(req.params.id);
        if(!checkValue(res,res,menu,`Could not find a menu with the ID: ${req.params.id}`))return;
        
        menu.name = req.body.name;
        menu.description = req.body.description;
        await menu.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not save an editted menu","/"))return;
    }
    req.flash("info", `${menu.name} Editted`);
    res.redirect("/");
});

router.post("/primary/:id", async(req,res)=>{
    if(!checkValue(res,res,req.params.id, "No ID when trying to make primary"))return;
    try{
        let activeMenu = await Menu.findById(req.params.id);
        if(!checkValue(req,res,activeMenu,`Could not find a menu with the ID: ${req.params.id}`))return;

        let primaryMenu = await Menu.findOne({isPrimary: true});
        if(primaryMenu != null  && typeof menu != "undefined"){
            await primaryMenu.save();
        }
        primaryMenu.isPrimary = false;
        activeMenu.isPrimary = true;
        await activeMenu.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not make a menu primary", "/"))return;
    }
    req.flash("info", "Menu Made Primary");
    res.redirect("/");
});

router.post("/activate/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to activate"))return;
    try{
        let menu = await Menu.findById(req.params.id);
        if(!checkValue(req,res,menu,`Could not find a menu with the ID: ${req.params.id}`))return;

        menu.status = 1;
        await menu.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not activate a menu", "/"))return;
    }
    req.flash("info", "Menu Activated");
    res.redirect("/");
});

router.post("/deactivate/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to deactivate"))return;
    try{
        let menu = await Menu.findById(req.params.id);
        if(!checkValue(req,res,menu,`Could not find a menu with the ID: ${req.params.id}`))return;

        menu.status = 0;
        menu.isPrimary = false;
        await menu.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not deactivate a menu", "/"))return;
    }
    req.flash("info", "Menu Deactivated");
    res.redirect("/");
});

module.exports = router;