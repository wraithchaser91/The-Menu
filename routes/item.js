const express = require("express");
const router = express.Router();
const {errorLog, render, checkValue, variables} = require("../utils.js");
const {cleanBody} = require("../middleware");
const Section = require("../models/section");
const Item = require("../models/item");
const {checkAuthentication} = require("../middleware");

router.get("/new/:sectionId", checkAuthentication, async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to create a new Item"))return;
    let section;
    try{
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,"Error finding section"))return;
    }catch(e){
        if(errorLog(e,req,res,"Error finding menu/scction", "/"))return;
    }
    render(req,res,"item/new", {css:["item"],section,categories:variables.categories});
});

router.post("/new/:sectionId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No Section ID when trying to create a new Item"))return;
    let section;
    try{
        section = await Section.findById(req.params.sectionId);
        if(!checkValue(req,res,section,"Error finding section"))return;
        let order = section.numChildren;
        let item = new Item({
            parent:section._id,
            name:req.body.name,
            order,
            hasImage: req.body.hasImage!=null,
            categories: req.body.category,
            price: req.body.price
        });
        if(req.body.description != "")item.description = req.body.description;
        await item.save();
        order++;
        section.numChildren = order;
        await section.save();
    }catch(e){
        if(errorLog(e,req,res,"Error saving new Item", "/"))return;
    }
    res.redirect(`/section/view/${section._id}`);
});

router.get("/edit/:itemId", checkAuthentication, async(req,res)=>{
    if(!checkValue(req,res,req.params.itemId, "No Item ID when trying to open an edit"))return;
    let item;
    try{
        item = await Item.findById(req.params.itemId);
        if(!checkValue(req,res,item,"Error finding item"))return;
    }catch(e){
        if(errorLog(e,req,res,"Error finding item", "/"))return;
    }
    render(req,res,"item/edit", {item});
});

//TODO - do
router.post("/edit/:itemId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.itemId, "No Item ID when trying to save an edit"))return;
    let item;
    try{
        item = await Item.findById(req.params.itemId);
        if(!checkValue(req,res,menu,"Error finding item"))return;
        
        //TODO this part
    }catch(e){
        if(errorLog(e,req,res,"Could not save an edited item","/"))return;
    }
    req.flash("info", `${item.name} Edited`);
    res.redirect(`/section/view/${item.parent}`);
});

router.post("/changeStatus/:id/:value", async(req,res)=>{
    if(!checkValue(req,res,req.params.id, "No ID when trying to change status"))return;
    let value = req.params.value;
    if(!checkValue(req,res,value, "No value when trying to change status"))return;
    let item;
    try{
        item = await Item.findById(req.params.id);
        if(!checkValue(req,res,item,"Error finding item"))return;

        item.status = value;
        await item.save();
    }catch(e){
        if(errorLog(e,req,res,"Could not change status of an item", "/"))return;
    }
    req.flash("info", `Item ${value==0?"Deactivated":"Activated"}`);
    res.redirect(`/section/view/${item.parent}`);
});

router.post("/rearrange/:sectionId", cleanBody, async(req,res)=>{
    if(!checkValue(req,res,req.params.sectionId, "No section ID when trying rearrange items"))return;
    let objects = JSON.parse(req.body.data);
    try{
        for(let i = 0; i < objects.length; i++){
            let ele = await Item.findById(objects[i].ele);
            console.log(ele.name);
            ele.order = i;
            console.log(ele.order);
            await ele.save();
        }
    }catch(e){
        if(errorLog(e,req,res,"Error rearranging items", "/"))return;
    }
    req.flash("info", `Items rearranged`);
    res.redirect(`/section/view/${req.params.sectionId}`);
})

module.exports = router;