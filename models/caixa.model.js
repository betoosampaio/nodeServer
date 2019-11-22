const validatejs = require('validate.js');

let constraintsCadastrar = {
    numero: {
        type: "string",
        presence: true,
        length: {
            minimum: 1,
            maximum: 10
        },
        letrasNumeros: true,
    },
    id_operador: {
        numericality: {
            onlyInteger: true,
        },
    },
    saldo_inicial: {
        type: "number",
        presence: true,
    },
}

let constraintsIdCaixa = {
    id_caixa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
    id_operador: {
        numericality: {
            onlyInteger: true,
        },
    },
}

validatejs.validators.letrasNumeros = function (value, options, key, attributes) {
    var regexp = new RegExp(/[^A-Za-z0-9]+/);
    if (regexp.test(value))
        return "deve conter somente letras e números"; 
};

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraintsCadastrar, { format: "flat" });
module.exports.validarIdCaixa = obj => validatejs.validate(obj, constraintsIdCaixa, { format: "flat" });