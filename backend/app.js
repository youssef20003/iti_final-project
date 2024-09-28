const express = require('express')
const server = express()
const mongoose = require('mongoose')
const Productmodel= require('./models/products')

mongoose.connect('mongodb+srv://youssefm:f7xCCdVxXUZ2Euu1@cluster0.jdvmm.mongodb.net/iti?retryWrites=true&w=majority&appName=Cluster0').then(function () {
    console.log('database connected')
}).catch(function (error) {
    console.log('database disconnected')
})
server.listen(3002)
server.get("/products", function(req , res){
    Productmodel.find().then((data) =>{
    res.send(data)
}).catch(()=>{
    res.send("error")
})
})
