const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const socketEmit = require('../socket').socketsEmit;

module.exports.listar = async (req, res) => {
    try {
        let data = await mongodb.find('freeddb', 'mesa', {});
        return res.json(data);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.cadastrar = async (req, res) => {
    try {

        let mesa = {
            id_restaurante: req.token.id_restaurante,
            id_operador_abertura: req.token.id_operador,
            data_abertura: new Date(),
            numero: req.body.numero,
            produtos: [],
        }

        await mongodb.insertOne('freeddb', 'mesa', mesa);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.incluirProduto = async (req, res) => {
    try {

        let id_mesa = req.body.id_mesa;
        let produto = req.body.produto;

        await mongodb.updateOne('freeddb', 'mesa', { _id: new ObjectId(id_mesa) }, { $push: { produtos: produto } });

        enviarDados();

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

enviarDados = async () => {
    let data = await mongodb.find('freeddb', 'mesa', {});
    socketEmit("testando", data);
}