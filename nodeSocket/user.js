var mysql = require('./db.js');
mysql = mysql.getSql();

const message = require("./message.js");

async function getUserArray(id) {
  
   var r = await mysql.query(`
        SELECT Name, Status, grp, Image
        FROM chat
        INNER JOIN users_relation ON chat.id = users_relation.usr2
        WHERE users_relation.usr1 = ${id};`);
    
   r = await finalize(id, r);
    
   return r[0];
   /*
   console.log("\n\n")
   
   var r = await mysql.query(`
        SELECT DISTINCT chat.*
        FROM chat
        INNER JOIN users_relation ON chat.id = users_relation.usr2
        INNER JOIN mensagens ON chat.id = mensagens.sender OR chat.id = mensagens.reciever
        WHERE users_relation.usr1 = ${id}
        ORDER BY mensagens.date;`);
    
    console.log(JSON.stringify(r[0], null, 2));
    */
}

async function finalize(id, r){
    
    for(let i = 0; i < r[0].length; i++){
     
       var resp = await message.getMessageArray(id, r[0][i].id, 1)
       r[0][i].lastMsg = resp[0];
       r[0][i].unseen = await message.getUnseen(id, r[0][i].id)
    }
    
    return r;
}

async function sign(req, ws){
    
   let r = await mysql.query(`SELECT * FROM chat WHERE Email='${req.email}'`)

    if (r[0].length > 0) {
        
        ws.send(JSON.stringify({
           act:"register",
           ctx:"sign",
           status:"success",
           ctxStatus:"fail"
       }));
    } else {
        
        await mysql.query(`
            INSERT INTO chat 
                (Name, Email, Password, Private_key, Public_key, Status, grp) 
            VALUES 
                ('${req.username}', '${req.email}', '${req.password}', '1', '1', 'offline', 'no')`);
        
       ws.send(JSON.stringify({
           act:"register",
           ctx:"sign",
           status:"success",
           ctxStatus:"success"
       }));
    }
    
    return;
}

async function login(req, ws){
    
    let r = await mysql.query(`SELECT * FROM chat WHERE Email = '${req.email}'`)

    if (r[0].length == 0 || r[0][0].Password != req.password){
     
        ws.send(JSON.stringify({
            act:"register",
            ctx:"login",
            status:"success",
            ctxStatus:"fail",
        }))
    } else {
      
        ws.send(JSON.stringify({
            act:"register",
            ctx:"login",
            status:"success",
            ctxStatus:"success",
            id: r[0][0].id,
            img: r[0][0].Image,
            username: r[0][0].Name
        }))
    }
}

module.exports = {
    getUserArray: getUserArray,
    sign: sign,
    login: login
};
