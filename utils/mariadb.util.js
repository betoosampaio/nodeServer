const mariadb = require('mariadb');

module.exports.query = async (query, params) => {

    let conn = await mariadb.createConnection({
        host: process.env.MARIADB_HOST,
        port: process.env.MARIADB_PORT,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE,
    });

    try {
        let data = await conn.query(query, params);
        return data;
    }
    catch (err) {
        throw err;
    }
    finally {
        conn.end();
    }

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

    try {
        let data = await conn.query(query, params);
        return data;
    }
    catch (err) {
        throw err;
    }
    finally {
        conn.end();
    }

};