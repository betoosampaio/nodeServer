const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const emitTo = require('../socket').emitTo;
const model = require('../models/mesa.model');
const operadorCtrl = require('../controllers/operador.controller');

module.exports.listar = async (req, res) => {
  try {

    let data = await mongodb.find('freeddb', 'mesa', {
      id_restaurante: req.token.id_restaurante,
      encerrada: { $exists: false },
      removida: { $exists: false },
    });

    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obter = async (req, res) => {
  try {

    let obj = {
      id_mesa: req.body.id_mesa
    }

    let errors = model.validarIdMesa(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    let data = await this._obter(req.token.id_restaurante, req.body.id_mesa)
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.abrir = async (req, res) => {
  try {

    let obj = {
      id_restaurante: req.token.id_restaurante,
      id_operador: req.body.id_operador || req.token.id_operador,
      aberta: true,
      data_abriu: new Date(),
      numero: req.body.numero,
      produtos: [],
      qtd_produtos: 0,
      valor_produtos: 0,
      pagamentos: [],
      valor_pagamentos: 0,
      taxa_servico: 0.1,
      desconto: 0,
      id_status: 1,
      status: 'Aberta'
    }

    // validação da mesa
    let errors = model.validarCadastrar(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // valida o operador
    let operador = await operadorCtrl._obter(obj.id_restaurante, obj.id_operador);
    if (operador.length == 0)
      return res.status(400).send("Operador inválido");
    obj.nome_operador = operador[0].nome_operador;

    // verifica se a mesa com mesmo número está ativa
    let data = await mongodb.find('freeddb', 'mesa', {
      id_restaurante: req.token.id_restaurante,
      aberta: true,
      numero: req.body.numero
    });
    if (data.length > 0)
      return res.status(400).send('uma mesa com este número já está aberta');

    //obter taxa servico padrao
    let config = await mongodb.findOne('freeddb', 'configuracao', { id_restaurante: req.token.id_restaurante });
    if (config) obj.taxa_servico = config.taxa_servico;

    await mongodb.insertOne('freeddb', 'mesa', obj);

    //enviarDadosSockets(req.token.id_restaurante);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.remover = async (req, res) => {
  try {

    let obj = {
      id_mesa: req.body.id_mesa,
      id_operador: req.body.id_operador || req.token.id_operador,
    }

    let errors = model.validarIdMesa(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // valida o operador
    let operador = await operadorCtrl._obter(req.token.id_restaurante, obj.id_operador);
    if (operador.length == 0)
      return res.status(400).send("Operador inválido");
    obj.nome_operador = operador[0].nome_operador;

    // obtem mesa
    let mesa = await this._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    // altera os dados
    mesa.id_status = 4;
    mesa.status = 'Cancelada'
    mesa.aberta = false;
    mesa.fechada = true;
    mesa.encerrada = true;
    mesa.removida = true;
    mesa.data_removeu = new Date();
    mesa.id_operador_removeu = obj.id_operador;
    mesa.nome_operador_removeu = obj.nome_operador;

    // remove todos os produtos
    mesa.produtos.forEach(p => {
      p.removido = true;
      p.data_removeu = new Date();
    });
    mesa.qtd_produtos = mesa.produtos.reduce((sum, key) => sum + (key.removido ? 0 : key.quantidade), 0);
    mesa.valor_produtos = mesa.produtos.reduce((sum, key) => sum + (key.removido ? 0 : key.preco * key.quantidade), 0);

    // remove todos os pagamentos
    mesa.pagamentos.forEach(p => {
      p.removido = true;
      p.data_removeu = new Date();
    });
    mesa.valor_pagamentos = mesa.pagamentos.reduce((sum, key) => sum + (key.removido ? 0 : key.valor), 0);

    // atualiza
    await mongodb.replaceOne('freeddb', 'mesa', {
      _id: new ObjectId(obj.id_mesa),
      id_restaurante: req.token.id_restaurante
    }, mesa);

    //enviarDadosSockets(req.token.id_restaurante);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.fechar = async (req, res) => {
  try {

    let obj = {
      id_mesa: req.body.id_mesa,
    }

    let errors = model.validarIdMesa(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // obtem mesa
    let mesa = await this._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    // validações
    if (mesa.fechada) return res.status(400).send("Essa mesa já foi fechada");
    if (mesa.encerrada) return res.status(400).send("Essa mesa já foi encerrada");

    // altera os dados
    mesa.id_status = 2;
    mesa.status = 'Fechada';
    mesa.aberta = false;
    mesa.fechada = true;
    mesa.data_fechou = new Date();

    // atualiza
    await mongodb.replaceOne('freeddb', 'mesa', {
      _id: new ObjectId(obj.id_mesa),
      id_restaurante: req.token.id_restaurante
    }, mesa);

    //enviarDadosSockets(req.token.id_restaurante);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.reabrir = async (req, res) => {
  try {

    let obj = {
      id_mesa: req.body.id_mesa,
    }

    let errors = model.validarIdMesa(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // obtem mesa
    let mesa = await this._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    // validações
    if (mesa.aberta) return res.status(400).send("Essa mesa já está aberta");
    if (mesa.encerrada) return res.status(400).send("Essa mesa já foi encerrada");

    // altera os dados
    mesa.id_status = 1;
    mesa.status = 'Aberta'
    mesa.aberta = true;
    mesa.fechada = false;
    mesa.data_reabriu = new Date();

    // atualiza
    await mongodb.replaceOne('freeddb', 'mesa', {
      _id: new ObjectId(obj.id_mesa),
      id_restaurante: req.token.id_restaurante
    }, mesa);

    //enviarDadosSockets(req.token.id_restaurante);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.encerrar = async (req, res) => {
  try {

    let obj = {
      id_mesa: req.body.id_mesa,
      id_operador: req.body.id_operador || req.token.id_operador,
    }

    let errors = model.validarIdMesa(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // valida o operador
    let operador = await operadorCtrl._obter(req.token.id_restaurante, obj.id_operador);
    if (operador.length == 0)
      return res.status(400).send("Operador inválido");
    obj.nome_operador = operador[0].nome_operador;

    // obtem mesa
    let mesa = await this._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    //validações
    if (mesa.encerrada) return res.status(400).send("Essa mesa já foi encerrada");

    // validar se tudo foi pago
    let vlrTotal = (mesa.valor_produtos * (1 + mesa.taxa_servico)) - mesa.desconto;
    vlrTotal = vlrTotal.toFixed(2) / 1;
    if (mesa.valor_pagamentos < vlrTotal)
      return res.status(400).send("Todos os valores devem ser pagos antes de fechar a mesa");

    // altera os dados
    mesa.id_status = 3;
    mesa.status = 'Encerrada'
    mesa.aberta = false;
    mesa.fechada = true;
    mesa.encerrada = true;
    mesa.data_encerrou = new Date();
    mesa.id_operador_encerrou = obj.id_operador;
    mesa.nome_operador_encerrou = obj.nome_operador;

    // atualiza
    await mongodb.replaceOne('freeddb', 'mesa', {
      _id: new ObjectId(obj.id_mesa),
      id_restaurante: req.token.id_restaurante
    }, mesa);

    //enviarDadosSockets(req.token.id_restaurante);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.editarDesconto = async (req, res) => {
  try {

    let obj = {
      id_mesa: req.body.id_mesa,
      desconto: req.body.desconto,
    }

    let errors = model.validarDesconto(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // obtem mesa
    let mesa = await this._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    // validações
    if (mesa.fechada) return res.status(400).send("Essa mesa já foi fechada");
    if (mesa.encerrada) return res.status(400).send("Essa mesa já foi encerrada");
    if (obj.desconto > (mesa.valor_produtos * (1 + mesa.taxa_servico)))
      return res.status(400).send("Desconto superior ao valor de produtos");

    // altera os dados
    mesa.desconto = obj.desconto;

    // atualiza
    await mongodb.replaceOne('freeddb', 'mesa', {
      _id: new ObjectId(obj.id_mesa),
      id_restaurante: req.token.id_restaurante
    }, mesa);

    //enviarDadosSockets(req.token.id_restaurante);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.editarTaxaServico = async (req, res) => {
  try {

    let obj = {
      id_mesa: req.body.id_mesa,
      taxa_servico: req.body.taxa_servico,
    }

    let errors = model.validarTaxaServico(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // obtem mesa
    let mesa = await this._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    // validações
    if (mesa.fechada) return res.status(400).send("Essa mesa já foi fechada");
    if (mesa.encerrada) return res.status(400).send("Essa mesa já foi encerrada");

    // altera os dados
    mesa.taxa_servico = obj.taxa_servico;

    // atualiza
    await mongodb.replaceOne('freeddb', 'mesa', {
      _id: new ObjectId(obj.id_mesa),
      id_restaurante: req.token.id_restaurante
    }, mesa);

    //enviarDadosSockets(req.token.id_restaurante);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports._obter = async (id_restaurante, id_mesa) => {
  return await mongodb.find('freeddb', 'mesa', {
    id_restaurante: id_restaurante,
    _id: ObjectId(id_mesa)
  });
}

module.exports.consultar = async (req, res) => {
  try {

    let obj = {
      dtini: new Date(req.body.dtini),
      dtfim: new Date(req.body.dtfim),
    }

    let data = await mongodb.find('freeddb', 'mesa', {
      id_restaurante: req.token.id_restaurante,
      data_abriu: { $gte: obj.dtini, $lte: obj.dtfim }
    });

    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

enviarDadosSockets = async (id_restaurante) => {
  let data = await mongodb.find('freeddb', 'mesa', {
    id_restaurante: req.token.id_restaurante,
    aberta: true
  });
  emitTo("atualizacao", data, id_restaurante);
}