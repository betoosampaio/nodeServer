const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const emitTo = require('../socket').emitTo;
const model = require('../models/mesa.model');
const operadorCtrl = require('../controllers/operador.controller');

module.exports.listar = async (req, res) => {
  try {

    let data = await mongodb.find('freeddb', 'mesa', {
      id_restaurante: req.token.id_restaurante,
      aberta: true
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

module.exports.cadastrar = async (req, res) => {
  try {

    let obj = {
      id_restaurante: req.token.id_restaurante,
      id_operador: req.body.id_operador || req.token.id_operador,
      aberta: true,
      data_abertura: new Date(),
      numero: req.body.numero,
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
    }

    let errors = model.validarIdMesa(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    await mongodb.updateOne('freeddb', 'mesa',
      {
        _id: new ObjectId(obj.id_mesa),
        id_restaurante: req.token.id_restaurante
      },
      {
        $set: {
          aberta: false,
          removida: true,
          data_removida: new Date(),
        }
      }
    );

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

    // validar se tudo foi pago
    let data = await this._obter(req.token.id_restaurante, req.body.id_mesa)
    let mesa = data[0];
    let
      produtos = mesa.produtos || [],
      pagamentos = mesa.pagamentos || [];
    let
      txservico = parseFloat(mesa.taxa_servico) || 0,
      desconto = parseFloat(mesa.desconto) || 0,
      vlProdutos = produtos.reduce((sum, key) => sum + (key.removido ? 0 : key.preco * key.quantidade), 0),
      vlPagamentos = pagamentos.reduce((sum, key) => sum + (key.removido ? 0 : key.valor), 0);
    let vlrTotal = (vlProdutos + txservico - desconto);
    if (vlPagamentos < vlrTotal)
      return res.status(400).send("Todos os valores devem ser pagos antes de fechar a mesa");

    // fechar a mesa
    await mongodb.updateOne('freeddb', 'mesa',
      {
        _id: new ObjectId(obj.id_mesa),
        id_restaurante: req.token.id_restaurante
      },
      {
        $set: {
          aberta: false,
          fechada: true,
          data_fechamento: new Date(),
          id_operador_fechou: obj.id_operador,
          nome_operador_fechou: obj.nome_operador,
        }
      }
    );

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

    await mongodb.updateOne('freeddb', 'mesa',
      {
        _id: new ObjectId(obj.id_mesa),
        id_restaurante: req.token.id_restaurante
      },
      {
        $set: {
          aberta: true,
          fechada: false,
          data_reabertura: new Date(),
        }
      }
    );

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

    await mongodb.updateOne('freeddb', 'mesa',
      {
        _id: new ObjectId(obj.id_mesa),
        id_restaurante: req.token.id_restaurante
      },
      {
        $set: {
          desconto: obj.desconto,
        }
      }
    );

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

    await mongodb.updateOne('freeddb', 'mesa',
      {
        _id: new ObjectId(obj.id_mesa),
        id_restaurante: req.token.id_restaurante
      },
      {
        $set: {
          taxa_servico: obj.taxa_servico,
        }
      }
    );

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

enviarDadosSockets = async (id_restaurante) => {
  let data = await mongodb.find('freeddb', 'mesa', {
    id_restaurante: req.token.id_restaurante,
    aberta: true
  });
  emitTo("atualizacao", data, id_restaurante);
}