const validatejs = require('validate.js');

let constraints = {
    ds_menu: {
        type: "string",
        presence: true,
        length: {
            minimum: 3,
            maximum: 150,
        },
    },
}

module.exports.validar = obj => validatejs.validate(obj, constraints, { format: "flat" });

