const validatejs = require('validate.js');

let constraintsCadastrar = {
    numero: {
        type: "string",
        presence: true,
        length: {
            minimum: 1,
            maximum: 10
        }
    },
}

let constraintsIncluirProduto = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 }
    },
    id_produto: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    quantidade:{
        numericality: {
            onlyInteger: true,
            greaterThanOrEqualTo: 1,
        },
        presence: true,
    }
}

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraintsCadastrar, { format: "flat" });
module.exports.validarIncluirProduto = obj => validatejs.validate(obj, constraintsIncluirProduto, { format: "flat" });