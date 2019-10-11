const validatejs = require('validate.js');
const letrasNumeros = /[^A-Za-z0-9]+/

let constraintsCadastrar = {
    numero: {
        type: "string",
        presence: true,
        length: {
            minimum: 1,
            maximum: 10
        },
        regex: {
            pattern: /[^A-Za-z0-9]+/g,
            message: "deve conter letras e números"
        },
    },
}

let constraintsRemover = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        regex: {
            pattern: letrasNumeros,
            message: "deve conter letras e números"
        },
    }
}

let constraintsFechar = {
    id_mesa: {
        type: "string",
        presence: true,
        length: { is: 24 },
        regex: {
            pattern: letrasNumeros,
            message: "deve conter letras e números"
        },
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
        regex: {
            pattern: letrasNumeros,
            message: "deve conter letras e números"
        },
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
        regex: {
            pattern: letrasNumeros,
            message: "deve conter letras e números"
        },
    },
    id_item: {
        type: "string",
        presence: true,
        length: { is: 24 },
        regex: {
            pattern: letrasNumeros,
            message: "deve conter letras e números"
        },
    },
}

validatejs.validators.regex = function (value, options, key, attributes) {
    var regexp = new RegExp(options.pattern);
    if (regexp.test(value))
        return options.message; 
};

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraintsCadastrar, { format: "flat" });
module.exports.validarRemover = obj => validatejs.validate(obj, constraintsRemover, { format: "flat" });
module.exports.validarFechar = obj => validatejs.validate(obj, constraintsFechar, { format: "flat" });
module.exports.validarIncluirItem = obj => validatejs.validate(obj, constraintsIncluirItem, { format: "flat" });
module.exports.validarRemoverItem = obj => validatejs.validate(obj, constraintsRemoverItem, { format: "flat" });