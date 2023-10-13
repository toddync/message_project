var mysql = require('./db.js');
mysql = mysql.getSql();

async function getUserArray(id) {

   var r = await mysql.query(`
        SELECT chat.*
        FROM chat
        INNER JOIN users_relation ON chat.id = users_relation.usr2
        WHERE users_relation.usr1 = ${id};`);
    
   return r[0];
   
   console.log("\n\n")
   
   var r = await mysql.query(`
        SELECT DISTINCT chat.*
        FROM chat
        INNER JOIN users_relation ON chat.id = users_relation.usr2
        INNER JOIN mensagens ON chat.id = mensagens.sender OR chat.id = mensagens.reciever
        WHERE users_relation.usr1 = ${id}
        ORDER BY mensagens.date;`);
    
    console.log(JSON.stringify(r[0], null, 2));

}

module.exports = {
    getUserArray: getUserArray
};