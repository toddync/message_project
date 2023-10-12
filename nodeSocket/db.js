const MySQL = require("mysql2");

const mysql = MySQL.createPool({
    host: 'sql10.freemysqlhosting.net',
    database: 'sql10652779',
    user: 'sql10652779',
    password: 'G8rUFFqTES'
}).promise();

 function getSql(){
    return mysql;
}

module.exports = {getSql: getSql}