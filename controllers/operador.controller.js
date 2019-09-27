const database = require('../config/database.config');
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

        let data = await database.query(query, [req.token.id_restaurante]);
        res.json(data);
    } catch (error) {
        console.log(error);
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
            ,o.ativo
        from 
            tb_operador o
            inner join tb_perfil p
                on p.id_perfil = o.id_perfil
        where 
            id_restaurante = ?
            and id_operador = ?`

        let data = await database.query(query, [req.token.id_restaurante, req.body.id_operador]);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.cadastrar = async (req, res) => {
    try {
        let obj = req.body;

        let errors = model.validarCadastrar(obj);
        if (errors)
            throw new Error(errors[0]);

        let query = `insert into tb_operador(
            nome_operador,
            id_restaurante,
            id_perfil,
            login_operador,
            senha_operador)
            values (?,?,?,?,?)`;

        await database.query(query, [
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

        await database.query(query, [
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
        console.log(error);
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

        let data = await database.query(query, [
            obj.id_operador
            , req.token.id_restaurante
        ]);

        res.json("OK");
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.listarPerfis = async (req, res) => {
    try {
        let query = 'select * from tb_perfil'
        let data = await database.query(query);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}