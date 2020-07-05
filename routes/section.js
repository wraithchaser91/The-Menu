const express = require("express");
const router = express.Router();
const {errorLog, render, checkValue} = require("../utils.js");
const {cleanBody} = require("../middleware");
const Menu = require("../models/menu");
const Page = require("../models/page");
const Section = require("../models/section");
const Item = require("../models/item");
const {checkAuthentication} = require("../middleware");

router.get("/view/:sectionId", checkAuthentication, async(req, res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to view a section"))return;
    let section;
    let items
    try{
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,"Error finding section"))return;
        items = await Item.find({parent:section._id}).sort({order:1}).exec();
    }catch(e){
        if(errorLog(e,req,res,"Error finding section", "/"))return;
    }
    render(req,res,"section", {css:["section"],section,items});
});

router.get("/new/:pageId", checkAuthentication, async(req,res)=>{
    if(!checkValue(req,res,req.params.pageId, "No Page ID when trying to create a new section"))return;
    let menu;
    let page;
    try{
        page = await Page.findById(req.params.pageId);
        if(!checkValue(req,res,page,"Error finding page"))return;
        menu = await Menu.findById(page.parent);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
    }catch(e){
        if(errorLog(e,req,res,"Error finding menu/page", "/"))return;
    }
    render(req,res,"section/new", {menu,page});
});

router.post("/new/:pageId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.pageId, "No Page ID when trying to save a new section"))return;
    let menu;
    let page;
    try{
        page = await Page.findById(req.params.pageId);
        if(!checkValue(req,res,page,"Error finding page"))return;
        menu = await Menu.findById(page.parent);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
        let order = page.numChildren;
        let section = new Section({
            page:page._id,
            parent:menu._id,
            name:req.body.name,
            order
        });
        if(req.body.description!="")section.description = req.body.description;
        await section.save();
        order++;
        page.numChildren = order;
        await page.save();
    }catch(e){
        if(errorLog(e,req,res,"Error saving new section", "/"))return;
    }
    res.redirect(`/menu/view/${menu._id}`);
});

router.get("/edit/:sectionId", checkAuthentication, async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to open an edit"))return;
    let section;
    try{
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,"Error finding section"))return;
    }catch(e){
        if(errorLog(e,req,res,"Error finding menu/section", "/"))return;
    }
    render(req,res,"section/edit", {section});
});

router.post("/edit/:sectionId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to save an edit"))return;
    let section;
    try{
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,"Error finding section"))return;
        
        section.name = req.body.name;
        section.description = req.body.description;
        await section.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not save an editted section","/"))return;
    }
    req.flash("info", `${section.name} Edited`);
    res.redirect(`/menu/view/${section.parent}`);
});

router.post("/changeStatus/:id/:value", async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to change status"))return;
    let value = req.params.value;
    if(!checkValue(req,res,value, "No value when trying to change status"))return;
    let section;
    try{
        section = await Section.findById(req.params.id);
        if(!checkValue(req,res,section,"Error finding section"))return;

        section.status = value;
        await section.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not change status of a section", "/"))return;
    }
    req.flash("info", `Section ${value==0?"Deactivated":"Activated"}`);
    res.redirect(`/menu/view/${section.parent}`);
});

router.post("/rearrange/:menuId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.menuId, "No Menu Id when trying to rearrange"))return;
    let menu;
    try{
        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Could not find a menu when deactivating a section"))return;

        let data = JSON.parse(req.body.data);
        for(let d of data){
            let page = await Page.findById(d.id);
            let sections = d.sections;
            page.numChildren = sections.length;
            await page.save();
            for(let i = 0; i < sections.length; i++){
                let section = await Section.findById(sections[i]);
                section.order = i;
                section.page = page._id;
                await section.save();
            }
        }

    }catch(e){
        if(errorLog(e,req,res,"Could not rearrange sections", "/"))return;
    }
    res.redirect(`/menu/view/${menu._id}`);
});

module.exports = router;