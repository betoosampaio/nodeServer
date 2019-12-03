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
    razao_social: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 255
        }
    },
    nome_restaurante: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 255
        }
    },
    id_especialidade: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    id_tipo_atendimento: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
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
    pagamento_app: {
        presence: true,
        numericality: {
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    },
    id_tipo_cadastro_conta: {
        numericality: {
            onlyInteger: true,
        },
    },
    id_tipo_conta: {
        numericality: {
            onlyInteger: true,
        },
    },
    cpfcnpj_conta: {
        cpfcnpj: true
    },
    codigo_banco: {
        numericality: {
            onlyInteger: true,
        },
    },
    agencia: {
        numericality: {
            onlyInteger: true,
        },
        length: {
            maximum: 4,
        }
    },
    conta: {
        numericality: {
            onlyInteger: true,
            maximum: 9,
        },
    },
    digito: {
        type: 'string',
        length: {
            maximum: 2,
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
    login: {
        type: "string",
        presence: true,
        length: {
            minimum: 4,
            maximum: 100,
        },
    },
    senha: {
        type: "string",
        presence: true,
        length: {
            minimum: 8,
            maximum: 100,
        },
        letrasNumeros: true,
    },
    imagem: {
        type: "string",
        presence: true,
    },
}

let constraints_editarDadosRestaurante = {
    codigo_restaurante: {
        presence: true,
        type: 'string',
        length: {
            minimum: 4,
            maximum: 50
        }
    },
    imagem: {
        type: "string",
        presence: true,
    },
    razao_social: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 255
        }
    },
    nome_restaurante: {
        type: 'string',
        presence: true,
        length: {
            minimum: 4,
            maximum: 255
        }
    },
    id_especialidade: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
    },
    id_tipo_atendimento: {
        numericality: {
            onlyInteger: true,
        },
        presence: true,
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
    }

}

let constraints_editarDadosBancarios = {
    pagamento_app: {
        presence: true,
        numericality: {
            onlyInteger: true,
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        }
    },
    id_tipo_cadastro_conta: {
        numericality: {
            onlyInteger: true,
        },
    },
    id_tipo_conta: {
        numericality: {
            onlyInteger: true,
        },
    },
    codigo_banco: {
        numericality: {
            onlyInteger: true,
        },
    },
    agencia: {
        numericality: {
            onlyInteger: true,
        },
        length: {
            maximum: 4,
        }
    },
    conta: {
        numericality: {
            onlyInteger: true,
        },
        length: {
            maximum: 9,
        }
    },
    digito: {
        type: 'string',
        length: {
            maximum: 2,
        }
    },
    cpfcnpj_conta: {
        cpfcnpj: true
    },
}

let constraints_editarDadosPessoais = {
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

let constraints_editarConfiguracoes = {
    taxa_servico: {
        type: "number",
        presence: true,
        numericality: {
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 1
        },
    },
}

validatejs.validators.cpf = function (value, options, key, attributes) {
    if (!validarCPF(value))
        return 'inválido';
};

validatejs.validators.cnpj = function (value, options, key, attributes) {
    if (!validarCNPJ(value))
        return 'inválido';
};

validatejs.validators.cpfcnpj = function (value, options, key, attributes) {
    if (value) {
        if (value.length === 11) {
            if (!validarCPF(value))
                return 'inválido';
        }
        else if (value.length === 14) {
            if (!validarCNPJ(value))
                return 'inválido';
        }
        else return 'inválido';
    }
};

validatejs.validators.letrasNumeros = function (value, options, key, attributes) {
    var regexp = new RegExp(/[^A-Za-z0-9]+/);
    if (regexp.test(value))
        return "deve conter somente letras e números";
};

function validarCPF(_cpf) {
    if (!_cpf) return false;
    let strCPF = _cpf.toString();

    // Elimina CNPJs invalidos conhecidos
    if (strCPF == "00000000000" ||
        strCPF == "11111111111" ||
        strCPF == "22222222222" ||
        strCPF == "33333333333" ||
        strCPF == "44444444444" ||
        strCPF == "55555555555" ||
        strCPF == "66666666666" ||
        strCPF == "77777777777" ||
        strCPF == "88888888888" ||
        strCPF == "99999999999")
        return false;

    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF)
        if (strCPF == "00000000000") return false;

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;

    return true;
}

function validarCNPJ(_cnpj) {
    if (!_cnpj) return false;
    let cnpj = _cnpj.toString();

    if (cnpj.length != 14)
        return false;

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
        return false;

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
        return false;

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
        return false;

    return true;
}

module.exports.validarCadastrar = obj => validatejs.validate(obj, constraints_cadastrar, { format: "flat" });
module.exports.validarEditarDadosRestaurante = obj => validatejs.validate(obj, constraints_editarDadosRestaurante, { format: "flat" });
module.exports.validarEditarDadosBancarios = obj => validatejs.validate(obj, constraints_editarDadosBancarios, { format: "flat" });
module.exports.validarEditarDadosPessoais = obj => validatejs.validate(obj, constraints_editarDadosPessoais, { format: "flat" });
module.exports.validarEditarConfiguracoes = obj => validatejs.validate(obj, constraints_editarConfiguracoes, { format: "flat" });

