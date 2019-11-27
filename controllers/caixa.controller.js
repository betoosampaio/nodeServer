
const model = require('../models/caixa.model');
const operadorCtrl = require('../controllers/operador.controller');
const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;

module.exports._obter = async (id_restaurante, id_caixa) => {
  return await mongodb.find('freeddb', 'caixa', {
    id_restaurante: id_restaurante,
    _id: ObjectId(id_caixa)
  });
}

module.exports.listar = async (req, res) => {
  try {
    let data = await mongodb.find('freeddb', 'caixa', {
      id_restaurante: req.token.id_restaurante,
      aberto: true,
    });

    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obter = async (req, res) => {
  try {

    let obj = {
      id_caixa: req.body.id_caixa
    }

    let errors = model.validarIdCaixa(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    let data = await this._obter(req.token.id_restaurante, req.body.id_caixa);

    // obtem os pagamentos
    let mesas = await mongodb.aggregate('freeddb', 'mesa', [
      { $match: { id_restaurante: req.token.id_restaurante } },
      {
        $project: {
          pagamentos: {
            $filter: {
              input: '$pagamentos',
              cond: {
                $and: [
                  { $eq: ['$$this.id_caixa', ObjectId(req.body.id_caixa)] },
                  { $ne: ['$$this.removido', true] }
                ]
              }
            }
          }
        }
      },
      { $unwind: "$pagamentos" },
      {
        $group: {
          _id: null,
          pagamentos: { $push: "$pagamentos" }
        },
      }
    ]);
    data[0].pagamentos = mesas[0] ? mesas[0].pagamentos : [];

    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.consultar = async (req, res) => {
  try {

    let obj = {
      dtini: new Date(req.body.dtini),
      dtfim: new Date(req.body.dtfim),
    }

    let data = await mongodb.find('freeddb', 'caixa', {
      id_restaurante: req.token.id_restaurante,
      data_abriu: { $gte: obj.dtini, $lte: obj.dtfim }
    });

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
      aberto: true,
      data_abriu: new Date(),
      numero: req.body.numero,
      saldo_inicial: req.body.saldo_inicial,
      sangrias: [],
      qtd_sangrias: 0,
      valor_sangrias: 0,
      suprimentos: [],
      qtd_suprimentos: 0,
      valor_suprimentos: 0,
      id_status: 1,
      status: 'Aberto'
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

    // verifica se o caixa com mesmo número está ativo
    let data = await mongodb.find('freeddb', 'caixa', {
      id_restaurante: req.token.id_restaurante,
      aberto: true,
      numero: req.body.numero
    });
    if (data.length > 0)
      return res.status(400).send('um caixa com este número já está aberto');

    await mongodb.insertOne('freeddb', 'caixa', obj);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.fechar = async (req, res) => {
  try {

    let obj = {
      id_caixa: req.body.id_caixa,
    }

    let errors = model.validarIdCaixa(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // obtem caixa
    let caixa = await this._obter(req.token.id_restaurante, req.body.id_caixa);
    if (caixa.length == 0) return res.status(400).send("Caixa inexistente");
    caixa = caixa[0];

    // validações
    if (caixa.fechado) return res.status(400).send("Esse caixa já foi fechado");

    // altera os dados
    caixa.id_status = 2;
    caixa.status = 'Fechado';
    caixa.aberto = false;
    caixa.fechado = true;
    caixa.data_fechou = new Date();

    // atualiza
    await mongodb.replaceOne('freeddb', 'caixa', {
      _id: new ObjectId(obj.id_caixa),
      id_restaurante: req.token.id_restaurante
    }, caixa);

    //enviarDadosSockets(req.token.id_restaurante);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.reabrir = async (req, res) => {
  try {

    let obj = {
      id_caixa: req.body.id_caixa,
    }

    let errors = model.validarIdCaixa(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // obtem caixa
    let caixa = await this._obter(req.token.id_restaurante, req.body.id_caixa);
    if (caixa.length == 0) return res.status(400).send("Caixa inexistente");
    caixa = caixa[0];

    // validações
    if (caixa.aberto) return res.status(400).send("Esse caixa já está aberto");

    // altera os dados
    caixa.id_status = 1;
    caixa.status = 'Aberto'
    caixa.aberto = true;
    caixa.fechado = false;
    caixa.data_reabriu = new Date();

    // atualiza
    await mongodb.replaceOne('freeddb', 'caixa', {
      _id: new ObjectId(obj.id_caixa),
      id_restaurante: req.token.id_restaurante
    }, caixa);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}