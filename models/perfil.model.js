const validatejs = require('validate.js');

let constraints_cadastrar = {
    ds_perfil: {
        type: "string",
        presence: true,
        length: {
            minimum: 3,
            maximum: 150,
        },
    },
}

let constraints_editar = {
    ds_perfil: {
        type: "string",
        presence: true,
        length: {
            minimum: 3,
            maximum: 150,
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

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraints_cadastrar, { format: "flat" });
module.exports.validarEditar = obj => validatejs.validate(obj, constraints_editar, { format: "flat" });


