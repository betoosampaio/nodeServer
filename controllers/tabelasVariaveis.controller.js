const database = require('../config/database.config')

module.exports.banco_selectAll = async (req, res) => {
    try {
        let data = await database.query("select * from tb_banco");
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports.municipio_selectAll = async (req, res) => {
    try {
        let data = await database.query("select * from tb_municipio");
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports.estado_selectAll = async (req, res) => {
    try {
        let data = await database.query("select * from tb_estado");
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports.tipoConta_selectAll = async (req, res) => {
    try {
        let data = await database.query("select * from tb_tipo_conta");
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports.tipoCadastroConta_selectAll = async (req, res) => {
    try {
        let data = await database.query("select * from tb_tipo_cadastro_conta");
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

