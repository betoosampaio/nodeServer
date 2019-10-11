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
        letrasNumeros: true,
    },
}

validatejs.validators.letrasNumeros = function (value, options, key, attributes) {
    var regexp = new RegExp(/[^A-Za-z0-9]+/);
    if (regexp.test(value))
        return "deve conter somente letras e números"; 
};

module.exports.validar = obj => validatejs.validate(obj, constraints, { format: "flat" });

