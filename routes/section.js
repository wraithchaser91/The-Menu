const express = require("express");
const router = express.Router();
const {errorLog, render, checkValue} = require("../utils.js");
const {cleanBody} = require("../middleware");
const Menu = require("../models/menu");
const Page = require("../models/page");
const Section = require("../models/section");
const Item = require("../models/item");
const {checkAuthentication} = require("../middleware");

router.get("/view/:menuId/:sectionId", checkAuthentication, async(req, res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to view a section"))return;
    if(!checkValue(req,res,req.params.menuId, "No Menu ID when trying to view a section"))return;
    let menu;
    let section;
    let items
    try{
        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,"Error finding section"))return;
        items = await Item.find({section:section._id});
    }catch(e){
        if(errorLog(e,req,res,"Error finding menu/section", "/"))return;
    }
    render(req,res,"section", {menu,section,items});
});

router.get("/new/:menuId/:pageId", checkAuthentication, async(req,res)=>{
    if(!checkValue(req,res,req.params.pageId, "No Page ID when trying to create a new section"))return;
    if(!checkValue(req,res,req.params.menuId, "No Menu ID when trying to create a new section"))return;
    let menu;
    let page;
    try{
        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
        page = await Page.findById(req.params.pageId);
        if(!checkValue(req,res,page,"Error finding page"))return;
    }catch(e){
        if(errorLog(e,req,res,"Error finding menu/page", "/"))return;
    }
    render(req,res,"section/new", {menu,page});
});

router.post("/new/:menuId/:pageId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.pageId, "No Page ID when trying to save a new section"))return;
    if(!checkValue(req,res,req.params.menuId, "No Menu ID when trying to save a new section"))return;
    let menu;
    let page;
    try{
        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
        page = await Page.findById(req.params.pageId);
        if(!checkValue(req,res,page,"Error finding page"))return;
        let order = page.numChildren;
        let section = new Section({
            page:page._id,
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

router.get("/edit/:menuId/:sectionId", checkAuthentication, async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to open an edit"))return;
    if(!checkValue(req,res,req.params.menuId, "No Menu ID when trying to open an edit"))return;
    let menu;
    let section;
    try{
        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,"Error finding section"))return;
    }catch(e){
        if(errorLog(e,req,res,"Error finding menu/section", "/"))return;
    }
    render(req,res,"section/edit", {menu,section});
});

router.post("/edit/:menuId/:sectionId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to save an edit"))return;
    if(!checkValue(req,res,req.params.menuId, "No Menu ID when trying to save an edit"))return;
    let menu;
    let section;
    try{
        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Error finding menu"))return;
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(res,res,section,`Could not find a section with the ID: ${req.params.sectionId}`))return;
        
        section.name = req.body.name;
        section.description = req.body.description;
        await section.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not save an editted section","/"))return;
    }
    req.flash("info", `${section.name} Editted`);
    res.redirect(`/menu/view/${menu._id}`);
});

router.post("/activate/:menuId/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to activate"))return;
    if(!checkValue(req,res,req.params.menuId, "No menu ID when trying to activate"))return;
    let menu;
    try{
        let section = await Section.findById(req.params.id);
        if(!checkValue(req,res,section,`Could not find a section with the ID: ${req.params.id}`))return;

        section.status = 1;
        await section.save();

        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Could not find a menu when activating a section"))return;
    }catch(e){
        if(errorLog(e,req,res,"Could not activate a section", "/"))return;
    }
    req.flash("info", "Section Activated");
    res.redirect(`/menu/view/${menu._id}`);
});

router.post("/deactivate/:menuId/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to deactivate"))return;
    if(!checkValue(req,res,req.params.menuId, "No menu ID when trying to deactivate"))return;
    let menu;
    try{
        let section = await Section.findById(req.params.id);
        if(!checkValue(req,res,section,`Could not find a section with the ID: ${req.params.id}`))return;

        section.status = 0;
        await section.save();

        menu = await Menu.findById(req.params.menuId);
        if(!checkValue(req,res,menu,"Could not find a menu when deactivating a section"))return;
    }catch(e){
        if(errorLog(e,req,res,"Could not deactivate a section", "/"))return;
    }
    req.flash("info", "Section Deactivated");
    res.redirect(`/menu/view/${menu._id}`);
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