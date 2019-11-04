
const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const model = require('../models/mesaitem.model');
const produtoCtrl = require('../controllers/produto.controller');

module.exports.incluir = async (req, res) => {
    try {
        // recupera os dados da requisição
        let obj = {
            id_mesa: req.body.id_mesa,
            id_produto: req.body.id_produto,
            quantidade: req.body.quantidade,
        }

        // validação dos dados da requisição
        let errors = model.validarIncluir(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        // obtendo os dados do produto
        let produto = await produtoCtrl._obter(req.token.id_restaurante, obj.id_produto);
        if (!produto || produto.length == 0)
            res.status(400).send("produto inválido");
        else {
            produto = produto[0];
            // inclui a quantidade e atribui um id
            produto.quantidade = obj.quantidade;
            produto.id_item = new ObjectId();
            produto.data_inclusao = new Date();
            // incluindo o produto na mesa
            await mongodb.updateOne('freeddb', 'mesa',
                { _id: new ObjectId(obj.id_mesa), id_restaurante: req.token.id_restaurante },
                { $push: { produtos: produto } }
            );

            return res.json('OK');
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.remover = async (req, res) => {
    try {

        let obj = {
            id_mesa: req.body.id_mesa,
            id_item: req.body.id_item,
        }

        let errors = model.validarRemover(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        await mongodb.updateOne('freeddb', 'mesa',
            {
                _id: new ObjectId(obj.id_mesa),
                id_restaurante: req.token.id_restaurante
            },
            {
                $set: {
                    'produtos.$[item].removido': true,
                    'produtos.$[item].data_removido': new Date(),
                }
            },
            {
                arrayFilters: [{ 'item.id_item': new ObjectId(obj.id_item) }]
            }
        );

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}