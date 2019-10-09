const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const emitTo = require('../socket').emitTo;
const model = require('../models/mesa.model');
const produtoCtrl = require('../controllers/produto.controller');

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

        let obj = {
            id_restaurante: req.token.id_restaurante,
            id_operador_abertura: req.token.id_operador,
            data_abertura: new Date(),
            numero: req.body.numero,
        }

        let errors = model.validarCadastrar(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        await mongodb.insertOne('freeddb', 'mesa', obj);

        enviarDadosSockets(req.token.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.incluirProduto = async (req, res) => {
    try {
        // recupera os dados da requisição
        let obj = {
            id_mesa: req.body.id_mesa,
            id_produto: req.body.id_produto,
            quantidade: req.body.quantidade,
        }

        // validação dos dados da requisição
        let errors = model.validarIncluirProduto(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        // obtendo o id do restaurante dessa mesa
        let data = await mongodb.findOne('freeddb', 'mesa',
            { _id: new ObjectId(obj.id_mesa) }
        );
        let id_restaurante = data.id_restaurante;

        // obtendo os dados do produto
        let produto = await produtoCtrl._obter(id_restaurante,obj.id_produto);
        produto.quantidade = obj.quantidade;

        console.log(produto);

        // incluindo o produto na mesa
        await mongodb.updateOne('freeddb', 'mesa',
            { _id: new ObjectId(obj.id_mesa) },
            { $push: { produtos: produto } }
        );

        // enviando dados aos sockets
        enviarDadosSockets(id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

enviarDadosSockets = async (id_restaurante) => {
    let data = await mongodb.find('freeddb', 'mesa', { id_restaurante: id_restaurante });
    emitTo("atualizacao", data, id_restaurante);
}