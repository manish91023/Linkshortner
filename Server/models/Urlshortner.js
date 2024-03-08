const mongoose =require('mongoose')

const urlshortnerSchema = mongoose.Schema({
    shortId:{
        type:String,
        unique:true,
        required:true
    },
    redirectUrl:{
        type:String,
        required:true
    },
    visitHistory:[{timestamp:{type:Number}}],

},{timestamps:true}

);

module.exports=mongoose.model('url',urlshortnerSchema)