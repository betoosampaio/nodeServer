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
            greaterThanOrEqualTo: 1,
            lessThanOrEqualTo: 4
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
        regex: {
            pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
            message: "deve conter letras e números"
        },
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
            greaterThanOrEqualTo: 1,
            lessThanOrEqualTo: 4
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
        regex: {
            pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
            message: "deve conter letras e números"
        },
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

validatejs.validators.regex = function (value, options, key, attributes) {
    if (!(options.pattern).test(value))
        return options.message;
};

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraints_cadastrar, { format: "flat" });
module.exports.validarEditar = obj => validatejs.validate(obj, constraints_editar, { format: "flat" });

