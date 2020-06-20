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

module.exports = {
    errorLog,
    render,
    checkValue
}