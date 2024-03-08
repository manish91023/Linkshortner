require('dotenv').config()
const express = require("express")
const port = process.env.port || 3000
const app = express();
const mongoose = require("mongoose")
const shortId = require('shortid')
const Url = require('./models/Urlshortner');
const shortid = require('shortid');


mongoose.connect(`${process.env.DATABASE}`)
.then(res=>{
    console.log("connected DB")
})
.catch(err=>{
    console.log(err)
}) 

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.post('/',async(req,res)=>{
   const {link,customUrl}=req.body;
   if(!link){
    return res.status(404).send("please provie an url")
   }
   try {
    if(customUrl){
        
        const data = await Url.create({shortId:customUrl,redirectUrl:link})
        res.status(200).send(data)
    }else{
        
        const shortId= shortid(8)
        const data = await Url.create({shortId:shortId,redirectUrl:link})
        res.status(200).send(data)
    }
   } catch (error) {
    console.log(error)
    res.status(500).send("error in generating of short url")

   }

})
app.get('/:shortid',async(req,res)=>{
    const {shortid}=req.params;
    //console.log(id)
    try {
       const data = await Url.findOneAndUpdate({shortId:shortid},{$push:{visitHistory:{timestamp:Date.now()}}})
        if(!data){
            res.send("please provide right link/url")
             
        }
        res.redirect(`${data.redirectUrl}`)
    } catch (error) {
        res.send("error to find data")
    } 
})

app.get('/analytics/:id',async(req,res)=>{
    const id = req.params.id
    try {
        const data = await Url.findOne({shortId:id})
        res.send(data)
       
    } catch (error) {
        console.log(error)
        res.send("error to fetching data")
    }
})

app.listen(port,(err)=>{
    if(!err){
        console.log(`running at ${port}`)
    }
})