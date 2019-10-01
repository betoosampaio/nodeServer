const validatejs = require('validate.js');

let constraints = {
    codigo_restaurante: {
        presence: true,
        type: 'string',   
        length: {
            minimum: 4,
            maximum: 50
        }
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

validatejs.validators.regex = function (value, options, key, attributes) {
    if (!(options.pattern).test(value))
        return options.message;
};

module.exports.validar = obj => validatejs.validate(obj, constraints, { format: "flat" });
