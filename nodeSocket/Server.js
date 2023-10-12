const Ws = require("ws");
const dump = require('var_dump');
const url = require("node:url")

const message = require("./message.js");

var mysql = require('./db.js');
mysql = mysql.getSql();


async function main() {

    var u = await mysql.query("SELECT * FROM chat")
    var users = [];

    u[0].forEach(user => {
        users[user.id] = user;
        dump(user.id)
    })


    const Server = new Ws.Server({
        port: 4000
    })

    Server.on("connection", (ws, req) => {

        var query = url.parse(req.url, true).query;
        ws.userId = query.id;
        users[ws.userId].Status = 'online';

        mysql.query(`UPDATE chat SET Status='online' WHERE id='${query.id}'`);

        ws.on("message", (msg, bin) => {
            msg = JSON.parse(msg.toString('utf8'));

            if (msg.act === "request") {
                requestHandler(msg, ws, users[msg.chat].Name);
            }

        });

        ws.on("close",
            ws => {

                //mysql.query(`UPDATE chat SET Status='offline' WHERE id='${query.id}'`);

                //users[ws.userId].Status = 'offline';

            })

    });
}

main();


async function requestHandler(req, ws, chat) {

    var response;

    if (req.ctx === "msg") {

        response = await message.getMessageArray(ws.userId, req.chat);

        ws.send(JSON.stringify({
            act: "response", ctx: "loadChat", status: "success", reqId: ws.userId, username: chat, msgs: response
        }))

    }

}