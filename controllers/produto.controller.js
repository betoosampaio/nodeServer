const mariadb = require('../utils/mariadb.util');
const mongodb = require('../utils/mongodb.util');
const model = require('../models/produto.model');

module.exports.listar = async (req, res) => {
    try {
        let query = `
        select 
             p.id_produto
            ,p.nome_produto
            ,p.descricao
            ,p.preco
            ,p.id_menu
            ,m.ds_menu
            ,p.visivel
            ,p.promocao
            ,p.imagem
            ,p.ativo
        from 
            tb_produto p
            inner join tb_menu m
                on m.id_menu = p.id_menu
                and m.id_restaurante = p.id_restaurante
        where 
            p.id_restaurante = ?
            and p.removido = 0`

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
             p.id_produto
            ,p.nome_produto
            ,p.descricao
            ,p.preco
            ,p.id_menu
            ,m.ds_menu
            ,p.visivel
            ,p.promocao
            ,p.imagem
            ,p.ativo
        from 
            tb_produto p
            inner join tb_menu m
                on m.id_menu = p.id_menu
                and m.id_restaurante = p.id_restaurante
        where 
            p.id_restaurante = ?
            and p.id_produto = ?`

        let data = await mariadb.query(query, [req.token.id_restaurante, req.body.id_produto]);
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

        let query = `
        insert into tb_produto(
             id_restaurante
            ,nome_produto
            ,descricao
            ,preco
            ,id_menu
            ,visivel
            ,promocao
            ,imagem
            )
        values(?,?,?,?,?,?,?,?)`

        await mariadb.query(query, [
            req.token.id_restaurante
            , obj.nome_produto
            , obj.descricao
            , obj.preco
            , obj.id_menu
            , obj.visivel
            , obj.promocao
            , obj.imagem
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

        let query = `
        update tb_produto
        set
             nome_produto = ?
            ,descricao = ?
            ,preco = ?
            ,id_menu = ?
            ,visivel = ?
            ,promocao = ?
            ,imagem = ?
            ,ativo = ?
        where
            id_produto = ?
            and id_restaurante = ?`

        await mariadb.query(query, [
            obj.nome_produto
            , obj.descricao
            , obj.preco
            , obj.id_menu
            , obj.visivel
            , obj.promocao
            , obj.imagem
            , obj.ativo
            , obj.id_produto
            , req.token.id_restaurante
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
        update tb_produto
        set
            removido = 1
        where
            id_produto = ?
            and id_restaurante = ?`

        await mariadb.query(query, [
            obj.id_produto
            , req.token.id_restaurante
        ]);

        return res.json("OK");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.uploadimg = async (req, res) => {
    try {
        await mongodb.insertOne('logdb', 'uploadimg', req.file);
        return res.json(req.file.path);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports._obter = async (id_restaurante, id_produto) => {
    let query = `
        select 
             p.id_produto
            ,p.nome_produto
            ,p.descricao
            ,p.preco
            ,p.id_menu
            ,m.ds_menu
            ,p.visivel
            ,p.promocao
            ,p.imagem
            ,p.ativo
        from 
            tb_produto p
            inner join tb_menu m
                on m.id_menu = p.id_menu
                and m.id_restaurante = p.id_restaurante
        where 
            p.id_restaurante = ?
            and p.id_produto = ?`

    let data = await mariadb.query(query, [id_restaurante, id_produto]);
    return data[0];
}