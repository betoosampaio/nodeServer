const mariadb = require('mariadb');

module.exports.query = (query, params) => {
    mariadb.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'db_creed',
    }).then(conn => {
        return conn.query(query, params);
    }).catch(error =>{
        throw error;
    }).catch(error => {
        throw error;
    });
};