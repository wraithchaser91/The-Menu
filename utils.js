errorLog = (e,req,res,message,redirect="none") => {
    console.log(`ERROR: ${e}`);
    req.flash("error",message);
    if(redirect != "none"){
        res.redirect(redirect);
        return true;
    }
}

render = (req, res, target, json={}) =>{
    res.render(target, Object.assign({
        user:req.user,
        message:req.flash()
    },json));
}

checkValue = (req,res,value, err, redirect="/") =>{
    if(!value || value == "undefined"){
        req.flash("error", err);
        res.redirect(redirect);
        return false;
    }
    return true;
}

const categories = [
    {
        "name":"Meat",
        "colour":"#f00",
        "description":"Must include all meat based products, such as meat based gravy and gelatin as well as all meats."
    },
    {
        "name":"Fish",
        "colour":"#08f",
        "description":"Fish, also in some fish sauces, pizzas, relishes, salad dressings, stock cubes and Worcestershire sauce."
    },
    {
        "name":"Shellfish",
        "colour":"#ff0",
        "description":"Crabs, lobster, prawns and scampi are all included in this category."
    },
    {
        "name":"Mollusc",
        "colour":"#0f0",
        "description":"These include mussels, land snails, squid and whelks, but can also be commonly found in oyster sauce or as an ingredient in fish stews"
    },
    {
        "name":"Dairy",
        "colour":"#00f",
        "description":"Milk is a common ingredient in butter, cheese, cream, milk powders and yoghurt. It can also be found in foods brushed or glazed with milk, and in powdered soups and sauces."
    },
    {
        "name":"Eggs",
        "colour":"#f52",
        "description":"Eggs are often found in cakes, some meat products, mayonnaise, mousses, pasta, quiche, sauces and pastries or foods brushed or glazed with eggs."
    },
    {
        "name":"Honey",
        "colour":"#f0f",
        "description":"Honey can be found in many dressings and marinades. Vegans may not eat this."
    },
    {
        "name":"Peanut",
        "colour":"#f88",
        "description":"Peanuts are often used as an ingredient in biscuits, cakes, curries, desserts, sauces (such as satay sauce), as well as in groundnut oil and peanut flour."
    },
    {
        "name":"Gluten",
        "colour":"#0ff",
        "description":"Wheat, rye, barley and oats is often found in foods containing flour, such as some types of baking powder, batter, breadcrumbs, bread, cakes, couscous, meat products, pasta, pastry, sauces, soups and fried foods which are dusted with flour"
    },
    {
        "name":"Nuts",
        "colour":"#555",
        "description":"You can find nuts in breads, biscuits, crackers, desserts, nut powders (often used in Asian curries), stir-fried dishes, ice cream, marzipan (almond paste), nut oils and sauces."
    },
    {
        "name":"Sesame",
        "colour":"#f05",
        "description":"These seeds can often be found in bread (sprinkled on hamburger buns for example), breadsticks, houmous, sesame oil and tahini. They are sometimes toasted and used in salads"
    },
    {
        "name":"Soya",
        "colour":"#0f8",
        "description":"Often found in bean curd, edamame beans, miso paste, textured soya protein, soya flour or tofu, soya is a staple ingredient in oriental food. It can also be found in desserts, ice cream, meat products, sauces and vegetarian products."
    },
    {
        "name":"Mustard",
        "colour":"#ff4",
        "description":"Liquid mustard, mustard powder and mustard seeds fall into this category. This ingredient can also be found in breads, curries, marinades, meat products, salad dressings, sauces and soups"
    },
    {
        "name":"SO2",
        "colour":"#7f4",
        "description":"This is an ingredient often used in dried fruit such as raisins, dried apricots and prunes. You might also find it in meat products, soft drinks, vegetables as well as in wine and beer. If you have asthma, you have a higher risk of developing a reaction to sulphur dioxide"
    },
    {
        "name":"Lupin",
        "colour":"#f0f",
        "description":"Lupin flour and seeds can be used in some types of bread, pastries and even in pasta."
    },
    {
        "name":"Celery",
        "colour":"#8f9",
        "description":"Includes celery stalks, leaves, seeds and the root called celeriac. You can find celery in celery salt, salads, some meat products, soups and stock cubes."
    }
];

const currencyOptions = [
    "£, Great British Pound",
    "$, United States Dollar",
    "€, Euro",
    "¥, Japanese Yen"
];

variables = {
    "categories":categories,
    "currencyOptions":currencyOptions
};

module.exports = {
    errorLog,
    render,
    checkValue,
    variables
}