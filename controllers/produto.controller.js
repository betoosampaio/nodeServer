const mariadb = require('../utils/mariadb.util');
const mongodb = require('../utils/mongodb.util');
const model = require('../models/produto.model');

module.exports.listar = async (req, res) => {
  try {
    let query = `
        select 
             p.id_produto
            ,p.codigo_produto
            ,p.nome_produto
            ,p.descricao
            ,p.preco
            ,p.id_menu
            ,m.ds_menu
            ,p.id_ambiente
            ,a.ds_ambiente
            ,p.visivel
            ,p.promocao
            ,p.imagem
            ,p.ativo
        from 
            tb_produto p
            inner join tb_menu m
                on m.id_menu = p.id_menu
                and m.id_restaurante = p.id_restaurante
            left join tb_ambiente a
            on p.id_ambiente = p.id_ambiente
                and a.id_restaurante = p.id_restaurante
        where 
            p.id_restaurante = ?
            and p.removido = 0`

    let data = await mariadb.query(query, [req.token.id_restaurante]);
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.listarAtivos = async (req, res) => {
  try {
    let query = `
        select 
             p.id_produto
            ,p.codigo_produto
            ,p.nome_produto
            ,p.descricao
            ,p.preco
            ,p.id_menu
            ,m.ds_menu
            ,p.id_ambiente
            ,a.ds_ambiente
            ,p.visivel
            ,p.promocao
            ,p.imagem
            ,p.ativo
        from 
            tb_produto p
            inner join tb_menu m
                on m.id_menu = p.id_menu
                and m.id_restaurante = p.id_restaurante
            left join tb_ambiente a
              on p.id_ambiente = p.id_ambiente
                and a.id_restaurante = p.id_restaurante
        where 
            p.id_restaurante = ?
            and p.removido = 0
            and p.ativo = 1`

    let data = await mariadb.query(query, [req.token.id_restaurante]);
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obter = async (req, res) => {
  try {
    let query = `
        select 
             p.id_produto
            ,codigo_produto
            ,p.nome_produto
            ,p.descricao
            ,p.preco
            ,p.id_menu
            ,m.ds_menu
            ,p.id_ambiente
            ,a.ds_ambiente
            ,p.visivel
            ,p.promocao
            ,p.imagem
            ,p.ativo
        from 
            tb_produto p
            inner join tb_menu m
                on m.id_menu = p.id_menu
                and m.id_restaurante = p.id_restaurante
            left join tb_ambiente a
              on p.id_ambiente = p.id_ambiente
                and a.id_restaurante = p.id_restaurante
        where
            p.id_restaurante = ?
            and p.id_produto = ?`

    let data = await mariadb.query(query, [req.token.id_restaurante, req.body.id_produto]);
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.cadastrar = async (req, res) => {
  try {
    let obj = req.body;

    let errors = model.validarCadastrar(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    let exists = await _checarSeCodigoProdutoExiste(obj.codigo_produto, req.token.id_restaurante);
    if (exists)
      return res.status(400).send('Este código de produto já está cadastrado');

    obj.preco = parseFloat(obj.preco).toFixed(2) / 1;

    let query = `
        insert into tb_produto(
             id_restaurante
            ,codigo_produto
            ,nome_produto
            ,descricao
            ,preco
            ,id_menu
            ,id_ambiente
            ,visivel
            ,promocao
            ,imagem
            )
        values(?,?,?,?,?,?,?,?,?,?)`

    await mariadb.query(query, [
      req.token.id_restaurante
      , obj.codigo_produto
      , obj.nome_produto
      , obj.descricao
      , obj.preco
      , obj.id_menu
      , obj.id_ambiente
      , obj.visivel
      , obj.promocao
      , obj.imagem
    ]);

    return res.json('OK');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.editar = async (req, res) => {
  try {
    let obj = req.body;

    let errors = model.validarEditar(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    let exists = await _checarSeCodigoProdutoExisteExclusive(obj.codigo_produto, obj.id_produto, req.token.id_restaurante);
    if (exists)
      return res.status(400).send('Este código de produto já está cadastrado');

    obj.preco = parseFloat(obj.preco).toFixed(2) / 1;

    let query = `
        update tb_produto
        set
             codigo_produto = ?
            ,nome_produto = ?
            ,descricao = ?
            ,preco = ?
            ,id_menu = ?
            ,id_ambiente = ?
            ,visivel = ?
            ,promocao = ?
            ,imagem = ?
            ,ativo = ?
        where
            id_produto = ?
            and id_restaurante = ?`

    await mariadb.query(query, [
      obj.codigo_produto
      , obj.nome_produto
      , obj.descricao
      , obj.preco
      , obj.id_menu
      , obj.id_ambiente
      , obj.visivel
      , obj.promocao
      , obj.imagem
      , obj.ativo
      , obj.id_produto
      , req.token.id_restaurante
    ]);

    return res.json("OK");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.remover = async (req, res) => {
  try {
    let obj = req.body;
    let query = `
        update tb_produto
        set
             removido = 1
            ,codigo_produto_removido = codigo_produto
            ,codigo_produto = uuid()
        where
            id_produto = ?
            and id_restaurante = ?`

    await mariadb.query(query, [
      obj.id_produto
      , req.token.id_restaurante
    ]);

    return res.json("OK");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.uploadimg = async (req, res) => {
  try {
    await mongodb.insertOne('logdb', 'uploadimgproduto', req.file);
    return res.json(req.file.path);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports._obter = async (id_restaurante, id_produto) => {
  let query = `
        select 
             p.id_produto
            ,p.codigo_produto
            ,p.nome_produto
            ,p.descricao
            ,p.preco
            ,p.id_menu
            ,m.ds_menu
            ,p.id_ambiente
            ,a.ds_ambiente
            ,p.visivel
            ,p.promocao
            ,p.imagem
            ,p.ativo
        from 
            tb_produto p
            inner join tb_menu m
                on m.id_menu = p.id_menu
                and m.id_restaurante = p.id_restaurante
            left join tb_ambiente a
                on p.id_ambiente = p.id_ambiente
                and a.id_restaurante = p.id_restaurante
        where 
            p.id_restaurante = ?
            and p.id_produto = ?`

  let data = await mariadb.query(query, [id_restaurante, id_produto]);
  return data;
}

module.exports.checarSeCodigoProdutoExiste = async (req, res) => {
  try {
    let exists = await _checarSeCodigoProdutoExiste(req.body.codigo_produto, req.token.id_restaurante);
    return res.json({ exists: exists });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

_checarSeCodigoProdutoExiste = async (codigo_produto, id_restaurante) => {
  let data = await mariadb.query(`
    select 1 from tb_produto 
    where codigo_produto = ? and id_restaurante = ?`, [codigo_produto, id_restaurante]);
  return data.length > 0 ? true : false;
}

_checarSeCodigoProdutoExisteExclusive = async (codigo_produto, id_produto, id_restaurante) => {
  let data = await mariadb.query(`
    select 1 from tb_produto 
    where codigo_produto = ? and id_produto != ? and id_restaurante = ?`,
    [codigo_produto, id_produto, id_restaurante]);
  return data.length > 0 ? true : false;
}

module.exports.obterProximoCodigoProduto = async (req, res) => {
  try {
    let query = `
        select 
            ifnull(MAX(codigo_produto),0)+1 codigo_produto
        from 
            tb_produto
        where 
            id_restaurante = ?
            and codigo_produto REGEXP '^-?[0-9]+$';`

    let data = await mariadb.query(query, [req.token.id_restaurante]);
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
