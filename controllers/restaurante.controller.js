const database = require('../config/database.config');
const model = require('../models/restaurante.model');

module.exports.checarSeCodigoExiste = async (req, res) => {
    try {
        let exists = await _checarSeCodigoExiste(req.body.codigo_restaurante)
        res.json({ exists: exists });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}

module.exports.checarSeCNPJExiste = async (req, res) => {
    try {
        let exists = await _checarSeCNPJExiste(req.body.cnpj)
        res.json({ exists: exists });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}

module.exports.cadastrar = async (req, res) => {
    try {
        let obj = req.body;

        let errors = model.validarCadastrar(obj);
        if (errors)
            throw new Error(errors[0]);

            
        let cnpjExists = await _checarSeCNPJExiste(obj.cnpj);
        if (cnpjExists) {
            throw new Error('CNPJ já cadastrado');
        }
       
        let loginExists = await _checarSeCodigoExiste(obj.codigo_restaurante);
        if (loginExists) {
            throw new Error('Codigo de restaurante já está sendo utilizado');
        }
  
        // ## INSERE RESTAURANTE ##
        let query = `insert into tb_restaurante(
            cnpj,
            nome_fantasia,
            cep,
            logradouro,
            numero,
            bairro,
            municipio,
            uf,
            complemento,
            celular,
            email,
            codigo_banco,
            id_tipo_cadastro_conta,
            id_tipo_conta,
            agencia,
            conta,
            digito,
            cpf_administrador,
            nome_administrador,
            codigo_restaurante)
            values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
            `;

        let data = await database.query(query, [
            obj.cnpj,
            obj.nome_fantasia,
            obj.cep,
            obj.logradouro,
            obj.numero,
            obj.bairro,
            obj.municipio,
            obj.uf,
            obj.complemento,
            obj.celular,
            obj.email,
            obj.codigo_banco,
            obj.id_tipo_cadastro_conta,
            obj.id_tipo_conta,
            obj.agencia,
            obj.conta,
            obj.digito,
            obj.cpf_administrador,
            obj.nome_administrador,
            obj.codigo_restaurante
        ]);

        let id_restaurante = data.insertId;

        // ## INSERE LOGIN ADM ##
        query = `insert into tb_operador(nome_operador,id_restaurante,id_perfil,login_operador,senha_operador) values (?,?,1,?,?)`;
        await database.query(query, [obj.nome_administrador, id_restaurante, obj.login, obj.senha]);

        // ## INSERE OS MENUS PADRÕES ##
        query = `
        insert into tb_menu(ds_menu, id_restaurante, ativo)
        select ds_menu,?,1 from tb_menu_padrao
        `
        await database.query(query, [id_restaurante]);

        res.json('OK');

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.obter = async (req, res) => {
    try {
        let query = `select * from tb_restaurante where id_restaurante = ?`;
        let data = await database.query(query, [req.token.id_restaurante]);
        res.json(data);

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.editar = async (req, res) => {
    try {
        let obj = req.body;
      
        let errors = model.validarEditar(obj);
        if (errors)
            throw new Error(errors[0]);

        let query = `
        update tb_restaurante
        set
             nome_fantasia = ?
            ,cep = ?
            ,logradouro = ?
            ,numero = ?
            ,bairro = ?
            ,municipio = ?
            ,uf = ?
            ,complemento = ?
            ,celular = ?
            ,email = ?
            ,codigo_banco = ?
            ,id_tipo_cadastro_conta = ?
            ,id_tipo_conta = ?
            ,agencia = ?
            ,conta = ?
            ,digito = ?
            ,cpf_administrador = ?
            ,nome_administrador = ?
        where
            id_restaurante = ?;`;

        await database.query(query, [
            obj.nome_fantasia,
            obj.cep,
            obj.logradouro,
            obj.numero,
            obj.bairro,
            obj.municipio,
            obj.uf,
            obj.complemento,
            obj.celular,
            obj.email,
            obj.codigo_banco,
            obj.id_tipo_cadastro_conta,
            obj.id_tipo_conta,
            obj.agencia,
            obj.conta,
            obj.digito,
            obj.cpf_administrador,
            obj.nome_administrador,
            req.token.id_restaurante
        ]);

        res.json('OK');

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
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

        await database.query(query, [req.token.id_restaurante]);

        res.json('OK');

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.reativar = async (req, res) => {
    try {
        let obj = req.body;

        let query = `
        update tb_restaurante
        set
            ativo = 1
        where
            id_restaurante = ?;`;

        await database.query(query, [req.token.id_restaurante]);

        res.json('OK');

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.obterVariaveisCadastro = async (req, res) => {
    try {
        let query = `
        select * from tb_banco;
        select * from tb_municipio;
        select * from tb_estado;
        select * from tb_tipo_conta;
        select * from tb_tipo_cadastro_conta;
        `;
        let data = await database.mquery(query);
        res.json(data);

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}


_checarSeCodigoExiste = async (codigo_restaurante) => {
    let data = await database.query("select 1 from tb_restaurante where codigo_restaurante = ?", codigo_restaurante);
    return data.length > 0 ? true : false;
}

_checarSeCNPJExiste = async (cnpj) => {
    let data = await database.query("select 1 from tb_restaurante where cnpj = ?", cnpj);
    return data.length > 0 ? true : false;
}