const validatejs = require('validate.js');

let constraints_cadastrar = {
    codigo_produto: {
        type: "string",
        presence: true,
        length: {
            minimum: 1,
            maximum: 50,
        },
    },
    nome_produto: {
        type: "string",
        presence: true,
        length: {
            minimum: 3,
            maximum: 150,
        },
    },
    descricao: {
        type: "string",
        presence: true,
    },
    preco: {
        numericality: true,
        presence: true,
    },
    id_menu: {
        numericality:{
            onlyInteger: true,
        },
        presence: true,
    },
    visivel: {
        presence: true,
        numericality:{
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    },
    promocao: {
        presence: true,
        numericality:{
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    },
    imagem: {
        type: "string",
        presence: true,
    },
}

let constraints_editar = {
    codigo_produto: {
        type: "string",
        presence: true,
        length: {
            minimum: 1,
            maximum: 50,
        },
    },
    nome_produto: {
        type: "string",
        presence: true,
        length: {
            minimum: 3,
            maximum: 150,
        },
    },
    descricao: {
        type: "string",
        presence: true,
    },
    preco: {
        numericality: true,
        presence: true,
    },
    id_menu: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    visivel: {
        presence: true,
        numericality:{
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    },
    promocao: {
        presence: true,
        numericality:{
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    },
    imagem: {
        type: "string",
        presence: true,
    },
    ativo:{
        presence: true,
        numericality:{
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    }
}

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraints_cadastrar, { format: "flat" });
module.exports.validarEditar = obj => validatejs.validate(obj, constraints_editar, { format: "flat" });
