const router= require('express').Router();
const Ping=require('../models/ping');
require('dotenv').config();
const mongoose = require('mongoose');
let dat=0;
let flag=0;
let queue = [];
router.get('/',(req, res)=>{
    console.log("send route called");
    res.send("sending ");
    
    let timer = setInterval(sender,1000);
    setTimeout(()=>{
        clearInterval(timer)
    },5000);
}
);

async function sender(){
    const data=dat+1;
    dat++;
    console.log(`sending data ${data}`)
    if(flag==1){
        queue.push(data);
    }
    if((mongoose.connection.readyState==1) && (flag==0))
    {
        const newPing=new Ping({
                data
            });
        try{
            await newPing.save();
        }
        catch (e) {
            console.log("Error While Saving")
        } 
    }
    else {
        queue.push(data);
        if(flag==0){
            flag=1;
            resend();
        }
}
}
async function resend(){
    console.log('resend called');
    console.log(' '+queue)

    while(queue.length!=0 && mongoose.connection.readyState==1)
    {
        for(i of queue){
            let data=i;
            queue.shift();
            let newPing=newPing({
                data
            });

            try{ 
                await newPing.save();
            }
            
            catch (e) {  
                console.log("Error While Saving");
            }
        }
        flag=0;    
    }
    
}
module.exports=router;