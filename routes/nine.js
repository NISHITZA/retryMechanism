const router= require('express').Router();
const Ping=require('../models/ping');
require('dotenv').config();
const mongoose = require('mongoose');
let dat=0;
let flag;
let queue = [];


router.get('/',(req, res)=>{
    res.send('Sending Data')
    console.log('Sender route called');
    flag=0;
    let timer=setInterval(()=>{
        dat++;
        console.log(`Sending Data ${dat}`);
        if(flag==0)
        {   
            console.log('First try');
            firstTry(dat);
        }
        else{
            console.log('Retry');
            reTry(dat);
        }
    },2000);

    clearInterval((timer,10000));
}
);

async function firstTry(dat){
    let data = dat;
    if(mongoose.connection.readyState==1 && flag==0){
        let newPing=new Ping({
            data
        });
        try{
            newPing.save();
        }
        catch (e) {
            console.error('Error While saving the data');
        }
    }
    else{
        flag=1;
        queue.push(data);
    }
}
async function reTry(dat)
{
    queue.push(dat);
    console.log(queue);
    if(mongoose.connection.readyState==1){
        while(queue.length==0){
            let data=queue.shift();
            console.log('Resending Data '+data)
            let newPing = new Ping({ 
                data 
            });
            try{
                newPing.save();
            }
            catch (e) {
                console.error('Error While saving')
            }
        }
        flag=0;
    }
}


module.exports=router;