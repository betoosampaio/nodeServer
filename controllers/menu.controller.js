const database = require('../config/database.config')

module.exports.selectAll = async (req,res) => {
    try {
        let data = await database.query("select * from TB_MENU");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

module.exports.insert = async (req,res) => {
    try {
        let query = "insert into TB_MENU() values (?)";
        await database.query(query, []);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.update = async (req,res) => {
    try {
        let query = "insert into TB_MENU() values (?)";
        await database.query(query, [req.body.id_menu]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.delete = async (req,res) => {
    try {
        let query = "update TB_MENU set ativo = 0, data_exclusao = now() where id_menu = ?";
        await database.query(query, [req.body.id_menu]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}