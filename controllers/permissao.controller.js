
const mariadb = require('../utils/mariadb.util');
const model = require('../models/permissao.model');

module.exports.listarPaginas = async (req, res) => {
  try {
    let query = `select * from tb_pagina order by ordem`
    let data = await mariadb.query(query);
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.listarPermissaoPaginas = async (req, res) => {
  try {
    let query = `
      SELECT 
	      p.id_pagina,
        p.ds_pagina,
        p.icone,
        p.id_pai,
        p.url,
        p.ordem,
	      case when pp.id_pagina is null then 0 else 1 end permissao
      FROM 
	      tb_pagina p
	      left join tb_permissao_pagina pp
		      ON pp.id_pagina = p.id_pagina
		      AND id_restaurante = ?
		      AND id_perfil = ? `

    let data = await mariadb.query(query, [req.token.id_restaurante, req.body.id_perfil]);
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.incluirPermissaoPagina = async (req, res) => {
  try {

    // validação dos dados da requisição
    let errors = model.validarPagina(req.body);
    if (errors)
      return res.status(400).send(errors[0]);

    if (req.body.id_perfil == 1)
      return res.status(400).send('Este perfil não pode ser modificado');

    let exists = await _paginaExiste(req.body.id_pagina);
    if (!exists)
      return res.status(400).send('Página inexistente');

    let query = `
      insert ignore into tb_permissao_pagina(
        id_restaurante,id_perfil,id_pagina)
      values (?,?,?)`

    await mariadb.query(query, [req.token.id_restaurante, req.body.id_perfil, req.body.id_pagina]);
    return res.json("OK");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.removerPermissaoPagina = async (req, res) => {
  try {

    // validação dos dados da requisição
    let errors = model.validarPagina(req.body);
    if (errors)
      return res.status(400).send(errors[0]);

    if (req.body.id_perfil == 1)
      return res.status(400).send('Este perfil não pode ser modificado');

    let query = `
      delete from tb_permissao_pagina 
      where
        id_restaurante = ?
        and id_perfil = ?
        and id_pagina = ?`

    await mariadb.query(query, [req.token.id_restaurante, req.body.id_perfil, req.body.id_pagina]);
    return res.json("OK");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}



module.exports.listarMetodos = async (req, res) => {
  try {
    let query = `
      select 
        * 
      from 
        tb_metodo`
    let data = await mariadb.query(query);
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.listarPermissaoMetodos = async (req, res) => {
  try {
    let query = `
      SELECT 
	      m.id_metodo,
        m.ds_metodo,
        m.funcionalidade,
	      case when pm.id_metodo is null then 0 else 1 end permissao
      FROM 
	      tb_metodo m
	      left join tb_permissao_metodo pm
		      ON pm.id_metodo = m.id_metodo
		      AND id_restaurante = ?
		      AND id_perfil = ? `

    let data = await mariadb.query(query, [req.token.id_restaurante, req.body.id_perfil]);
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.incluirPermissaoMetodo = async (req, res) => {
  try {

    // validação dos dados da requisição
    let errors = model.validarMetodo(req.body);
    if (errors)
      return res.status(400).send(errors[0]);

    if (req.body.id_perfil == 1)
      return res.status(400).send('Este perfil não pode ser modificado');

    let exists = await _metodoExiste(req.body.id_metodo);
    if (!exists)
      return res.status(400).send('Método inexistente');

    let query = `
      insert ignore into tb_permissao_metodo(
        id_restaurante,id_perfil,id_metodo)
      values (?,?,?)`

    await mariadb.query(query, [req.token.id_restaurante, req.body.id_perfil, req.body.id_metodo]);
    return res.json("OK");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.removerPermissaoMetodo = async (req, res) => {
  try {

    // validação dos dados da requisição
    let errors = model.validarMetodo(req.body);
    if (errors)
      return res.status(400).send(errors[0]);

    if (req.body.id_perfil == 1)
      return res.status(400).send('Este perfil não pode ser modificado');

    let query = `
      delete from tb_permissao_metodo
      where
        id_restaurante = ?
        and id_perfil = ?
        and id_metodo = ?`

    await mariadb.query(query, [req.token.id_restaurante, req.body.id_perfil, req.body.id_metodo]);
    return res.json("OK");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

let _paginaExiste = async (id_pagina) => {
  let data = await mariadb.query(`
  select 1 
  from tb_pagina
  where id_pagina = ?`,
    [id_pagina]);
  return data.length > 0 ? true : false;
}

let _metodoExiste = async (id_metodo) => {
  let data = await mariadb.query(`
  select 1 
  from tb_metodo
  where id_metodo = ?`,
    [id_metodo]);
  return data.length > 0 ? true : false;
}