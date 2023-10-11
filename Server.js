const Ws = require("ws");
const dump = require("var_dump");

const Server = new Ws.Server({port:4000})

Server.on("connection", (ws) => {
    
    console.log("new connection: \n\n")
    dump(ws);
    
    ws.on("mensage", (msg) => {
        console.log(msg)
    })
    
});