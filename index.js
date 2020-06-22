const express = require('express');
const app=express();
const winston=require('winston');
const mongoose = require('mongoose');
require('dotenv').config();
const databaseUri=process.env.ATLAS_URI2;

const port = process.env.PORT||5000;
const mqttRoute=require('./routes/mqtt');

//Format for logging using winston
const loggerFormat=winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info=>`${info.timestamp}  ${info.message}`)
    )
)
//Creating logger using Winston
const logger = {
    win: winston.createLogger({
        level:'info',
        format:loggerFormat,
        transports:[new winston.transports.File({ filename:'app-info.log'})],
    })
}
//View engine set to Embedded Javascript
app.set('view engine','ejs');
app.use(express.urlencoded({ extended:false }));
app.use('/',mqttRoute);

//Connection to MongoDB database
mongoose.connect(databaseUri,{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true})
        .then(res=>{
            logger.win.info('Database has been connected');
            app.listen(port,()=>{
                logger.win.info('Server listening ');
            });
        })
        .catch(error=>{
            logger.win.error('Error while connecting to database');
        })
module.exports = app;
