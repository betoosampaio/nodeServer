const mariadb = require('../utils/mariadb.util')
const model = require('../models/menu.model');

module.exports.listar = async (req, res) => {
    try {
        let query = `
        select 
             id_menu
            ,ds_menu
            ,ativo
        from 
            tb_menu
        where 
            id_restaurante = ?
            and removido = 0
        order by
            ds_menu`

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
             id_menu
            ,ds_menu
            ,ativo
        from 
            tb_menu
        where 
            id_restaurante = ?
            and id_menu = ?`

        let data = await mariadb.query(query, [req.token.id_restaurante, req.body.id_menu]);
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

        let exists = await _existe(obj.ds_menu, req.token.id_restaurante);
        if (exists)
            return res.status(400).send('Esta descrição de menu já está sendo utilizada');

        let query = `
        insert into tb_menu(
              ds_menu
             ,ds_menu_unq
             ,id_restaurante
            )
        values(?,?,?)`

        await mariadb.query(query, [
            obj.ds_menu,
            obj.ds_menu,
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

        let exists = await _existeExclusive(obj.ds_menu, obj.id_menu, req.token.id_restaurante);
        if (exists)
            return res.status(400).send('Esta descrição de menu já está sendo utilizada');

        let query = `
        update tb_menu
        set
            ds_menu = ?,
            ds_menu_unq = ?,
            ativo = ?
        where
            id_menu = ?
            and id_restaurante = ?`

        await mariadb.query(query, [
            obj.ds_menu,
            obj.ds_menu,
            obj.ativo,
            obj.id_menu,
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
        let query = `
        update tb_menu
        set
             removido = 1
            ,ds_menu_unq = uuid()
        where
            id_menu = ?
            and id_restaurante = ?`

        await mariadb.query(query, [obj.id_menu, req.token.id_restaurante]);

        return res.json("OK");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.existe = async (req, res) => {
    try {
        let exists = await _existe(req.body.ds_menu, req.token.id_restaurante)
        return res.json({ exists: exists });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


let _existe = async (ds_menu, id_restaurante) => {
    let data = await mariadb.query(`
    select 1 
    from tb_menu 
    where ds_menu_unq = ? and id_restaurante = ?`,
        [ds_menu, id_restaurante]);
    return data.length > 0 ? true : false;
}

let _existeExclusive = async (ds_menu, id_menu, id_restaurante) => {
    let data = await mariadb.query(`
    select 1 
    from 
        tb_menu 
    where 
        ds_menu_unq = ? 
        and id_menu != ? 
        and id_restaurante = ?`,
        [ds_menu, id_menu, id_restaurante]);
    return data.length > 0 ? true : false;
}