const Ws = require("ws");
const dump = require('var_dump');
const url = require("node:url")

const message = require("./message.js");
const user = require("./user.js");

var mysql = require('./db.js');
mysql = mysql.getSql();


const v8 = require('v8');

const structuredClone = obj => {
  return v8.deserialize(v8.serialize(obj));
};


async function main() {

    var u = await mysql.query("SELECT * FROM chat")
    var users = [];

    u[0].forEach(user => {
        users[user.id] = []
        users[user.id][0] = user;
    })

    const Server = new Ws.Server({
        port: 4000
    })

    Server.on("connection", async (ws, req) => {

        ws.userId = url.parse(req.url, true).query.id;
        users[ws.userId][0].Status = 'online';
        users[ws.userId][1] = ws
        
        //console.log(users[ws.userId][1].userId);

        mysql.query(`UPDATE chat SET Status='online' WHERE id='${ws.userId}'`);

        Loadusers(ws)

        ws.on("message", msg => {
            msg = JSON.parse(msg.toString('utf8'));

            switch (msg.act) {

                case "request":
                    
                    requestHandler(msg, ws, users[msg.chat][0].Name);
                break;
                
                case "send":
                   
                    //console.log(msg.to)
                    //console.log(JSON.stringify(users[msg.to][1]))
                    
                    if (users[msg.to][1]){
                        
                        var to = users[msg.to][1];
                        var isConn = true;
                    } else {
                        
                        var to = msg.to;
                        var isConn = false;
                    }
                    
                    messageHandler(msg, ws, to, isConn)
            }

        });


        ws.on("close", ws => {

            //mysql.query(`UPDATE chat SET Status='offline' WHERE id='${query.id}'`);

            //users[ws.userId].Status = 'offline';

        })


    });
    
    console.log("Server running on port 4000!")
}

main();



async function requestHandler(req, ws, chat) {

    var response;
    
    var ctx = req.ctx;

    switch (ctx) {
        
        case "msg":
            
            response = await message.getMessageArray(ws.userId, req.chat, 50);
            
            ws.send(JSON.stringify({
                act: "response", 
                ctx: "loadChat", 
                status: "success",
                reqId: ws.userId, 
                chat: chat, 
                msgs: response
            }))
            
        break;
        
        case "user":
            
            response = await user.getUserArray(ws.userId);
            
            ws.send({
                act:"response",
                ctx:""
            });
            
        break;
    }

}

async function messageHandler(msg, from, to, conn){
    
    if (conn){
        
        var u = await message.sendMessage(msg)
    } else {
 
        var u = await message.sendMessage(msg)
        
        if(u){
            from.send(JSON.stringify({
               act:"update",
               ctx:"msg",
               status:"success",
               msg_id:u,
               id:msg.msg_id,
               ctxStatus:"success"
            }));
        }
    }
}

async function Loadusers(ws){
    
    var u = await user.getUserArray(ws.userId);
    
    ws.send(JSON.stringify({
        act:    "firstLoad",
        ctx:    "user",
        status: "success",
        users:  u
     
    }));
    
}