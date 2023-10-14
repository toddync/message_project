var mysql = require('./db.js');
mysql = mysql.getSql();

 
 async function getMessageArray(from, to, limit){
     
     var result = await mysql.query(`
        SELECT * FROM 
            (SELECT * FROM mensagens WHERE 
                (sender=${from} AND reciever=${to} OR sender=${to} AND reciever=${from})
            ORDER BY msg_id DESC LIMIT ${limit})Var1 
        ORDER BY date ASC`);
     
         mysql.query(`UPDATE mensagens SET seen='1' WHERE sender=${to} AND reciever=${from}`);
     
     return result[0]
     
 }
 
async function getUnseen(to, from){
     
    var r = await mysql.query(`
        SELECT * FROM mensagens WHERE 
            sender=${from} 
                AND
            reciever=${to}
                AND
            seen=0
    `);
    
    return r[0].length
}

async function sendMessage(msg, from, to){
    
    let r = await mysql.query(`
        INSERT INTO mensagens(sender, message, reciever, seen, date)
        VALUES ('${msg.user}', '${msg.msg}', '${msg.to}',0,'${msg.date}');`
    );
    
    console.log(to, from)
    
    r = await mysql.query(`
        SELECT msg_id FROM 
        ( 
            SELECT * FROM mensagens 
            WHERE 
                sender = '${msg.user}' 
                    AND 
                message = '${msg.msg}'
                 AND 
                reciever = '${msg.to}' 
                  AND 
                date = '${msg.date}'
            ORDER BY msg_id
            ASC
        )Var1
    `);

        return r[0].length > 0 ? r[0][0].msg_id : undefined
        
}
 
module.exports = {
    getMessageArray: getMessageArray,
    sendMessage:     sendMessage,
    getUnseen:       getUnseen
}