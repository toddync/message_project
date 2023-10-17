const message = require("./message.js");
const user = require("./user.js");

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
            
            response = await user.getUserArray(ws.userId, req);
            
            ws.send({
                act:"response",
                ctx:""
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
            msg: req.msg,
            from: req.user,
            date: req.msg_date
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
    messageHandler: messageHandler,
    requestHandler: requestHandler,
    registerHandler: registerHandler
}