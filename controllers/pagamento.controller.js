const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const model = require('../models/pagamento.model');
const restauranteCtrl = require('../controllers/restaurante.controller');

module.exports.incluir = async (req, res) => {
    try {
        // recupera os dados da requisição
        let obj = {
            id_mesa: req.body.id_mesa,
            pagamentos: req.body.pagamentos,
        }

        // validação dos dados da requisição
        let errors = model.validarIncluir(obj);
        if (errors)
            return res.status(400).send(errors[0]);
        if (!obj.pagamentos || obj.pagamentos.length == 0)
            return res.status(400).send("Não há produtos na lista");


        let pagamentos = [];
        for (p of obj.pagamentos) {
            // validando o pagamento
            let errors = model.validarPagamento(p);
            if (errors)
                return res.status(400).send(errors[0]);
            // valida a forma de pagamento
            let formaPgto = await restauranteCtrl._obterFormaPagamento(p.id_forma_pagamento);
            if (!formaPgto || formaPgto.length == 0)
                return res.status(400).send("forma de pagamento inválida");
            else {
                p.ds_forma_pagamento = formaPgto[0].ds_forma_pagamento;
                p.id_pagamento = new ObjectId();
                p.data_inclusao = new Date();
                pagamentos.push(p);
            }
        }

        // incluindo os pagamentos na mesa
        await mongodb.updateOne('freeddb', 'mesa',
            { _id: new ObjectId(obj.id_mesa), id_restaurante: req.token.id_restaurante },
            { $push: { pagamentos: { $each: pagamentos } } }
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
