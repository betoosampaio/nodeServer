
const validatejs = require('validate.js');

let constraintsIncluir = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
    id_operador: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    produtos:{
        presence: true,
    },
}

let constraintsItem = {
    id_produto: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    quantidade: {
        type: "integer",
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
    id_item: {
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
module.exports.validarItem = obj => validatejs.validate(obj, constraintsItem, { format: "flat" });
module.exports.validarRemover = obj => validatejs.validate(obj, constraintsRemover, { format: "flat" });