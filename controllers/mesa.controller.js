const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const emitTo = require('../socket').emitTo;

module.exports.listar = async (req, res) => {
    try {
        let data = await mongodb.find('freeddb', 'mesa', {id_restaurante: req.token.id_restaurante});
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

        enviarDadosSockets(req.token.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.incluirProduto = async (req, res) => {
    try {

        let id_mesa = req.body.id_mesa;
        let produto = req.body.produto;

        let data = await mongodb.findOneAndUpdate('freeddb', 'mesa',
            { _id: new ObjectId(id_mesa) },
            { $push: { produtos: produto } }
        );

        enviarDadosSockets(data.value.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

enviarDadosSockets = async (id_restaurante) => {
    let data = await mongodb.find('freeddb', 'mesa', { id_restaurante: id_restaurante });
    emitTo("atualizacao", data, id_restaurante);
}