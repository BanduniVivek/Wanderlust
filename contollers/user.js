const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res, next) => {
    let { username, email, password } = req.body;
    try {
        const newUser = new User({ email, username });
        const registereduser = await User.register(newUser, password);
        console.log(registereduser);
        await req.login(registereduser, (err) => {
            if(err){
                return next();
            }
            else{
                req.flash("success", `${username}, Welcome to WanderLust`)
                res.redirect("/listings");
            }
        })
        
    }
    catch(e){
        req.flash("error", `Username ${username} already exists`);
        res.redirect("/login");
        
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success"," Welcome back to WanderLust!!");
    res.redirect(res.locals.redirectUrl || "/listings")
}


module.exports.logout = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You are not logged in");
        res.redirect("/listings");
    }
    else{
        req.logout((err)=>{
            if(err){
                return next();
            }
            req.flash("success","You are logged out!!");
            res.redirect("/listings");
        })
    }
}