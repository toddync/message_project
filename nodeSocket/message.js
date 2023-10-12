var mysql = require('./db.js');
mysql = mysql.getSql();

 //$query = "SELECT * FROM (SELECT * FROM mensagens WHERE message LIKE '%".$search."%' AND sender = '".$chat."' AND reciever = '".$user."' OR message LIKE '%".$search."%' AND sender = '".$user."' AND reciever = '".$chat."' ORDER BY msg_id DESC LIMIT 50)Var1 ORDER BY msg_id ASC ";
 
 async function getMessageArray(from, to){
     
     var result = await mysql.query(`SELECT * FROM (SELECT * FROM mensagens WHERE sender=${from} AND reciever=${to} ORDER BY msg_id DESC LIMIT 50)Var1 ORDER BY msg_id ASC`);
     
         mysql.query(`UPDATE mensagens SET seen='1' WHERE sender=${from} AND reciever=${to}`);
     
     return result[0];
     
 }
 
 module.exports = {getMessageArray: getMessageArray}