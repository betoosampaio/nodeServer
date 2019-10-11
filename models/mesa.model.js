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
}

let constraintsRemover = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    }
}

let constraintsFechar = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
    desconto: {
        numericality: true,
        presence: true
    },
    taxa_servico: {
        numericality: true,
        presence: true
    },
}

let constraintsIncluirItem = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
    id_produto: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    quantidade: {
        numericality: {
            onlyInteger: true,
            greaterThanOrEqualTo: 1,
        },
        presence: true,
    }
}

let constraintsRemoverItem = {
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

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraintsCadastrar, { format: "flat" });
module.exports.validarRemover = obj => validatejs.validate(obj, constraintsRemover, { format: "flat" });
module.exports.validarFechar = obj => validatejs.validate(obj, constraintsFechar, { format: "flat" });
module.exports.validarIncluirItem = obj => validatejs.validate(obj, constraintsIncluirItem, { format: "flat" });
module.exports.validarRemoverItem = obj => validatejs.validate(obj, constraintsRemoverItem, { format: "flat" });