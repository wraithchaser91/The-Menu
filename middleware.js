let sanitize = require("mongo-sanitize");

cleanBody = (req, res, next) =>{
    req.body = sanitize(req.body);
    next();
}

checkAuthentication = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect(`/auth/login`);
    }
}

checkUnAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()){
        return next();
    }else{
        res.redirect(`/`);
    }
}

checkAdmin = (req, res, next) =>{
    if(typeof req.user == "undefined"){
        res.redirect(`/`);
    }else{
        if(req.user.permissionLevel != 0){
            return next();
        }else{
            res.redirect(`/`);
        }
    }
}

module.exports = {
    checkAuthentication,
    checkUnAuthenticated,
    checkAdmin,
    cleanBody
}