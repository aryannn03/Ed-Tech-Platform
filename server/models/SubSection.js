const mongoose = require('mongoose');


const subSectionSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    time:{
        type:String,
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
    }
})
    

module.exports= mongoose.model("subSection",subSectionSchema);