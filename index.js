const express = require('express');
const app=express();
const mongoose = require('mongoose');
require('dotenv').config();
const uri=process.env.ATLAS_URI;

const port = process.env.PORT||5000;
const send=require('./routes/send2');
app.use('/',send);

mongoose.connect(uri,{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true});
const connection=mongoose.connection;
try{
    connection.once('open',()=>{
        console.log('DB connected');
    })
}
catch (err) {
    console.log('Server error');
}



app.listen(port,()=>{
    console.log('server listening ');
});