const express = require("express");
const router = express.Router();
const {render} = require("../utils.js");
const {cleanBody} = require("../middleware");
const {checkAuthentication} = require("../middleware");;
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
    user: 'UP629021@myport.ac.uk',
    pass: 'ghostwanderer1'
    }
});

router.get("/", checkAuthentication, (req, res)=>{
    render(req,res,"support");
});

router.post("/", (req,res)=>{
    const message = {
        from: req.body.from,                    // Sender address
        to: "UP629021@myport.ac.uk",            // List of recipients
        replyTo: req.body.from,                 // Who to reply to?
        subject: req.body.subject,              // Subject line
        text: req.body.text                     // Plain text body
    };
    let success = true;
    transport.sendMail(message, function(err, info) {
        if (err) success = false;
    });
    if(success) req.flash("info", "Message sent successfully");
    else req.flash("error", `Message failed to send: ${err}`);
    res.redirect("/support");
});

module.exports = router;

