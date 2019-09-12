const database = require('../config/database.config')

module.exports.banco_selectAll = (req, res) => {
    try {
        let data = database.query("select * from tb_banco");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

module.exports.municipio_selectAll = (req, res) => {
    try {
        let data = database.query("select * from tb_municipio");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

module.exports.estado_selectAll = (req, res) => {
    try {
        let data = database.query("select * from tb_estado");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

module.exports.tipoConta_selectAll = (req, res) => {
    try {
        let data = database.query("select * from tb_tipo_conta");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

module.exports.tipoCadastroConta_selectAll = (req, res) => {
    try {
        let data = database.query("select * from tb_tipo_cadastro_conta");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

