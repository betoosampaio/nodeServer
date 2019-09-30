const mariadb = require('mariadb');

module.exports.query = async (query, params) => {

    let conn = await mariadb.createConnection({
        host: process.env.MARIADB_HOST,
        port: process.env.MARIADB_PORT,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE,
    });

    let data = await conn.query(query, params);
    return data;

};

module.exports.mquery = async (query, params) => {

    let conn = await mariadb.createConnection({
        host: process.env.MARIADB_HOST,
        port: process.env.MARIADB_PORT,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE,
        multipleStatements: true,
    });

    let data = await conn.query(query, params);
    return data;

};