const validatejs = require('validate.js');

let constraints_cadastrar = {
    nome_operador: {
        type: "string",
        presence: true,
        length: {
            minimum: 4,
            maximum: 255,
        },
    },
    id_perfil: {
        numericality: {
            onlyInteger: true,
        }, 
        presence: true
    },
    login_operador: {
        type: "string",
        presence: true,
        length: {
            minimum: 4,
            maximum: 100,
        },
    },
    senha_operador: {
        type: "string",
        presence: true,
        length: {
            minimum: 8,
            maximum: 100,
        },
        letrasNumeros: true,
    },
}

let constraints_editar = {
    nome_operador: {
        type: "string",
        presence: true,
        length: {
            minimum: 4,
            maximum: 255,
        },
    },
    id_perfil: {
        numericality: {
            onlyInteger: true,
        }, 
        presence: true
    },
    login_operador: {
        type: "string",
        presence: true,
        length: {
            minimum: 4,
            maximum: 100,
        },
    },
    senha_operador: {
        type: "string",
        presence: true,
        length: {
            minimum: 8,
            maximum: 100,
        },
        letrasNumeros: true,
    },
    ativo:{
        presence: true,
        numericality:{
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    }
}

validatejs.validators.letrasNumeros = function (value, options, key, attributes) {
    var regexp = new RegExp(/[^A-Za-z0-9]+/);
    if (regexp.test(value))
        return "deve conter somente letras e números"; 
};

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraints_cadastrar, { format: "flat" });
module.exports.validarEditar = obj => validatejs.validate(obj, constraints_editar, { format: "flat" });

