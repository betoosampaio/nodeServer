const mariadb = require('../utils/mariadb.util')
const model = require('../models/ambiente.model');

module.exports.listar = async (req, res) => {
  try {
    let query = `
        select 
             id_ambiente
            ,ds_ambiente
            ,ativo
        from 
            tb_ambiente
        where 
            id_restaurante = ?
            and removido = 0
        order by
            ds_ambiente`

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
             id_ambiente
            ,ds_ambiente
            ,ativo
        from 
          tb_ambiente
        where 
            id_restaurante = ?
            and id_ambiente = ?`

    let data = await mariadb.query(query, [req.token.id_restaurante, req.body.id_ambiente]);
    return res.json(data);
  } catch (error) {
    0
    return res.status(500).send(error.message);
  }
}

module.exports.cadastrar = async (req, res) => {
  try {
    let obj = req.body;

    let errors = model.validarCadastrar(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    let exists = await _existe(obj.ds_ambiente, req.token.id_restaurante);
    if (exists)
      return res.status(400).send('Este ambiente já está cadastrado');

    let query = `
        insert into tb_ambiente(
            ds_ambiente,            
            id_restaurante
            )
        values(?,?)`

    await mariadb.query(query, [
      obj.ds_ambiente,
      req.token.id_restaurante
    ]);

    return res.json("OK");
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

    if (obj.id_ambiente == 1)
      return res.status(400).send('Este ambiente não pode ser editado');

    let exists = await _existeExclusive(obj.ds_ambiente, obj.id_ambiente, req.token.id_restaurante);
    if (exists)
      return res.status(400).send('Este ambiente já está cadastrado');

    let query = `
        update tb_ambiente
        set
            ds_ambiente = ?,           
            ativo = ?
        where
            id_ambiente = ?
            and id_restaurante = ?`

    await mariadb.query(query, [
      obj.ds_ambiente,
      obj.ativo,
      obj.id_ambiente,
      req.token.id_restaurante
    ]);

    return res.json("OK");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.remover = async (req, res) => {
  try {
    let obj = req.body;

    if (obj.id_ambiente == 1)
      return res.status(400).send('Este ambiente não pode ser removido');

    let query = `
        update tb_ambiente
        set
             removido = 1
            ,ds_ambiente_unq = uuid()
        where
            id_ambiente = ?
            and id_restaurante = ?`

    await mariadb.query(query, [obj.id_ambiente, req.token.id_restaurante]);

    return res.json("OK");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.existe = async (req, res) => {
  try {
    let exists = await _existe(req.body.ds_ambiente, req.token.id_restaurante)
    return res.json({ exists: exists });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}


let _existe = async (ds_ambiente, id_restaurante) => {
  let data = await mariadb.query(`
    select 1 
    from tb_ambiente
    where ds_ambiente = ? and id_restaurante = ?`,
    [ds_ambiente, id_restaurante]);
  return data.length > 0 ? true : false;
}

let _existeExclusive = async (ds_ambiente, id_ambiente, id_restaurante) => {
  let data = await mariadb.query(`
    select 1 
    from 
        tb_ambiente
    where 
        ds_ambiente = ? 
        and id_ambiente != ? 
        and id_restaurante = ?`,
    [ds_ambiente, id_ambiente, id_restaurante]);
  return data.length > 0 ? true : false;
}