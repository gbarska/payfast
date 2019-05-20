var mysql = require('mysql');

function createDBConnection(){

    return mysql.createConnection({
        host: 'localhost',
        user:'gbarska',
        password: 'password',
        database:'payfast'
    })

}

module.exports = function(){
    return createDBConnection;
}