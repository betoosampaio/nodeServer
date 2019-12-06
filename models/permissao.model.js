const validatejs = require('validate.js');

let constraintsPagina = {
    id_perfil: {
        numericality: {
            onlyInteger: true,
        }, 
        presence: true
    },
    id_pagina: {
        numericality: {
            onlyInteger: true,
        }, 
        presence: true
    },
}

let constraintsMetodo = {
    id_perfil: {
        numericality: {
            onlyInteger: true,
        }, 
        presence: true
    },
    id_metodo: {
        numericality: {
            onlyInteger: true,
        }, 
        presence: true
    },
}


module.exports.validarPagina = obj => validatejs.validate(obj, constraintsPagina, { format: "flat" });
module.exports.validarMetodo = obj => validatejs.validate(obj, constraintsMetodo, { format: "flat" });