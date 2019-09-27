const validatejs = require('validate.js');

let constraints_cadastrar = {
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
        type: "number",
        presence: true,
    },
    id_menu: {
        type: 'integer',
        presence: true,
    },
    visivel: {
        type: 'integer',
        presence: true,
        numericality:{
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    },
    promocao: {
        type: 'integer',
        presence: true,
        numericality:{
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
        type: "number",
        presence: true,
    },
    id_menu: {
        type: 'integer',
        presence: true,
    },
    visivel: {
        type: 'integer',
        presence: true,
        numericality:{
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    },
    promocao: {
        type: 'integer',
        presence: true,
        numericality:{
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    },
    imagem: {
        type: "string",
        presence: true,
    },
    ativo:{
        type: 'integer',
        presence: true,
        numericality:{
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    }
}

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraints_cadastrar, { format: "flat" });
module.exports.validarEditar = obj => validatejs.validate(obj, constraints_editar, { format: "flat" });
