const validatejs = require('validate.js');

let constraints_cadastrar = {
    codigo_restaurante: {
        presence: true,
        type: 'string',   
        length: {
            minimum: 4,
            maximum: 50
        }
    },
    cnpj: {
        presence: true,
        numericality: {
            onlyInteger: true,
        },     
        length: {
            is: 14
        },
        cnpj: true
    },
    nome_fantasia: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 255
        }
    },
    cep: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
        length: {
            is: 8
        }
    },
    logradouro: {
        type: 'string',
        presence: true,
        length: {
            minimum: 3,
            maximum: 255
        }
    },
    numero: {
        numericality: {
            onlyInteger: true,
        },
        presence: true
    },
    complemento: {
        type: 'string',
        presence: true
    },
    bairro: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 150
        }
    },
    municipio: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 150
        }
    },
    uf: {
        type: 'string',
        presence: true,
        length: {
            is: 2
        }
    },
    celular: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
        length: {
            is: 11
        }
    },
    email: {
        email: true,
        presence: true
    },
    id_tipo_cadastro_conta: {
        numericality: {
            onlyInteger: true,
        },
        presence: true
    },
    id_tipo_conta: {
        numericality: {
            onlyInteger: true,
        },
        presence: true
    },
    codigo_banco: {
        numericality: {
            onlyInteger: true,
        },
        presence: true
    },
    agencia: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
        length: {
            is: 4
        }
    },
    conta: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    digito: {
        type: 'string',
        presence: true,
        length: {
            is: 1
        }
    },
    nome_administrador: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 255,
        },
    },
    cpf_administrador: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
        length: {
            is: 11
        },
        cpf: true
    },
    login:{
        type: "string",
        presence: true,
        length: {
            minimum: 4,
            maximum: 100,
        },
    },
    senha:{
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
    }
}

let constraints_editar = {
    codigo_restaurante: {
        presence: true,
        type: 'string',   
        length: {
            minimum: 4,
            maximum: 50
        }
    },
    nome_fantasia: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 255
        }
    },
    cep: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
        length: {
            is: 8
        }
    },
    logradouro: {
        type: 'string',
        presence: true,
        length: {
            minimum: 3,
            maximum: 255
        }
    },
    numero: {
        numericality: {
            onlyInteger: true,
        },
        presence: true
    },
    complemento: {
        type: 'string',
        presence: true
    },
    bairro: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 150
        }
    },
    municipio: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 150
        }
    },
    uf: {
        type: 'string',
        presence: true,
        length: {
            is: 2
        }
    },
    celular: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
        length: {
            is: 11
        }
    },
    email: {
        email: true,
        presence: true
    },
    id_tipo_cadastro_conta: {
        numericality: {
            onlyInteger: true,
        },
        presence: true
    },
    id_tipo_conta: {
        numericality: {
            onlyInteger: true,
        },
        presence: true
    },
    codigo_banco: {
        numericality: {
            onlyInteger: true,
        },
        presence: true
    },
    agencia: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
        length: {
            is: 4
        }
    },
    conta: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    digito: {
        type: 'string',
        presence: true,
        length: {
            is: 1
        }
    },
    nome_administrador: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 255,
        },
    },
    cpf_administrador: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
        length: {
            is: 11
        },
        cpf: true
    },
}

validatejs.validators.cpf = function (value, options, key, attributes) {
    let message = 'invalido';
    let strCPF = value;

    if(!strCPF) return message;

    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF)
        if (strCPF == "00000000000") return message;

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return message;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return message;
};

validatejs.validators.cnpj = function (value, options, key, attributes) {
    let message = 'invalido';
    let cnpj = value;

    if (!cnpj) return message;

    if (cnpj.length != 14)
        return message;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return message;

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return message;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return message;
};

validatejs.validators.regex = function (value, options, key, attributes) {
    if (!(options.pattern).test(value))
        return options.message;
};

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraints_cadastrar, { format: "flat" });
module.exports.validarEditar = obj => validatejs.validate(obj, constraints_editar, { format: "flat" });

