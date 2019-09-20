const database = require('../config/database.config')



module.exports.checkIfLoginOk = async (req, res) => {
    try {
        let obj = req.body;
        let query = ("select id_restaurante from tb_restaurante where login = ? and senha = ?");

        let data = await database.query(query, [obj.login, obj.senha]);

        if (data.length == 0)
            throw new Error('Login e/ou senha incorreto');

        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}

module.exports.checkIfLoginExists = async (req, res) => {
    try {
        let exists = await _checkIfLoginExists(req.body.login)
        res.json({ exists: exists });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}

module.exports.checkIfCNPJExists = async (req, res) => {
    try {
        let exists = await _checkIfCNPJExists(req.body.cnpj)
        res.json({ exists: exists });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}

module.exports.selectAll = async (req, res) => {
    try {
        let data = await database.query("select * from tb_restaurante");
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}

module.exports.insert = async (req, res) => {
    try {

        let obj = req.body;

        //console.log(obj);
        // campos numéricos
        obj.cnpj = obj.cnpj.replace(/\D/g, '');
        obj.cep = obj.cep.replace(/\D/g, '');
        obj.numero = obj.numero.replace(/\D/g, '');
        obj.celular = obj.celular.replace(/\D/g, '');
        obj.codigo_banco = obj.codigo_banco.replace(/\D/g, '');
        obj.id_tipo_cadastro_conta = obj.id_tipo_cadastro_conta.replace(/\D/g, '');
        obj.id_tipo_conta = obj.id_tipo_conta.replace(/\D/g, '');
        obj.agencia = obj.agencia.replace(/\D/g, '');
        obj.conta = obj.conta.replace(/\D/g, '');
        obj.cpf_administrador = obj.cpf_administrador.replace(/\D/g, '');

        // ## Validações de campos não preenchidos ##
        if (!obj.cnpj)
            throw new Error('Campo CNPJ não preenchido')
        else if (!obj.nome_fantasia)
            throw new Error('Campo nome fantasia não preenchido')
        else if (!obj.cep)
            throw new Error('Campo CEP não preenchido')
        else if (!obj.logradouro)
            throw new Error('Campo logradouro não preenchido')
        else if (!obj.numero)
            throw new Error('Campo número do endereço não preenchido')
        else if (!obj.bairro)
            throw new Error('Campo bairro não preenchido')
        else if (!obj.municipio)
            throw new Error('Campo municipio não preenchido')
        else if (!obj.uf)
            throw new Error('Campo UF não preenchido')
        else if (!obj.celular)
            throw new Error('Campo celular não preenchido')
        else if (!obj.email)
            throw new Error('Campo email não preenchido')
        else if (!obj.codigo_banco)
            throw new Error('Campo banco não preenchido')
        else if (!obj.id_tipo_cadastro_conta)
            throw new Error('Campo tipo de cadastro de conta bancária não preenchido')
        else if (!obj.id_tipo_conta)
            throw new Error('Campo tipo de conta bancária não preenchido')
        else if (!obj.agencia)
            throw new Error('Campo agencia bancária não preenchido')
        else if (!obj.conta)
            throw new Error('Campo conta bancária não preenchido')
        else if (!obj.digito)
            throw new Error('Campo dígito da conta bancária não preenchido')
        else if (!obj.cpf_administrador)
            throw new Error('Campo CPF do administrador não preenchido')
        else if (!obj.nome_administrador)
            throw new Error('Campo nome do administrador não preenchido')
        else if (!obj.login)
            throw new Error('Campo login não preenchido')
        else if (!obj.senha)
            throw new Error('Campo senha não preenchido')

        // ## DEMAIS VALIDAÇÕES ##
        if (!_validarCNPJ(obj.cnpj))
            throw new Error('CNPJ inválido');

        let cnpjExists = await _checkIfCNPJExists(obj.cnpj);
        if (cnpjExists) {
            throw new Error('CNPJ já cadastrado');
        }

        if (obj.cep.replace(/\D/g, '').length != 8) {
            throw new Error('CEP inválido');
        }

        if (!_validarEmail(obj.email)) {
            throw new Error('E-mail inválido');
        }

        if (obj.login.length < 6) {
            throw new Error('Login deve ter no mínimo 6 caracteres');
        }

        let loginExists = await _checkIfLoginExists(obj.login);
        if (loginExists) {
            throw new Error('Login já está sendo utilizado');
        }

        if (!_validarCPF(obj.cpf_administrador))
            throw new Error('CPF inválido');

        if (obj.celular.replace(/\D/g, '').length != 11) {
            throw new Error('Celular inválido');
        }

        if (obj.senha.length < 8) {
            throw new Error('Senha deve connter no mínimo 8 caracteres');
        }

        if (!(/^(?=.*[a-zA-Z])(?=.*[0-9])/).test(obj.senha)) {
            throw new Error('Senha deve conter ao menos 1 letra e 1 número');
        }

        // ## QUERY ##
        let query = `insert into tb_restaurante(
            cnpj,
            nome_fantasia,
            cep,
            logradouro,
            numero,
            bairro,
            municipio,
            uf,
            complemento,
            celular,
            email,
            codigo_banco,
            id_tipo_cadastro_conta,
            id_tipo_conta,
            agencia,
            conta,
            digito,
            cpf_administrador,
            nome_administrador,
            login,
            senha)
            values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        await database.query(query, [
            obj.cnpj,
            obj.nome_fantasia,
            obj.cep,
            obj.logradouro,
            obj.numero,
            obj.bairro,
            obj.municipio,
            obj.uf,
            obj.complemento,
            obj.celular,
            obj.email,
            obj.codigo_banco,
            obj.id_tipo_cadastro_conta,
            obj.id_tipo_conta,
            obj.agencia,
            obj.conta,
            obj.digito,
            obj.cpf_administrador,
            obj.nome_administrador,
            obj.login,
            obj.senha,
        ]);

        res.json('OK');

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}

_checkIfLoginExists = async (login) => {
    let data = await database.query("select 1 from tb_restaurante where login = ?", login);
    return data.length > 0 ? true : false;
}

_checkIfCNPJExists = async (cnpj) => {
    let data = await database.query("select 1 from tb_restaurante where cnpj = ?", cnpj);
    return data.length > 0 ? true : false;
}

_validarCNPJ = (cnpj) => {
    if (cnpj == '') return false;

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

_validarCPF = (strCPF) => {
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

_validarEmail = (email) => {
    return (/.+@.+\..+/.test(email));
}