const mariadb = require('mariadb');

module.exports.query = async (query, params) => {

    let conn = await mariadb.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'db_creed',
    });

    let data = await conn.query(query, params);
    return data;

};