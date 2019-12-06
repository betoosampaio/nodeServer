
const mariadb = require('../utils/mariadb.util');

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
      let query = `
      insert into tb_permissao_pagina(
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
      let query = `
      insert into tb_permissao_metodo(
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
