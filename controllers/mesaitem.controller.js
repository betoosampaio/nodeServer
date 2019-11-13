
const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const model = require('../models/mesaitem.model');
const produtoCtrl = require('../controllers/produto.controller');
const operadorCtrl = require('../controllers/operador.controller');
const mesaCtrl = require('../controllers/mesa.controller');

module.exports.incluir = async (req, res) => {
  try {
    // recupera os dados da requisição
    let obj = {
      id_mesa: req.body.id_mesa,
      produtos: req.body.produtos,
      id_operador: req.body.id_operador || req.token.id_operador,
    }

    // validação dos dados da requisição
    let errors = model.validarIncluir(obj);
    if (errors)
      return res.status(400).send(errors[0]);
    if (!obj.produtos || obj.produtos.length == 0)
      return res.status(400).send("Não há produtos na lista");

    // validar operador
    let operador = await operadorCtrl._obter(req.token.id_restaurante, obj.id_operador);
    if (operador.length == 0)
      return res.status(400).send("Operador inválido");

    // obtem mesa
    let mesa = await mesaCtrl._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    // validações
    if (mesa.fechada) return res.status(400).send("Essa mesa já foi fechada");
    if (mesa.encerrada) return res.status(400).send("Essa mesa já foi encerrada");

    // obtendo os dados dos produtos
    let produtos = [];
    for (p of obj.produtos) {
      // validando o item
      let errors = model.validarItem(p);
      if (errors)
        return res.status(400).send(errors[0]);
      // obtendo os dados do produto
      let produto = await produtoCtrl._obter(req.token.id_restaurante, p.id_produto);
      if (!produto || produto.length == 0)
        return res.status(400).send("produto(s) inválido(s)");
      else {
        produto = produto[0];
        // inclui a quantidade e atribui um id e dados da inserção
        produto.quantidade = p.quantidade;
        produto.id_item = new ObjectId();
        produto.data_incluiu = new Date();
        produto.id_operador = operador[0].id_operador;
        produto.nome_operador = operador[0].nome_operador;
        produtos.push(produto);
      }
    }

    // altera os dados
    mesa.produtos = mesa.produtos.concat(produtos);
    mesa.valor_produtos = mesa.produtos.reduce((sum, key) => sum + (key.removido ? 0 : key.preco * key.quantidade), 0);

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
      id_item: req.body.id_item,
    }

    let errors = model.validarRemover(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    // obtem mesa
    let mesa = await mesaCtrl._obter(req.token.id_restaurante, req.body.id_mesa);
    if (mesa.length == 0) return res.status(400).send("Mesa inexistente");
    mesa = mesa[0];

    // validações
    if (mesa.fechada) return res.status(400).send("Essa mesa já foi fechada");
    if (mesa.encerrada) return res.status(400).send("Essa mesa já foi encerrada");

    // obtem o item
    let item = mesa.produtos.find(p => p.id_item == req.body.id_item);

    // altera os dados
    item.removido = true;
    item.data_removeu = new Date();
    mesa.valor_produtos = mesa.produtos.reduce((sum, key) => sum + (key.removido ? 0 : key.preco * key.quantidade), 0);

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