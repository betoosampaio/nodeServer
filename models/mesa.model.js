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

let constraintsIdMesa = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    }
}

let constraintsDesconto = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
    desconto: {
        type: "number",
        presence: true
    },
}

let constraintsTaxaServico = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        letrasNumeros: true,
    },
    taxa_servico: {
        type: "number",
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
        type: "integer",
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
module.exports.validarIdMesa = obj => validatejs.validate(obj, constraintsIdMesa, { format: "flat" });
module.exports.validarDesconto = obj => validatejs.validate(obj, constraintsDesconto, { format: "flat" });
module.exports.validarTaxaServico = obj => validatejs.validate(obj, constraintsTaxaServico, { format: "flat" });
module.exports.validarIncluirItem = obj => validatejs.validate(obj, constraintsIncluirItem, { format: "flat" });
module.exports.validarRemoverItem = obj => validatejs.validate(obj, constraintsRemoverItem, { format: "flat" });