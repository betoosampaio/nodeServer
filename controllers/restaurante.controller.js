const database = require('../config/database.config')

module.exports.selectAll = async (req, res) => {
    try {
        let data = await database.query("select * from TB_RESTAURANTE");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

module.exports.insert = (req, res) => {
    try {
        let obj = req.body;
        let query = "insert into tb_teste(nome, sobrenome) values (?, ?)";
        database.query(query, [obj.nome, obj.sobrenome]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.update = async (req, res) => {
    try {
        let query = "insert into TB_RESTAURANTE() values (?)";
        await database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.delete = async (req, res) => {
    try {
        let query = "update TB_RESTAURANTE set ativo = 0, data_exclusao = now() where id_restaurante = ?";
        await database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}