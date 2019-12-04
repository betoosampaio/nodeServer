const mariadb = require('../utils/mariadb.util');
const mongodb = require('../utils/mongodb.util');
const model = require('../models/restaurante.model');

module.exports.checarSeCodigoExiste = async (req, res) => {
  try {
    let exists = await _checarSeCodigoExiste(req.body.codigo_restaurante)
    return res.json({ exists: exists });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.checarSeCNPJExiste = async (req, res) => {
  try {
    let exists = await _checarSeCNPJExiste(req.body.cnpj)
    return res.json({ exists: exists });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.uploadimg = async (req, res) => {
  try {
    await mongodb.insertOne('logdb', 'uploadimgrestaurante', req.file);
    return res.json(req.file.path);
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


    let cnpjExists = await _checarSeCNPJExiste(obj.cnpj);
    if (cnpjExists)
      return res.status(400).send('CNPJ já cadastrado');

    let loginExists = await _checarSeCodigoExiste(obj.codigo_restaurante);
    if (loginExists)
      return res.status(400).send('Codigo de restaurante já está sendo utilizado');

    // ## INSERE RESTAURANTE ##
    let query = `insert into tb_restaurante(
            cnpj,
            imagem,
            razao_social,
            nome_restaurante,
            id_especialidade,
            id_id_tipo_atendimento,
            cep,
            logradouro,
            numero,
            bairro,
            municipio,
            uf,
            complemento,
            celular,
            email,
            pagamento_app,
            codigo_banco,
            id_tipo_cadastro_conta,
            id_tipo_conta,
            agencia,
            conta,
            digito,
            cpfcnpj_conta,
            cpf_administrador,
            nome_administrador,
            codigo_restaurante)
            values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
            `;

    let data = await mariadb.query(query, [
      obj.cnpj,
      obj.imagem,
      obj.razao_social,
      obj.nome_restaurante,
      obj.id_especialidade,
      obj.id_tipo_atendimento,
      obj.cep,
      obj.logradouro,
      obj.numero,
      obj.bairro,
      obj.municipio,
      obj.uf,
      obj.complemento,
      obj.celular,
      obj.email,
      obj.pagamento_app,
      obj.codigo_banco,
      obj.id_tipo_cadastro_conta,
      obj.id_tipo_conta,
      obj.agencia,
      obj.conta,
      obj.digito,
      obj.cpfcnpj_conta,
      obj.cpf_administrador,
      obj.nome_administrador,
      obj.codigo_restaurante
    ]);

    let id_restaurante = data.insertId;

    // ## INSERE O PERFIL ADM ##
    query = `insert into tb_perfil(id_restaurante,ds_perfil,ds_perfil_unq) values (?,'Administrador','Administrador')`;
    await mariadb.query(query, [id_restaurante]);

    // ## INSERE LOGIN ADM ##
    query = `insert into tb_operador(nome_operador,id_restaurante,id_perfil,login_operador,senha_operador) values (?,?,1,?,?)`;
    await mariadb.query(query, [obj.nome_administrador, id_restaurante, obj.login, obj.senha]);

    // ## INSERE OS MENUS PADRÕES ##
    query = `
        insert into tb_menu(ds_menu, id_restaurante, ativo)
        select ds_menu,?,1 from tb_menu_padrao
        `
    await mariadb.query(query, [id_restaurante]);

    return res.json('OK');

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obter = async (req, res) => {
  try {
    let query = `
        select
           codigo_restaurante,
           cnpj,
           imagem,
           razao_social,
           nome_restaurante,
           r.id_especialidade,
           ds_especialidade,
           r.id_tipo_atendimento,
           ds_id_tipo_atendimento,
           cep,
           logradouro,
           numero,
           complemento,
           bairro,
           municipio,
           uf,
           celular,
           email,
           pagamento_app,
           cpfcnpj_conta,
           r.id_tipo_cadastro_conta,
           tipo_cadastro_conta,
           r.id_tipo_conta,
           tipo_conta,
           codigo_banco,
           b.nome nome_banco,
           agencia,
           conta,
           digito,
           nome_administrador,
           cpf_administrador,
           ativo  
        from 
            tb_restaurante r
            left join tb_banco b
                on r.codigo_banco = b.codigo
            left join tb_tipo_conta tc
                on tc.id_tipo_conta = r.id_tipo_conta
            left join tb_tipo_cadastro_conta tcc
                on tcc.id_tipo_cadastro_conta = r.id_tipo_cadastro_conta
            left join tb_especialidade e
                on e.id_especialidade = r.id_especialidade
            left join tb_tipo_atendimento ta
                on ta.id_tipo_atendimento = r.id_tipo_atendimento
        where 
            id_restaurante = ?`;
    let data = await mariadb.query(query, [req.token.id_restaurante]);
    return res.json(data);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.editarDadosRestaurante = async (req, res) => {
  try {
    let obj = req.body;

    let errors = model.validarEditarDadosRestaurante(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    let loginExists = await _checarSeCodigoExisteExclusive(obj.codigo_restaurante, req.token.id_restaurante);
    if (loginExists)
      return res.status(400).send('Codigo de restaurante já está sendo utilizado');

    let query = `
        update tb_restaurante
        set
             codigo_restaurante = ?
            ,razao_social = ?
            ,imagem = ?
            ,nome_restaurante = ?
            ,id_especialidade = ?
            ,id_tipo_atendimento = ?
            ,cep = ?
            ,logradouro = ?
            ,numero = ?
            ,bairro = ?
            ,municipio = ?
            ,uf = ?
            ,complemento = ?
        where
            id_restaurante = ?;`;

    await mariadb.query(query, [
      obj.codigo_restaurante,
      obj.razao_social,
      obj.imagem,
      obj.nome_restaurante,
      obj.id_especialidade,
      obj.id_tipo_atendimento,
      obj.cep,
      obj.logradouro,
      obj.numero,
      obj.bairro,
      obj.municipio,
      obj.uf,
      obj.complemento,
      req.token.id_restaurante
    ]);

    return res.json('OK');

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.editarDadosBancarios = async (req, res) => {
  try {
    let obj = req.body;

    let errors = model.validarEditarDadosBancarios(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    let query = `
        update tb_restaurante
        set
             pagamento_app = ?
            ,id_tipo_cadastro_conta = ?
            ,id_tipo_conta = ?
            ,codigo_banco = ?
            ,agencia = ?
            ,conta = ?
            ,digito = ?
            ,cpfcnpj_conta = ?
        where
            id_restaurante = ?;`;

    await mariadb.query(query, [
      obj.pagamento_app,
      obj.id_tipo_cadastro_conta,
      obj.id_tipo_conta,
      obj.codigo_banco,
      obj.agencia,
      obj.conta,
      obj.digito,
      obj.cpfcnpj_conta,
      req.token.id_restaurante
    ]);

    return res.json('OK');

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.editarDadosPessoais = async (req, res) => {
  try {
    let obj = req.body;

    let errors = model.validarEditarDadosPessoais(obj);
    if (errors)
      return res.status(400).send(errors[0]);

    let query = `
        update tb_restaurante
        set
             cpf_administrador = ?
            ,nome_administrador = ?
            ,email = ?
            ,celular = ?
        where
            id_restaurante = ?;`;

    await mariadb.query(query, [
      obj.cpf_administrador,
      obj.nome_administrador,
      obj.email,
      obj.celular,
      req.token.id_restaurante
    ]);

    return res.json('OK');

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.inativar = async (req, res) => {
  try {
    let obj = req.body;

    let query = `
        update tb_restaurante
        set
            ativo = 0
        where
            id_restaurante = ?;`;

    await mariadb.query(query, [req.token.id_restaurante]);

    return res.json('OK');

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.reativar = async (req, res) => {
  try {
    let query = `
        update tb_restaurante
        set
            ativo = 1
        where
            id_restaurante = ?;`;

    await mariadb.query(query, [req.token.id_restaurante]);

    return res.json('OK');

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obterBancos = async (req, res) => {
  try {
    let query = 'select * from tb_banco';
    let data = await mariadb.query(query);
    return res.json(data);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obterMunicipios = async (req, res) => {
  try {
    let query = 'select * from tb_municipio';
    let data = await mariadb.query(query);
    return res.json(data);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obterEspecialidades = async (req, res) => {
  try {
    let query = 'select * from tb_especialidade';
    let data = await mariadb.query(query);
    return res.json(data);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obterTipoAtendimento = async (req, res) => {
  try {
    let query = 'select * from tb_tipo_atendimento';
    let data = await mariadb.query(query);
    return res.json(data);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obterFormasPagamento = async (req, res) => {
  try {
    let query = 'select * from tb_forma_pagamento';
    let data = await mariadb.query(query);
    return res.json(data);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports._obterFormaPagamento = async (id_forma_pagamento) => {
  let query = 'select * from tb_forma_pagamento where id_forma_pagamento = ?'
  let data = await mariadb.query(query, [id_forma_pagamento]);
  return data;
}

_checarSeCodigoExiste = async (codigo_restaurante) => {
  let data = await mariadb.query("select 1 from tb_restaurante where codigo_restaurante = ?", codigo_restaurante);
  return data.length > 0 ? true : false;
}

_checarSeCodigoExisteExclusive = async (codigo_restaurante, id_restaurante) => {
  let query = `select 1 from tb_restaurante where codigo_restaurante = ? and id_restaurante != ?`;
  let data = await mariadb.query(query, [codigo_restaurante, id_restaurante]);
  return data.length > 0 ? true : false;
}

_checarSeCNPJExiste = async (cnpj) => {
  let data = await mariadb.query("select 1 from tb_restaurante where cnpj = ?", cnpj);
  return data.length > 0 ? true : false;
}

module.exports.editarConfiguracoes = async (req, res) => {
  try {
    let errors = model.validarEditarConfiguracoes(req.body);
    if (errors)
      return res.status(400).send(errors[0]);

    await mongodb.updateOne('freeddb', 'configuracao', { id_restaurante: req.token.id_restaurante },
      {
        $set: {
          "id_restaurante": req.token.id_restaurante,
          "taxa_servico": req.body.taxa_servico,
        }
      },
      {
        upsert: true,
      });

    return res.json('OK');

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports.obterConfiguracoes = async (req, res) => {
  try {
    let data = await mongodb.findOne('freeddb', 'configuracao', {
      id_restaurante: req.token.id_restaurante,
    },
      {
        fields: {
          _id: false,
          id_restaurante: false,
        }
      });
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}