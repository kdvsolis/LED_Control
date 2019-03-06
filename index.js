'use strict';
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');

const token = '787433090:AAH9bOtlxdJ4dcbAiTI5ZZB3zgNiqdedB-o';
const bot = new TelegramBot(token, {polling: true});
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('COM3', { baudRate: 9600 });
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://ledcontrollertest:QWERtyuiOP@cluster0-ckkad.gcp.mongodb.net/test?retryWrites=true";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});  
  
function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
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
    var isRegistered = false;
    
    if(message.startsWith("REG")) {
          MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mydb");
          var myobj = { chat_id: message.replace("REG ", "") };
          dbo.collection("users").insertOne(myobj, function(err, res) {
            if (err) throw err;
                    bot.sendMessage(message.replace("REG ", ""), "Successfully Registered");
                console.log("1 user inserted");
            db.close();
          });
        }); 
    }
    
    else {
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mydb");
          dbo.collection("users").findOne({ chat_id : chatId.toString() }, function(err, result) {
            if (err) throw err;
            else if (result.chat_id == chatId) {    
                if(message == "/start") {       
                    bot.sendMessage(chatId, "Ready for Orders\r\n"+
                                               "Commands:\r\n"+
                                               "ROOM[x] STATUS\r\n"+
                                               "Where:\r\n"+
                                               "X - Room Number\r\n"+
                                               "STATUS - ON/OFF\r\n");
                    }
                if(message.toLowerCase().indexOf("on") > -1) {
                  try {
                    var reply = message.substring(0, message.indexOf(' ')) + ' is ON';
                    console.log(reply);
                    bot.sendMessage(chatId, reply);
                  } catch(err) {
                      bot.sendMessage(chatId, reply);
                  }
                  isOnOff = true;
                }
                else if(message.toLowerCase().indexOf("off") > -1) {
                  try {
                    var reply = message.substring(0, message.indexOf(' ')) + ' is OFF';
                    console.log(reply);
                    bot.sendMessage(chatId, reply.toString());
                  } catch(err) {
                      bot.sendMessage(chatId, reply.toString());
                  }
                  isOnOff = true;
                }
                if (isOnOff) {
                    port.write(message.toLowerCase() + "\r\n",function(err, result) {
                        if(err){
                            console.log('ERR: ' + err);
                        }
                        console.log(message);
                        sleep(1000, function(){}); 
                    }); 
                }
            }
            db.close();
          });
        }); 
    }

});
