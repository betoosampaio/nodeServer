const validatejs = require('validate.js');

let constraintsIncluir = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
    id_forma_pagamento: {
        numericality: {
            onlyInteger: true,
            greaterThanOrEqualTo: 1,
            lessThanOrEqualTo: 4
        },
        presence: true,
    },
    valor: {
        type: "number",
        presence: true,
    }
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