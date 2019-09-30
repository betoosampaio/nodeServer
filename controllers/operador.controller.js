const mariadb = require('../utils/mariadb.util');
const model = require('../models/operador.model');


module.exports.listar = async (req, res) => {
    try {
        let query = `
        select 
             o.id_operador
            ,o.id_restaurante
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
        res.json(data);
    } catch (error) {
        res.status(400).send({ msg: error.message });

    }
}

module.exports.obter = async (req, res) => {
    try {
        let query = `
        select 
             o.id_operador
            ,o.id_restaurante
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
        res.json(data);
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
}

module.exports.cadastrar = async (req, res) => {
    try {
        let obj = req.body;

        let errors = model.validarCadastrar(obj);
        if (errors)
            throw new Error(errors[0]);

        let loginExists = await _checarSeLoginExiste(obj.login_operador, req.token.id_restaurante);
        if (loginExists) {
            throw new Error('Este login já está sendo utilizado');
        }

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

        res.json('OK');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports.editar = async (req, res) => {
    try {
        let obj = req.body;

        let errors = model.validarEditar(obj);
        if (errors)
            throw new Error(errors[0]);

        let loginExists = await _checarSeLoginExisteExclusive(obj.login_operador, req.token.id_restaurante, obj.id_operador);
        if (loginExists) {
            throw new Error('Este login já está sendo utilizado');
        }

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

        res.json("OK");
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
}

module.exports.remover = async (req, res) => {
    try {
        let obj = req.body;
        let query = `
        update tb_operador
        set
            removido = 1
        where
            id_operador = ?
            and id_restaurante = ?`

        let data = await mariadb.query(query, [
            obj.id_operador
            , req.token.id_restaurante
        ]);

        res.json("OK");
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
}

module.exports.listarPerfis = async (req, res) => {
    try {
        let query = 'select * from tb_perfil'
        let data = await mariadb.query(query);
        res.json(data);
    } catch (error) {
        res.status(400).send({ msg: error.message });
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