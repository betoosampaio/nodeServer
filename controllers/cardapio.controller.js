const database = require('../config/database.config')

module.exports.selectAll = (req,res) => {
    try {
        let data = database.query("select * from TB_CARDAPIO");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

module.exports.insert =  (req,res) => {
    try {
        let query = "insert into TB_CARDAPIO() values (?)";
         database.query(query, []);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.update =  (req,res) => {
    try {
        let query = "insert into TB_CARDAPIO() values (?)";
         database.query(query, [req.body.id_cardapio]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.delete =  (req,res) => {
    try {
        let query = "update TB_CARDAPIO set ativo = 0, data_exclusao = now() where id_cardapio = ?";
         database.query(query, [req.body.id_cardapio]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}