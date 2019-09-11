const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'db_creed',
});

module.exports.query = async (query) => {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query(query);
    } catch (error) {
        throw error;
    } finally {
        if (conn) conn.end();
    }
}