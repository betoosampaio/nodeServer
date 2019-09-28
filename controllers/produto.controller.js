const database = require('../config/database.config');
const model = require('../models/produto.model');

module.exports.listar = async (req, res) => {
    try {
        let query = `
        select 
             p.id_produto
            ,p.id_restaurante
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
        where 
            p.id_restaurante = ?
            and p.removido = 0`

        let data = await database.query(query, [req.token.id_restaurante]);
        res.json(data);
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
}

module.exports.obter = async (req, res) => {
    try {
        let query = `
        select 
             p.id_produto
            ,p.id_restaurante
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
        where 
            p.id_restaurante = ?
            and p.id_produto = ?`

        let data = await database.query(query, [req.token.id_restaurante, req.body.id_produto]);
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

        let data = await database.query(query, [
             obj.nome_produto
            ,obj.descricao
            ,obj.preco
            ,obj.id_menu
            ,obj.visivel
            ,obj.promocao
            ,obj.imagem
            ,obj.ativo        
            ,obj.id_produto
            ,req.token.id_restaurante
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
        update tb_produto
        set
            removido = 1
        where
            id_produto = ?
            and id_restaurante = ?`

        let data = await database.query(query, [
             obj.id_produto
            ,req.token.id_restaurante
        ]);

        res.json("OK");
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
}