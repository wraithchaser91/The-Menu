const express = require("express");
const router = express.Router();
const {errorLog,variables} = require("../utils.js");
const cors = require("cors");
const User = require("../models/user")
const Menu = require("../models/menu")
const Page = require("../models/page")
const Section = require("../models/section")
const Item = require("../models/item")
const Relation = require("../models/relation")
const Shape = require("../models/shape")

router.use(cors());

router.get("/relation", async(req,res)=>{
    try{
        // let r = new Relation({name:"test"});
        // await r.save();
        let r = await Relation.findOne({}).populate("shape").exec();
         console.log(r.shapes);
        //  let s = await Shape.findOne({});
        //  console.log(s);
        //  console.log(r.shapes);
        //  r.shapes.push(s);
        //  console.log(r.shapes);
        //  await r.save();
        // let shape = new Shape({
        //     name:"Square",
        //     sides:4,
        //     area:"length * width"
        // });
        // await shape.save();
        // r.shapes.push(shape._id);
        // await r.save();
    }catch(e){console.log(e);}
    res.send("done");
});

router.get("/:id", async(req,res)=>{
    let obj = [];
    try{
        let user = await User.findOne({apiKey:req.params.id});
        let menus = await Menu.find({user:user._id, status:1}).sort({order:1}).exec();
        for(let menu of menus){ //2
            let menuObj = {name:menu.name};
            let pages = await Page.find({parent:menu._id});
            let pageArray = [];
            for(let i = 0; i < pages.length; i++){ //3 3
                let pageObj = {};
                let sections = await Section.find({page:pages[i]._id, status:1}).sort({order:1}).exec();
                let sectionArray = [];
                for(let section of sections){ // 3 4 3 30
                    let sectionObj = {name:section.name};
                    let items = await Item.find({parent:section._id,status:1}).sort({order:1}).exec();
                    sectionObj.items = items;
                    sectionArray.push(sectionObj);
                }
                pageObj.sections = sectionArray;
                pageArray.push(pageObj);
            }
            menuObj.pages = pageArray;
            obj.push(menuObj);
        }
    }catch(e){
        console.log(e);
        obj.push({"error": "Error finding user"});
    }
    console.log(obj);
    res.send(JSON.stringify(obj));
});

router.get("/new/:id", async(req,res)=>{
    let obj = {};
    try{
        let user = await User.findOne({apiKey:req.params.id});
        let menus = await Menu.find({user:user._id, status:1});

        //////Sorting out items into groups
        let totItems = await Item.find({status:1});
        let sectionId;
        let itemGroups = [];
        let itemsToAdd = {};
        let items = [];
        for(let item of totItems){
            if(typeof sectionId == "undefined"){
                sectionId = item.parent;
                itemsToAdd.id = item.parent;
                itemsToAdd.items = items;
                itemsToAdd.items.push(item);
            }else{
                if(sectionId != item.parent){
                    itemGroups.push(itemsToAdd);
                    itemsToAdd = {};
                    items = [];
                    sectionId = item.parent;
                    itemsToAdd.id = item.parent;
                    itemsToAdd.items = items;
                    itemsToAdd.items.push(item);
                }else{
                    itemsToAdd.items.push(item);
                }
            }
        }
        itemGroups.push(itemsToAdd);

        //////Sorting out sections into groups
        let totSections = await Section.find({status:1});
        let pageId;
        let sectionGroups = [];
        let sectionsToAdd = {};
        let sections = [];
        for(let section of totSections){
            if(typeof pageId == "undefined"){
                pageId = section.page;
                sectionsToAdd.id = section.page;
                sectionsToAdd.sections = sections;
                sectionsToAdd.sections.push(section);
            }else{
                if(pageId != section.page){
                    sectionGroups.push(sectionsToAdd);
                    sectionsToAdd = {};
                    sections = [];
                    pageId = section.page;
                    sectionsToAdd.id = section.page;
                    sectionsToAdd.sections = sections;
                    sectionsToAdd.sections.push(section);
                }else{
                    sectionsToAdd.sections.push(section);
                }
            }
        }
        sectionGroups.push(sectionsToAdd);

        //////Sorting out pages into groups
        let totPages = await Page.find({});
        let menuId;
        let pageGroups = [];
        let pagesToAdd = {};
        let pages = [];
        for(let page of totPages){
            if(typeof menuId == "undefined"){
                menuId = page.parent;
                pagesToAdd.id = page.parent;
                pagesToAdd.pages = pages;
                pagesToAdd.pages.push(page);
                console.log("init push")
            }else{
                if(menuId != page.parent){
                    pageGroups.push(pagesToAdd);
                    pagesToAdd = {};
                    pages = [];
                    menuId = page.parent;
                    pagesToAdd.id = page.parent;
                    pagesToAdd.pages = pages;
                    pagesToAdd.pages.push(page);
                    console.log("push");
                }else{
                    pagesToAdd.pages.push(page);
                    console.log("add");
                }
            }
        }
        pageGroups.push(pagesToAdd);
        console.log(pageGroups);

        //////Putting it all together
        obj.menus = [];
        for(let itemGroup of itemGroups){

        }
        obj.user = user;
    }catch(e){
        console.log(e);
        obj.push({"error": "Error finding user"});
    }
    res.send(obj);
});

module.exports = router;

