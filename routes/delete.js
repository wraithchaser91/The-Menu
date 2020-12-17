const express = require("express");
const router = express.Router();
const {errorLog, checkValue} = require("../utils.js");
const {cleanBody} = require("../middleware");
const Menu = require("../models/menu");
const Page = require("../models/page");
const Section = require("../models/section");
const Item = require("../models/item");

//method override
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

router.delete("/menu/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id,"No id found when trying to delete menu"))return;
    try{
        let menu = await Menu.findById(req.params.id);
        if(!checkValue(req,res,"Error finding menu"))return;

        let pages = await Page.find({parent:menu._id});
        for(let page of pages){
            let sections = await Section.find({page:page._id});
            for(let section of sections){
                let items = await Item.find({parent:section._id});
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

router.delete("/section/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id,"No section id found when trying to delete section"))return;
    let section;
    try{
        section = await Section.findById(req.params.id);
        if(!checkValue(req,res,section,"Error finding section"))return;
        let page = await Page.findById(section.page);
        if(!checkValue(req,res,page,"Error finding page"))return;

        let oldOrder = section.order;

        let items = await Item.find({parent:section._id});
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
    res.redirect(`/menu/view/${section.parent}`);
});

router.delete("/item/:id", async(req,res)=>{
    if(!checkValue(req,res,req.params.id,"No section id found when trying to delete item"))return;
    let item;
    try{
        item = await Item.findById(req.params.id);
        if(!checkValue(req,res,item,"Error finding item"))return;
        let section = await Section.findById(item.parent);
        if(!checkValue(req,res,section,"Error finding section"))return;
        let oldOrder = item.order;
        await item.remove();
        let remItems = await Item.find({parent:section._id});
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
    res.redirect(`/section/view/${item.parent}`);
})

module.exports = router;