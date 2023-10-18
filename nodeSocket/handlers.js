const message = require("./message.js");
const user = require("./user.js");


async function handle(msg, users, ws){
    
    switch (msg.act) {

        case "request":
           
            requestHandler(msg, ws, users[msg.chat][0]);
        break;
          
        case "send":
         
            if (users[msg.to][1]){
             
                var to = users[msg.to][1];
                var isConn = true;
            }
            
            messageHandler(msg, ws, to || false, isConn || false)
        break
       
        case "register":
           
            registerHandler(msg, ws)
        break
        
        case "relation":
            
            if(msg.ctx == "add"){
                user.addRelation(msg, ws)
            }
    }
}


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
                chat: chat.Name,
                img: chat.Image,
                msgs: response
            }))
            
        break;
        
        case "user":
            
            response = await user.getUserArray(ws.userId, req);
            
            ws.send({
                act:"response",
                ctx:"loadUsers",
                status:"success"
            });
        break;
    }

}

async function messageHandler(msg, from, to, conn){
    
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
    
    if (!conn || !to){
        return;
    } else {
 
        to.send(JSON.stringify({
            act:"recieve",
            ctx:"msg",
            status:"success",
            msg: msg.msg,
            from: msg.user,
            date: msg.msg_date
        }))
    }
}

async function registerHandler (req, ws){
    
    if(req.ctx == "sign"){
        
        user.sign(req, ws)
        
    } else if(req.ctx == "login") { 
        
        user.login(req, ws)
    }
}


module.exports = {
    handle: handle
}