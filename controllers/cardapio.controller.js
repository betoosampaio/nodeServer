const database = require('../config/database.config');
const model = require('../models/cardapio.model');

module.exports.listar = async (req, res) => {
    try {
        let query = `
        select 
             c.id_cardapio
            ,c.id_restaurante
            ,c.nome_produto
            ,c.descricao
            ,c.preco
            ,c.id_menu
            ,m.ds_menu
            ,c.visivel
            ,c.promocao
            ,c.imagem
            ,c.ativo
        from 
            tb_cardapio c
            inner join tb_menu m
                on m.id_menu = c.id_menu
        where 
            c.id_restaurante = ?
            and c.removido = 0`

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
             c.id_cardapio
            ,c.id_restaurante
            ,c.nome_produto
            ,c.descricao
            ,c.preco
            ,c.id_menu
            ,m.ds_menu
            ,c.visivel
            ,c.promocao
            ,c.imagem
            ,c.ativo
        from 
            tb_cardapio c
            inner join tb_menu m
                on m.id_menu = c.id_menu
        where 
            c.id_restaurante = ?
            and c.id_cardapio = ?`

        let data = await database.query(query, [req.token.id_restaurante, req.body.id_cardapio]);
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
     
        let query = `
        insert into tb_cardapio(
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

        let data = await database.query(query, [
             req.token.id_restaurante
            ,obj.nome_produto
            ,obj.descricao
            ,obj.preco
            ,obj.id_menu
            ,obj.visivel
            ,obj.promocao
            ,obj.imagem
        ]);

        res.json('OK');
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
        update tb_cardapio
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
            id_cardapio = ?
            and id_restaurante = ?`

        let data = await database.query(query, [
             obj.nome_produto
            ,obj.descricao
            ,obj.preco
            ,obj.id_menu
            ,obj.visivel
            ,obj.promocao
            ,obj.imagem
            ,obj.ativo        
            ,obj.id_cardapio
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
        update tb_cardapio
        set
            removido = 1
        where
            id_cardapio = ?
            and id_restaurante = ?`

        let data = await database.query(query, [
             obj.id_cardapio
            ,req.token.id_restaurante
        ]);

        res.json("OK");
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}