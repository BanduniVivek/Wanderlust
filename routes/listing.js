const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js")   //joi Schema for validation
const ExpressError = require("../utils/ExpressErrors.js")
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn,saveRedirectUrl, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../contollers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    // .post(validateListing, wrapAsync(listingController.createListing)); //create route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

//new route
//this is before "/listings/:id" because else it will treat new as id and send request to that page

router.get("/new", isLoggedIn, listingController.renderNewForm)


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    //show route "/listings/:id"
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))  
    //update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) 
    //delete route


module.exports = router;
