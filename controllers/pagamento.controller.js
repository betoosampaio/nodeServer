const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const model = require('../models/pagamento.model');
const restauranteCtrl = require('../controllers/restaurante.controller');

module.exports.incluir = async (req, res) => {
    try {
        // recupera os dados da requisição
        let obj = {
            id_mesa: req.body.id_mesa,
            id_forma_pagamento: req.body.id_forma_pagamento,
            valor: req.body.valor,
        }

        // validação dos dados da requisição
        let errors = model.validarIncluir(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        // prepara o objeto que vai inserir no bd
        let pagamento = {
            id_pagamento: new ObjectId(),
            data_inclusao: new Date(),
            id_forma_pagamento: obj.id_forma_pagamento,
            valor: obj.valor,
        }

        // valida a forma de pagamento
        let formaPgto = await restauranteCtrl._obterFormaPagamento(obj.id_forma_pagamento);
        if (!formaPgto || formaPgto.length == 0)
            res.status(400).send("forma de pagamento inválida");
        else {
            pagamento.ds_forma_pagamento = formaPgto[0].ds_forma_pagamento;
        }

        await mongodb.updateOne('freeddb', 'mesa',
            { _id: new ObjectId(obj.id_mesa), id_restaurante: req.token.id_restaurante },
            { $push: { pagamentos: pagamento } }
        );

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.remover = async (req, res) => {
    try {

        let obj = {
            id_mesa: req.body.id_mesa,
            id_pagamento: req.body.id_pagamento,
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
                    'pagamentos.$[pagamento].removido': true,
                    'pagamentos.$[pagamento].data_removido': new Date(),
                }
            },
            {
                arrayFilters: [{ 'pagamento.id_pagamento': new ObjectId(obj.id_pagamento) }]
            }
        );

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
