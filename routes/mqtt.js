const router= require('express').Router();
const pingModel= require('../models/ping');
const mqtt= require('mqtt');
const winston = require('winston');
require('dotenv').config();
const mqttBroker=process.env.MQTT_LINK;

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
//Connection to Mqtt broken
let mqttClient=mqtt.connect(mqttBroker);

//GET route(basic frontend)
router.get('/',(req,res)=>{
    res.render('mq.ejs');
})

let mqttOptions={
    qos:2}

//POST route
router.post('/',async function(req,res){
    let rangeStart=0;
    let rangeEnd=0;

    try{
        rangeStart= req.body.start;
        rangeEnd = req.body.end;
        console.log(rangeStart+"-"+rangeEnd);
        let data=0;
        //Check for incorrect values of range
        if(isNaN(rangeStart)||isNaN(rangeEnd)||(rangeStart>rangeEnd)){
            logger.win.error('Range values incorrect');
            res.status(400).redirect('/');
        }
        res.status(200);
        for(let currentRange=rangeStart;currentRange<=rangeEnd;currentRange++)
        {
            data=currentRange;
            let newRangeData=new pingModel({
                data
            });
            await newRangeData.save()
                    .then(res=>logger.win.info("Data was saved successfully "+currentRange))
                    .catch(err =>{
                        logger.win.error("Error while saving data "+err);
                        //publish into mqtt
                        mqttClient.publish('retry',currentRange.toString(),mqttOptions);   
            })
        }
    }
    catch (error){
        logger.win.error('Error while saving the data '+error);
        res.status(400);
    }
})

module.exports = router;