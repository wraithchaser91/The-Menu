const express = require("express");
const router = express.Router();
const {errorLog, checkValue} = require("../utils.js");
const {cleanBody} = require("../middleware");
const Menu = require("../models/menu");
const Page = require("../models/page");
const Section = require("../models/section");

//method override
const methodOverride = require("method-override");
const item = require("../models/item.js");
const section = require("../models/section");
router.use(methodOverride("_method"));

router.delete("/menu/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id,"No id found when trying to delete menu"))return;
    try{
        let menu = await Menu.findById(req.params.id);
        if(!checkValue(req,res,`No menu found with id: ${req.params.id}`))return;

        let pages = await Page.find({menu:menu._id});
        for(let page of pages){
            let sections = await Section.find({page:page._id});
            for(let section of sections){
                let items = await item.find({section:section._id});
                for(let item of items){
                    await item.remove();
                }
                await section.remove();
            }
            await page.remove();
        }
        await menu.remove();
    }catch(e){
        if(errorLog(e,req,res,"Could not delete a menu", "/"))return;
    }
    req.flash("info", "Menu Deleted");
    res.redirect("/");
});

router.delete("/section/:menuId/:pageId/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.menuId,"No menu id found when trying to delete section"))return;
    if(!checkValue(req,res,req.params.pageId,"No page id found when trying to delete section"))return;
    if(!checkValue(req,res,req.params.id,"No section id found when trying to delete section"))return;
    try{
        let section = await Section.findById(req.params.id);
        if(!checkValue(req,res,section,`Could not find a section with the ID: ${req.params.id}`))return;
        let page = await Page.findById(req.params.pageId);
        if(!checkValue(req,res,page,`Could not find a page with the ID: ${req.params.pageId}`))return;

        let oldOrder = section.order;

        let items = await item.find({section:section._id});
        for(let item of items){
            await item.remove();
        }
        await section.remove();
        let remSections = await Section.find({page:page._id});
        for(let section of remSections){
            if(section.order > oldOrder){
                section.order = section.order-1;
                await section.save();
            }
        }
        page.numChildren = remSections.length;
        await page.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not delete a section", "/"))return;
    }
    req.flash("info", "Section Deleted");
    res.redirect(`/menu/view/${req.params.menuId}`);
});

router.delete("/item/:sectionId/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId,"No section id found when trying to delete item"))return;
    if(!checkValue(req,res,req.params.id,"No section id found when trying to delete item"))return;
    try{
        let item = await Item.findById(req.params.id);
        if(!checkValue(req,res,item,`Could not find an item with the ID: ${req.params.id}`))return;
        let section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,`Could not find a section with the ID: ${req.params.sectionId}`))return;
        let oldOrder = item.order;
        await item.remove();
        let remItems = await Item.find({section:section._id});
        for(let item of remItems){
            if(item.order > oldOrder){
                item.order = item.order-1;
                await item.save();
            }
        }
        section.numChildren = remItems.length;
        await section.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not delete an item", "/"))return;
    }
    req.flash("info", "Item Deleted");
    res.redirect(`/section/view/${req.params.sectionId}`);
})

module.exports = router;