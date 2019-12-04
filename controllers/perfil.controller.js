const mariadb = require('../utils/mariadb.util')
const model = require('../models/perfil.model');

module.exports.listar = async (req, res) => {
    try {
        let query = `
        select 
             id_perfil
            ,ds_perfil
            ,ativo
        from 
            tb_perfil
        where 
            id_restaurante = ?
            and removido = 0
        order by
            ds_perfil`

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
             id_perfil
            ,ds_perfil
            ,ativo
        from 
            tb_perfil
        where 
            id_restaurante = ?
            and id_perfil = ?`

        let data = await mariadb.query(query, [req.token.id_restaurante, req.body.id_perfil]);
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

        let exists = await _existe(obj.ds_perfil, req.token.id_restaurante);
        if (exists)
            return res.status(400).send('Esta perfil já está cadastrado');

        let query = `
        insert into tb_perfil(
            ds_perfil,
            ds_perfil_unq,
            id_restaurante
            )
        values(?,?,?)`

        await mariadb.query(query, [
            obj.ds_perfil,
            obj.ds_perfil,
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

        if (obj.id_perfil == 1)
            return res.status(400).send('Este perfil não pode ser editado');

        let exists = await _existeExclusive(obj.ds_perfil, obj.id_perfil, req.token.id_restaurante);
        if (exists)
            return res.status(400).send('Esta perfil já está cadastrado');

        let query = `
        update tb_perfil
        set
            ds_perfil = ?,
            ds_perfil_unq = ?,
            ativo = ?
        where
            id_perfil = ?
            and id_restaurante = ?`

        await mariadb.query(query, [
            obj.ds_perfil,
            obj.ds_perfil,
            obj.ativo,
            obj.id_perfil,
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

        if (obj.id_perfil == 1)
            return res.status(400).send('Este perfil não pode ser removido');

        let query = `
        update tb_perfil
        set
             removido = 1
            ,ds_perfil_unq = uuid()
        where
            id_perfil = ?
            and id_restaurante = ?`

        await mariadb.query(query, [obj.id_perfil, req.token.id_restaurante]);

        return res.json("OK");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.existe = async (req, res) => {
    try {
        let exists = await _existe(req.body.ds_perfil, req.token.id_restaurante)
        return res.json({ exists: exists });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


_existe = async (ds_perfil, id_restaurante) => {
    let data = await mariadb.query(`
    select 1 
    from tb_perfil
    where ds_perfil_unq = ? and id_restaurante = ?`,
        [ds_perfil, id_restaurante]);
    return data.length > 0 ? true : false;
}

_existeExclusive = async (ds_perfil, id_perfil, id_restaurante) => {
    let data = await mariadb.query(`
    select 1 
    from 
        tb_perfil
    where 
        ds_perfil_unq = ? 
        and id_perfil != ? 
        and id_restaurante = ?`,
        [ds_perfil, id_perfil, id_restaurante]);
    return data.length > 0 ? true : false;
}