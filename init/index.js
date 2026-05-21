const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main() 
    .then(() => {           
        console.log("connection successful");
    })   
    .catch(err => console.log(err));  
  
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb = async () => {
    await Listing.deleteMany({});//already data pada hai usko phele clean kro
    initData.data = initData.data.map((obj) => ({...obj, owner:"652d0081ae547c5d37e56b5f"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDb(); 
