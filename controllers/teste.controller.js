const database = require('../config/database.config')

module.exports.getAll = async (req,res) => {
    try {
        let data = await database.query("select * from TB_TESTE");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

module.exports.insere = async (req,res) => {
    try {
        let query = "insert into TB_TESTE(numero, nome) values ('" + obj.numero + "', '" + obj.nome + "')";
        await database.query(query);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}