const validatejs = require('validate.js');

let constraintsIncluir = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
    pagamentos:{
        presence: true,
    }
}

let constraintsPagamento = {
    id_forma_pagamento: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    valor: {
        type: "number",
        presence: true,
    },
    id_caixa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
}

let constraintsRemover = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
    id_pagamento: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
}

validatejs.validators.letrasNumeros = function (value, options, key, attributes) {
    var regexp = new RegExp(/[^A-Za-z0-9]+/);
    if (regexp.test(value))
        return "deve conter somente letras e números"; 
};

module.exports.validarIncluir = obj => validatejs.validate(obj, constraintsIncluir, { format: "flat" });
module.exports.validarRemover = obj => validatejs.validate(obj, constraintsRemover, { format: "flat" });
module.exports.validarPagamento = obj => validatejs.validate(obj, constraintsPagamento, { format: "flat" });