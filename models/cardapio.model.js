const validatejs = require('validate.js');

let constraints = {
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
        type: "integer",
        presence: true,
    },
    visivel: {
        type: "boolean",
        presence: true,
    },
    promocao: {
        type: "boolean",
        presence: true,
    },
    imagem: {
        type: "string",
        presence: true,
    },
}

module.exports.validar = obj => validatejs.validate(obj, constraints, { format: "flat" });

