var mysql = require('./db.js');
mysql = mysql.getSql();

const message = require("./message.js");

async function getUserArray(id) {
  
   var r = await mysql.query(`
        SELECT Name, Status, grp, Image, id
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
        
        if(r[0][i]){
            
            var resp = await message.getMessageArray(id, r[0][i].id, 1)
            r[0][i].lastMsg = resp[0];
            r[0][i].unseen = await message.getUnseen(id, r[0][i].id)
        } else {
            
            r[0][i].lastMsg = "";
            r[0][i].unseen = 0
        }
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

async function addRelation(req, ws){
    
    let c = await mysql.query(`SELECT * FROM chat WHERE id = '${req.id2}'`);

    let c2 = await mysql.query(`
        SELECT * FROM users_relation 
            WHERE 
                usr1= '${req.id}' AND usr2= '${req.id2}'
        `);

    if (c[0].length > 0 && c2[0].length == 0){
        
        await mysql.query(`
            INSERT INTO 
                users_relation (usr1, usr2)
            VALUES 
                ('${req.id}', '${req.id2}'),
                ('${req.id2}', '${req.id}')`
        );
        
        let r = await mysql.query(`
            SELECT 
                Name, Status, grp, Image, id
            FROM chat
            WHERE
                id=${req.id}`)
        
        ws.send(JSON.stringify({
            act:"relation",
            ctx:"add",
            status:"success",
            user: r[0]
        }))
        
    } else {
        
        ws.send(JSON.stringify({
            act: "relation",
            ctx: "add",
            status:"fail"
        }))
    }
}

module.exports = {
    getUserArray: getUserArray,
    sign: sign,
    login: login,
    addRelation: addRelation
};
