const mongoose = require("mongoose");
const Review = require("./review");
const { urlencoded } = require("express");
const Schema = mongoose.Schema;
const defaultImage = "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9nc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"


const listingSchema = new Schema({
    title : {
        type :String,
        required : true
    },
    description : String,
    image : {
       url : String,
       filename : String
    },
    price :{
        type: Number,
        required : true
    },
    location : String,
    country : String,
    reviews : [{
        type:Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type:Schema.Types.ObjectId,
        ref : "User"
    }

});


listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
    
})

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
