const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const model = require('../models/pagamento.model');
const restauranteCtrl = require('../controllers/restaurante.controller');
const operadorCtrl = require('../controllers/operador.controller');
const mesaCtrl = require('../controllers/mesa.controller');

module.exports.incluir = async (req, res) => {
  try {
    // recupera os dados da requisição
    let obj = {
      id_mesa: req.body.id_mesa,
      pagamentos: req.body.pagamentos,
      id_operador: req.body.id_operador || req.token.id_operador,
    }

    // validação dos dados da requisição
    let errors = model.validarIncluir(obj);
    if (errors)
      return res.status(400).send(errors[0]);
    if (!obj.pagamentos || obj.pagamentos.length == 0)
      return res.status(400).send("Não há pagamentos na lista");

    // valida operador
    let operador = await operadorCtrl._obter(req.token.id_restaurante, obj.id_operador);
    if (operador.length == 0)
      return res.status(400).send("Operador inválido");

    // obtem mesa
    let mesa = await mesaCtrl._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    // validações
    if (mesa.encerrada) return res.status(400).send("Essa mesa já foi encerrada");

    // prepara lista de pagamentos
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
        p.data_incluiu = new Date();
        p.id_operador = operador[0].id_operador;
        p.nome_operador = operador[0].nome_operador;
        pagamentos.push(p);
      }
    }

    // altera os dados
    if (!mesa.pagamentos) mesa.pagamentos = [];
    mesa.pagamentos = mesa.pagamentos.concat(pagamentos);

    // atualiza
    await mongodb.replaceOne('freeddb', 'mesa', {
      _id: new ObjectId(obj.id_mesa),
      id_restaurante: req.token.id_restaurante
    }, mesa);

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

    // obtem mesa
    let mesa = await mesaCtrl._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    // validações
    if (mesa.encerrada) return res.status(400).send("Essa mesa já foi encerrada");

    // obtem o pagamento
    let pagamento = mesa.pagamentos.find(p => p.id_pagamento == req.body.id_pagamento);

    // altera os dados
    pagamento.removido = true;
    pagamento.data_removeu = new Date();

    // atualiza
    await mongodb.replaceOne('freeddb', 'mesa', {
      _id: new ObjectId(obj.id_mesa),
      id_restaurante: req.token.id_restaurante
    }, mesa);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
