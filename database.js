const mongoose = require("mongoose");

const connectDB = async()=>{
     try {
        const mongo = mongoose.connect("mongodb://127.0.0.1:27017/Users")
        console.log("connected mongoDB!!")

     } catch (error) {
console.log(error);
 return res.status(500).json({mesage:"internal server error"})
     }     
    
};

module.exports = connectDB;
