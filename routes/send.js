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
    let timer=setInterval(sendData,1000);
    setTimeout(()=>{clearInterval(timer)},25000)
}
);

function sendData() {
    dat++;
    console.log(dat);
    if(flag==1)
    {
        queue.push(dat);
    }
    else {
        let data= dat;
        flag = 0;
        if( flag==0)
        {
            let ping= new Ping({
                data
            });

            ping.save()
                .then(users=>console.log('success'))
                .catch(err=>console.log('error'));                
        }
            
            
    }
        
}



function first(data) {
    console.log('first first')
    let ping= new Ping({
        data
    });

    ping.save()
        .then(res=>console.log('data saved'))
        .catch(
        err => console.log('data not saved')
    )

}




module.exports=router;