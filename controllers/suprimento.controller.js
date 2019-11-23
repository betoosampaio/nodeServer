const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const model = require('../models/suprimento.model');
const operadorCtrl = require('../controllers/operador.controller');
const caixaCtrl = require('../controllers/caixa.controller');

module.exports.incluir = async (req, res) => {
  try {
    // recupera os dados da requisição
    let obj = {
      id_caixa: req.body.id_caixa,
      id_operador: req.body.id_operador || req.token.id_operador,
      valor: req.body.valor,
    }

    // validação dos dados da requisição
    let errors = model.validarIncluir(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // valida operador
    let operador = await operadorCtrl._obter(req.token.id_restaurante, obj.id_operador);
    if (operador.length == 0)
      return res.status(400).send("Operador inválido");

    // obtem caixa
    let caixa = await caixaCtrl._obter(req.token.id_restaurante, req.body.id_caixa);
    if (caixa.length == 0) return res.status(400).send("Caixa inexistente");
    caixa = caixa[0];

    // validações
    if (caixa.fechado) return res.status(400).send("Esse caixa já foi fechado");

    let suprimento = {
      id_suprimento: new ObjectId(),
      valor: obj.valor.toFixed(2) / 1,
      data_incluiu: new Date(),
      id_operador: operador[0].id_operador,
      nome_operador: operador[0].nome_operador,
    }

    // altera os dados
    caixa.suprimentos.push(suprimento);
    caixa.valor_suprimentos = caixa.suprimentos.reduce((sum, key) => sum + (key.removido ? 0 : key.valor), 0);

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

module.exports.remover = async (req, res) => {
  try {

    let obj = {
      id_caixa: req.body.id_caixa,
      id_suprimento: req.body.id_suprimento,
    }

    let errors = model.validarRemover(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // obtem caixa
    let caixa = await caixaCtrl._obter(req.token.id_restaurante, req.body.id_caixa);
    if (caixa.length == 0) return res.status(400).send("Caixa inexistente");
    caixa = caixa[0];

    // validações
    if (caixa.fechado) return res.status(400).send("Esse caixa já foi fechado");

    // obtem o suprimento
    let suprimento = caixa.suprimentos.find(p => p.id_suprimento == req.body.id_suprimento);

    // altera os dados
    suprimento.removido = true;
    suprimento.data_removeu = new Date();
    caixa.valor_suprimentos = caixa.suprimentos.reduce((sum, key) => sum + (key.removido ? 0 : key.valor), 0);

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
