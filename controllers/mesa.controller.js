const mongodb = require('../utils/mongodb.util');
const ObjectId = require('../utils/mongodb.util').ObjectId;
const emitTo = require('../socket').emitTo;
const model = require('../models/mesa.model');
const produtoCtrl = require('../controllers/produto.controller');

module.exports.listar = async (req, res) => {
    try {

        let data = await mongodb.find('freeddb', 'mesa', {
            id_restaurante: req.token.id_restaurante,
            aberta: true
        });

        return res.json(data);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.obter = async (req, res) => {
    try {
        let data = await mongodb.find('freeddb', 'mesa', {
            id_restaurante: req.token.id_restaurante,
            _id: ObjectId(req.body.id_mesa)
        });

        return res.json(data);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.cadastrar = async (req, res) => {
    try {

        let obj = {
            id_restaurante: req.token.id_restaurante,
            id_operador_abertura: req.token.id_operador,
            aberta: true,
            data_abertura: new Date(),
            numero: req.body.numero,
        }

        let errors = model.validarCadastrar(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        // verifica se a mesa com mesmo número está ativa
        let data = await mongodb.find('freeddb', 'mesa', {
            id_restaurante: req.token.id_restaurante,
            aberta: true,
            numero: req.body.numero
        });
        if (data.length > 0)
            return res.status(400).send('uma mesa com este número já está aberta');

        await mongodb.insertOne('freeddb', 'mesa', obj);

        //enviarDadosSockets(req.token.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.remover = async (req, res) => {
    try {

        let obj = {
            id_mesa: req.body.id_mesa
        }

        let errors = model.validarIdMesa(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        await mongodb.updateOne('freeddb', 'mesa',
            {
                _id: new ObjectId(obj.id_mesa),
                id_restaurante: req.token.id_restaurante
            },
            {
                $set: { aberta: false }
            }
        );

        //enviarDadosSockets(req.token.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.fechar = async (req, res) => {
    try {

        let obj = {
            id_mesa: req.body.id_mesa,
        }

        let errors = model.validarIdMesa(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        await mongodb.updateOne('freeddb', 'mesa',
            {
                _id: new ObjectId(obj.id_mesa),
                id_restaurante: req.token.id_restaurante
            },
            {
                $set: {
                    aberta: false,                   
                    fechada: true,
                    data_fechamento: new Date()
                }
            }
        );

        //enviarDadosSockets(req.token.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.incluirItem = async (req, res) => {
    try {
        // recupera os dados da requisição
        let obj = {
            id_mesa: req.body.id_mesa,
            id_produto: req.body.id_produto,
            quantidade: req.body.quantidade,
        }

        // validação dos dados da requisição
        let errors = model.validarIncluirItem(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        // obtendo os dados do produto
        let produto = await produtoCtrl._obter(req.token.id_restaurante, obj.id_produto);
        if (!produto)
            res.status(400).send("produto inválido");

        // inclui a quantidade e atribui um id
        produto.quantidade = obj.quantidade;
        produto.id_item = new ObjectId();

        // incluindo o produto na mesa
        await mongodb.updateOne('freeddb', 'mesa',
            { _id: new ObjectId(obj.id_mesa), id_restaurante: req.token.id_restaurante },
            { $push: { produtos: produto } }
        );

        // enviando dados aos sockets
        //enviarDadosSockets(req.token.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.removerItem = async (req, res) => {
    try {

        let obj = {
            id_mesa: req.body.id_mesa,
            id_item: req.body.id_item,
        }

        let errors = model.validarRemoverItem(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        await mongodb.updateOne('freeddb', 'mesa',
            {
                _id: new ObjectId(obj.id_mesa),
                id_restaurante: req.token.id_restaurante
            },
            {
                $set: {
                    'produtos.$[item].removido': true
                }
            },
            {
                arrayFilters: [{ 'item.id_item': new ObjectId(obj.id_item) }]
            }
        );

        //enviarDadosSockets(req.token.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.editarDesconto = async (req, res) => {
    try {

        let obj = {
            id_mesa: req.body.id_mesa,
            desconto: req.body.desconto,
        }

        let errors = model.validarDesconto(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        await mongodb.updateOne('freeddb', 'mesa',
            {
                _id: new ObjectId(obj.id_mesa),
                id_restaurante: req.token.id_restaurante
            },
            {
                $set: {
                    desconto: obj.desconto,
                }
            }
        );

        //enviarDadosSockets(req.token.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.editarTaxaServico = async (req, res) => {
    try {

        let obj = {
            id_mesa: req.body.id_mesa,
            taxa_servico: req.body.taxa_servico,
        }

        let errors = model.validarTaxaServico(obj);
        if (errors)
            return res.status(400).send(errors[0]);

        await mongodb.updateOne('freeddb', 'mesa',
            {
                _id: new ObjectId(obj.id_mesa),
                id_restaurante: req.token.id_restaurante
            },
            {
                $set: {
                    taxa_servico: obj.taxa_servico,
                }
            }
        );

        //enviarDadosSockets(req.token.id_restaurante);

        return res.json('OK');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

enviarDadosSockets = async (id_restaurante) => {
    let data = await mongodb.find('freeddb', 'mesa', {
        id_restaurante: req.token.id_restaurante,
        aberta: true
    });
    emitTo("atualizacao", data, id_restaurante);
}