const mariadb = require('../utils/mariadb.util');
const model = require('../models/operador.model');


module.exports.listar = async (req, res) => {
    try {
        let query = `
        select 
             o.id_operador
            ,o.nome_operador
            ,o.id_perfil
            ,p.tipo_perfil
            ,o.login_operador
            ,o.ativo
        from 
            tb_operador o
            inner join tb_perfil p
                on p.id_perfil = o.id_perfil
        where 
            id_restaurante = ?
            and removido = 0`

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
             o.id_operador
            ,o.nome_operador
            ,o.id_perfil
            ,p.tipo_perfil
            ,o.login_operador
            ,o.senha_operador
            ,o.ativo
        from 
            tb_operador o
            inner join tb_perfil p
                on p.id_perfil = o.id_perfil
        where 
            id_restaurante = ?
            and id_operador = ?`

        let data = await mariadb.query(query, [req.token.id_restaurante, req.body.id_operador]);
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

        let loginExists = await _checarSeLoginExiste(obj.login_operador, req.token.id_restaurante);
        if (loginExists)
            return res.status(400).send('Este login já está sendo utilizado');

        let query = `insert into tb_operador(
            nome_operador,
            id_restaurante,
            id_perfil,
            login_operador,
            senha_operador)
            values (?,?,?,?,?)`;

        await mariadb.query(query, [
            obj.nome_operador,
            req.token.id_restaurante,
            obj.id_perfil,
            obj.login_operador,
            obj.senha_operador,
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

        let loginExists = await _checarSeLoginExisteExclusive(obj.login_operador, req.token.id_restaurante, obj.id_operador);
        if (loginExists)
            return res.status(400).send('Este login já está sendo utilizado');

        if (obj.id_operador == 1 && obj.ativo == 0)
            return res.status(400).send('Este usuário não pode ser inativado');

        let query = `
        update tb_operador
        set
               nome_operador = ?
              ,id_perfil = ?
              ,login_operador = ?
              ,senha_operador = ?
              ,ativo = ?
        where
            id_operador = ?
            and id_restaurante = ?`

        await mariadb.query(query, [
            obj.nome_operador,
            obj.id_perfil,
            obj.login_operador,
            obj.senha_operador,
            obj.ativo,
            obj.id_operador,
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

        if (obj.id_operador == 1)
            return res.status(400).send('Este usuário não pode ser removido');

        let query = `
        update tb_operador
        set
             removido = 1
            ,login_operador = uuid()
        where
            id_operador = ?
            and id_restaurante = ?`

        await mariadb.query(query, [
            obj.id_operador
            , req.token.id_restaurante
        ]);

        return res.json("OK");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.listarPerfis = async (req, res) => {
    try {
        let query = 'select id_perfil,tipo_perfil from tb_perfil'
        let data = await mariadb.query(query);
        return res.json(data);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.checarSeLoginExiste = async (req, res) => {
    try {
        let exists;
        if (req.body.id_operador)
            exists = await _checarSeLoginExisteExclusive(req.body.login_operador, req.token.id_restaurante, req.body.id_operador);
        else
            exists = await _checarSeLoginExiste(req.body.login_operador, req.token.id_restaurante);

        return res.json({ exists: exists });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

_checarSeLoginExiste = async (login_operador, id_restaurante) => {
    let data = await mariadb.query("select 1 from tb_operador where login_operador = ? and id_restaurante = ?", [login_operador, id_restaurante]);
    return data.length > 0 ? true : false;
}

_checarSeLoginExisteExclusive = async (login_operador, id_restaurante, id_operador) => {
    let query = `select 1 from tb_operador where login_operador = ? and id_restaurante = ? and id_operador != ?`;
    let data = await mariadb.query(query, [login_operador, id_restaurante, id_operador]);
    return data.length > 0 ? true : false;
}