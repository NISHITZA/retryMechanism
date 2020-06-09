const router= require('express').Router();
const Ping=require('../models/ping');
require('dotenv').config();
const mongoose = require('mongoose');
let dat=0;
let flag;
let queue = [];
let timer=1;


router.get('/',(req, res)=>{
    res.send('Sending Data')
    console.log('Sender route called');
    flag=0;
    let time=setInterval(sendData,3000);
    setTimeout(()=>{clearInterval(time)},12000)
}
);

function sendData(){
    dat++;
    queue.push(dat);
    let resend=setInterval(transmission,timer*1000);
    setTimeout(()=>{clearInterval(resend)},100000)
}
function transmission() {
    console.log(queue);
    //if(mongoose.connection.readyState==1)
    //{
        while(queue.length!=0 && mongoose.connection.readyState==1)
        {
            timer=1;
            let data=queue.shift();
            console.log('queue shift '+data)
            let newPing=new Ping({
                    data
            });
            newPing.save()
                    .then(res=>console.log('result saved ' +newPing.data));
     //   }
        }
    if(mongoose.connection.readyState!=1) {
        timer=Math.min(timer*2,3600);
        console.log('Timer '+timer);
    }

}




module.exports=router;