const mongoose = require("mongoose");
 const Schema = mongoose.Schema;
 const postSchema = Schema({
    title:{
        type:String,
        require:true,
    },
    body:{
        type:String,
        require:true,
    },
    createdBy:{
        type:mongoose.Types.ObjectId,ref:'user',require:true,
        require:true,
    },
    active:{
        type:Boolean,
        require:true,
    },
    inactive:{
          type:Boolean,
          require:true    
    },

Geolocation:{
   type:{type:String,require:true},
   coordinates:[]
},
    

 },
 {timestams:true});


 postSchema.index({ location: '2dsphere' });


 module.exports = mongoose.model('post',postSchema);