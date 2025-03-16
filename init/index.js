//initializing database with data in data.js
const mongoose = require("mongoose");

const Listing = require("../models/listing.js")
const initData = require("./data.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'


main().then(()=>{
    console.log("mongoose connection successfull");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((el)=>({...el, owner : "67cf38fe06e5ee1bbc32bab4"}));//adding owner to each listing
    await Listing.insertMany(initData.data);
    console.log("database initialization done sucessfully");
}


initDB();
