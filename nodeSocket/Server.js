const Ws = require("ws");
const dump = require('var_dump');
const url = require("node:url")

const handlers = require("./handlers.js")

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

        if(url.parse(req.url, true).query.id){
            ws.userId = url.parse(req.url, true).query.id;
            users[ws.userId][0].Status = 'online';
            users[ws.userId][1] = ws

            mysql.query(`UPDATE chat SET Status='online' WHERE id='${ws.userId}'`);
            Loadusers(ws)
        }


        ws.on("message", msg => {
            msg = JSON.parse(msg.toString('utf8'));

            switch (msg.act) {

                case "request":
                    
                    handlers.requestHandler(msg, ws, users[msg.chat][0].Name);
                break;
                
                case "send":
                    
                    if (users[msg.to][1]){
                        
                        var to = users[msg.to][1];
                        var isConn = true;
                    }
                    
                    handlers.messageHandler(msg, ws, to || false, isConn || false)
                break
                
                case "register":
                    
                    handlers.registerHandler(msg, ws)
                break
            }

        });


        ws.on("close", () => {
            
            if(ws.userId){
                mysql.query(`UPDATE chat SET Status='offline' WHERE id='${ws.userId}'`);
                
                users[ws.userId].Status = 'offline';
            }

        })
    });
    
    console.log("Server running on port 4000!")
}

main();


async function Loadusers(ws){
    
    var u = await user.getUserArray(ws.userId);
    
    ws.send(JSON.stringify({
        act:    "firstLoad",
        ctx:    "user",
        status: "success",
        users:  u
    }));
}