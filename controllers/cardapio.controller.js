const database = require('../config/database.config')

module.exports.selectAll = (req, res) => {
    try {
        let data = database.query("select * from tb_cardapio");
        res.json(data);
    } catch (error) {
        throw error;
    }
}



module.exports.insert = (req, res) => {
    try {

        let obj = req.body;
              console.log(obj);


              


        let query = `insert into tb_cardapio(
            nome_Produto,
            descricao,
            preco,
            menu,
            visivel,
            promocao,
            imagem)
            values (?,?,?,?,?,?,?)`;


        database.query(query, [
            obj.nome_Produto,
            obj.descricao,
            obj.preco,
            obj.menu,
            obj.visivel,
            obj.promocao,
            obj.imagem
        ]);
    
        res.json('OK');
    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports.update = (req, res) => {
    try {
        let query = "insert into tb_operador() values (?)";
        database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.delete = (req, res) => {
    try {
        let query = "update tb_operador set ativo = 0, data_exclusao = now() where id_restaurante = ?";
        database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}
