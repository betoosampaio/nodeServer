const database = require('../config/database.config')
const model = require('../models/menu.model');

module.exports.listar = async (req, res) => {
    try {
        let query = `
        select 
             id_menu
            ,ds_menu
        from 
            tb_menu
        where 
            id_restaurante = ?
            and ativo = 1`

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
             id_menu
            ,ds_menu
        from 
            tb_menu
        where 
            id_restaurante = ?
            and id_menu = ?`

        let data = await database.query(query, [req.token.id_restaurante, req.body.id_menu]);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.cadastrar = async (req, res) => {
    try {
        let obj = req.body;

        let errors = model.validar(obj);
        if (errors)
            throw new Error(errors[0]);

        let query = `
        insert into tb_menu(
              ds_menu
             ,id_restaurante
            )
        values(?,?)`

        let data = await database.query(query, [
             obj.ds_menu
            ,req.token.id_restaurante
        ]);

        res.json("OK");
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.editar = async (req, res) => {
    try {
        let obj = req.body;

        let errors = model.validar(obj);
        if (errors)
            throw new Error(errors[0]);

        let query = `
        update tb_menu
        set
               ds_menu = ?
        where
            id_menu = ?
            and id_restaurante = ?`

        let data = await database.query(query, [
             obj.ds_menu            
            ,obj.id_menu
            ,req.token.id_restaurante
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
        update tb_menu
        set
            ativo = 0
        where
            id_menu = ?
            and id_restaurante = ?`

        let data = await database.query(query, [
             obj.id_menu
            ,req.token.id_restaurante
        ]);

        res.json("OK");
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

