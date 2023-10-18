const Ws = require("ws");
const url = require("node:url")

const handlers = require("./handlers.js")
const user = require("./user.js")

var mysql = require('./db.js');
mysql = mysql.getSql();

async function main() {

    var u = await mysql.query("SELECT * FROM chat")
    var users = [];

    u[0].forEach(user => {
        users[user.id] = []
        users[user.id][0] = user;
        console.log(user.id, user.Name)
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

            handlers.handle(msg, users, ws);

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