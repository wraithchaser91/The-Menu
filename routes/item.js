const express = require("express");
const router = express.Router();
const {errorLog, render, checkValue} = require("../utils.js");
const {cleanBody} = require("../middleware");
const Menu = require("../models/menu");
const Section = require("../models/section");
const Item = require("../models/item");
const {checkAuthentication} = require("../middleware");

router.get("/new/:menuId/:sectionId", checkAuthentication, async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to create a new Item"))return;
    if(!checkValue(req,res,req.params.menuId, "No Menu ID when trying to create a new Item"))return;
    let section;
    let menu;
    try{
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,"Error finding section"))return;
        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
    }catch(e){
        if(errorLog(e,req,res,"Error finding menu/scction", "/"))return;
    }
    render(req,res,"item/new", {menu,section});
});

router.post("/new/:menuId/:sectionId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to create a new Item"))return;
    if(!checkValue(req,res,req.params.menuId, "No Menu ID when trying to create a new Item"))return;
    let section;
    let menu;
    try{
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,"Error finding section"))return;
        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
        let order = section.numChildren;
        let item = new Item({
            section:section._id,
            name:req.body.name,
            order  
        });
        if(req.body.description != "")item.description = req.body.description;
        await item.save();
        order++;
        section.numChildren = order;
        await section.save();
    }catch(e){
        if(errorLog(e,req,res,"Error saving new Item", "/"))return;
    }
    res.redirect(`/section/view/${menu._id}/${section._id}`);
});

router.get("/edit/:sectionId/:itemId", checkAuthentication, async(req,res)=>{
    if(!checkValue(req,res,req.params.itemId, "No Item ID when trying to open an edit"))return;
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to open an edit"))return;
    let menu;
    let section;
    try{
        menu = await Menu.findById(req.params.sectionId);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
        section = await Section.findById(req.params.itemId);
        if(!checkValue(req,res,section,"Error finding section"))return;
    }catch(e){
        if(errorLog(e,req,res,"Error finding menu/section", "/"))return;
    }
    render(req,res,"section/edit", {menu,section});
});

router.post("/edit/:sectionId/:itemId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.itemId, "No Item ID when trying to save an edit"))return;
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to save an edit"))return;
    let menu;
    let section;
    try{
        menu = await Menu.findById(req.params.sectionId);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
        section = await Section.findById(req.params.itemId);
        if(!checkValue(res,res,section,`Could not find a section with the ID: ${req.params.itemId}`))return;
        
        section.name = req.body.name;
        section.description = req.body.description;
        await section.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not save an editted section","/"))return;
    }
    req.flash("info", `${section.name} Editted`);
    res.redirect(`/menu/view/${menu._id}`);
});

router.post("/activate/:sectionId/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to activate"))return;
    if(!checkValue(req,res,req.params.sectionId, "No section ID when trying to activate"))return;
    let menu;
    try{
        let section = await Section.findById(req.params.id);
        if(!checkValue(req,res,section,`Could not find a section with the ID: ${req.params.id}`))return;

        section.status = 1;
        await section.save();

        menu = await Menu.findById(req.params.sectionId);
        if(!checkValue(req,res,menu,"Could not find a menu when activating a section"))return;
    }catch(e){
        if(errorLog(e,req,res,"Could not activate a section", "/"))return;
    }
    req.flash("info", "Section Activated");
    res.redirect(`/menu/view/${menu._id}`);
});

router.post("/deactivate/:sectionId/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to deactivate"))return;
    if(!checkValue(req,res,req.params.sectionId, "No section ID when trying to deactivate"))return;
    let menu;
    try{
        let section = await Section.findById(req.params.id);
        if(!checkValue(req,res,section,`Could not find a section with the ID: ${req.params.id}`))return;

        section.status = 0;
        await section.save();

        menu = await Menu.findById(req.params.sectionId);
        if(!checkValue(req,res,menu,"Could not find a menu when deactivating a section"))return;
    }catch(e){
        if(errorLog(e,req,res,"Could not deactivate a section", "/"))return;
    }
    req.flash("info", "Section Deactivated");
    res.redirect(`/menu/view/${menu._id}`);
});

module.exports = router;