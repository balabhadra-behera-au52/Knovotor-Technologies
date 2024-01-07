const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const locationSchema = Schema({
    longitude:{
        type:Number,
        require:true
    },
    latitude:{
        type:Number,
        require:true
    },
    content:{
        type:String
    }
})

module.exports = mongoose.model("location",locationSchema);