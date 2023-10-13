var mysql = require('./db.js');
mysql = mysql.getSql();

 
 async function getMessageArray(from, to){
     
     var result = await mysql.query(`
        SELECT * FROM 
            (SELECT * FROM mensagens WHERE 
                (sender=${from} AND reciever=${to} OR sender=${to} AND reciever=${from})
            ORDER BY msg_id DESC LIMIT 50)Var1 
        ORDER BY date ASC`);
     
         mysql.query(`UPDATE mensagens SET seen='1' WHERE sender=${from} AND reciever=${to}`);
     
     return result[0]
     
 }
 
module.exports = {getMessageArray: getMessageArray}