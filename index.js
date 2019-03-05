'use strict';
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');

const token = '787433090:AAH9bOtlxdJ4dcbAiTI5ZZB3zgNiqdedB-o';
const bot = new TelegramBot(token, {polling: true});
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('COM3', { baudRate: 9600 });
  
function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

port.on("open", function () {
  console.log("open");
  sleep(2000, function() {}); 
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;
    var isOnOff = false;
    if(message.toLowerCase().indexOf("on") > -1) {
      bot.sendMessage(chatId, "LED is ON");
      isOnOff = true;
    }
    else if(message.toLowerCase().indexOf("off") > -1) {
      bot.sendMessage(chatId, "LED is OFF");
      isOnOff = true;
    }
    if (isOnOff) {
        port.write(message + "\r\n",function(err, result) {
            if(err){
                console.log('ERR: ' + err);
            }
            console.log('LED is '+ message);
            sleep(1000, function(){}); 
        }); 
    }
    
});
