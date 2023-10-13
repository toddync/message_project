const Ws = require("ws");
const dump = require('var_dump');
const url = require("node:url")

const message = require("./message.js");
const user = require("./user.js");

var mysql = require('./db.js');
mysql = mysql.getSql();


async function main() {

    var u = await mysql.query("SELECT * FROM chat")
    var users = [];

    u[0].forEach(user => {
        users[user.id] = user;
    })

    const Server = new Ws.Server({
        port: 4000
    })

    Server.on("connection", async (ws, req) => {

        ws.userId = url.parse(req.url, true).query.id;
        users[ws.userId].Status = 'online';

        mysql.query(`UPDATE chat SET Status='online' WHERE id='${ws.userId}'`);

        Loadusers(ws)

        ws.on("message", msg => {
            msg = JSON.parse(msg.toString('utf8'));

            switch (msg.act) {

                case "request":
                    requestHandler(msg, ws, users[msg.chat].Name);
                    break;

            }

        });


        ws.on("close", ws => {

            //mysql.query(`UPDATE chat SET Status='offline' WHERE id='${query.id}'`);

            //users[ws.userId].Status = 'offline';

        })


    });
}

main();



async function requestHandler(req, ws, chat) {

    var response;
    
    var ctx = req.ctx;

    switch (ctx) {

        case "msg":

            response = await message.getMessageArray(ws.userId, req.chat);
            
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

async function Loadusers(ws){
    
    var u = user.getUserArray(ws.userId);
    
    ws.send(JSON.stringify({
            act: "firstLoad",
            ctx: "user",
            status: "success",
            users: u
    }));
}