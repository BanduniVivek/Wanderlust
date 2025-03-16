const express = require("express");
const router = express.Router({ mergeParams : true });
const { reviewSchema } = require("../schema.js") //joi Schema for validation
const ExpressError = require("../utils/ExpressErrors.js")
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor , validateReview} = require("../middleware.js")

const reviewController = require("../contollers/review.js")


//post Route

router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;

