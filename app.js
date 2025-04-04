if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressErrors.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const multer = require("multer");
const upload = multer({ dest: 'uploads/'});


const dbUrl = process.env.ATLASDB_URL;
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const User = require("./models/user.js");


const { cookie } = require("express/lib/response.js");
const {saveRedirectUrl}  = require("./middleware.js");
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret :process.env.SECRET
    },
    touchAfter : 24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


async function main(){
    await mongoose.connect(dbUrl);
}

main().then(()=>{
    console.log("mongoose connection successfull");
}).catch((err)=>{
    console.log(err);
})


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use(saveRedirectUrl);

app.use("/", userRouter)
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);


//if the entered page is among not all mentioned above then sending page not found error in others
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

// error handling middlewaress
app.use((err,req,res,next)=>{
    let {statusCode = 500 , message = "something went wrong"} = err;
    // res.status(statusCode).send(message);
    console.log(err);
    res.status(statusCode).render("error.ejs", {message})
})

app.listen(8080, ()=>{
    console.log("server is listening at port 8080");
})