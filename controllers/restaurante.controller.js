const database = require('../config/database.config')

module.exports.checarSeCodigoExiste = async (req, res) => {
    try {
        let exists = await _checarSeCodigoExiste(req.body.codigo_restaurante)
        res.json({ exists: exists });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}

module.exports.checarSeCNPJExiste = async (req, res) => {
    try {
        let exists = await _checarSeCNPJExiste(req.body.cnpj)
        res.json({ exists: exists });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}

module.exports.cadastrar = async (req, res) => {
    try {
        let obj = req.body;

        // campos numéricos
        obj.cnpj = Number.isInteger(obj.cnpj) ? obj.cnpj : obj.cnpj.replace(/\D/g, '');
        obj.cep = Number.isInteger(obj.cep) ? obj.cep : obj.cep.replace(/\D/g, '');
        obj.numero = Number.isInteger(obj.numero) ? obj.numero : obj.numero.replace(/\D/g, '');
        obj.celular = Number.isInteger(obj.celular) ? obj.celular : obj.celular.replace(/\D/g, '');
        obj.codigo_banco = Number.isInteger(obj.codigo_banco) ? obj.codigo_banco : obj.codigo_banco.replace(/\D/g, '');
        obj.id_tipo_cadastro_conta = Number.isInteger(obj.id_tipo_cadastro_conta) ? obj.id_tipo_cadastro_conta : obj.id_tipo_cadastro_conta.replace(/\D/g, '');
        obj.id_tipo_conta = Number.isInteger(obj.id_tipo_conta) ? obj.id_tipo_conta : obj.id_tipo_conta.replace(/\D/g, '');
        obj.agencia = Number.isInteger(obj.agencia) ? obj.agencia : obj.agencia.replace(/\D/g, '');
        obj.conta = Number.isInteger(obj.conta) ? obj.conta : obj.conta.replace(/\D/g, '');
        obj.cpf_administrador = Number.isInteger(obj.cpf_administrador) ? obj.cpf_administrador : obj.cpf_administrador.replace(/\D/g, '');

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
        else if (!obj.codigo_restaurante)
            throw new Error('Campo código do restaurante não preenchido')
        else if (!obj.login)
            throw new Error('Campo login não preenchido')
        else if (!obj.senha)
            throw new Error('Campo senha não preenchido')

        // ## DEMAIS VALIDAÇÕES ##
        if (!_validarCNPJ(obj.cnpj))
            throw new Error('CNPJ inválido');

        let cnpjExists = await _checarSeCNPJExiste(obj.cnpj);
        if (cnpjExists) {
            throw new Error('CNPJ já cadastrado');
        }

        if (obj.cep.replace(/\D/g, '').length != 8) {
            throw new Error('CEP inválido');
        }

        if (!_validarEmail(obj.email)) {
            throw new Error('E-mail inválido');
        }

        if (obj.codigo_restaurante.length < 6) {
            throw new Error('Codigo do restaurante deve ter no mínimo 6 caracteres');
        }

        let loginExists = await _checarSeCodigoExiste(obj.codigo_restaurante);
        if (loginExists) {
            throw new Error('Codigo de restaurante já está sendo utilizado');
        }

        if (!_validarCPF(obj.cpf_administrador))
            throw new Error('CPF inválido');

        if (obj.celular.replace(/\D/g, '').length != 11) {
            throw new Error('Celular inválido');
        }

        if (obj.login.length < 4) {
            throw new Error('Login deve ter no mínimo 4 caracteres');
        }

        if (obj.senha.length < 8) {
            throw new Error('Senha deve connter no mínimo 8 caracteres');
        }

        if (!(/^(?=.*[a-zA-Z])(?=.*[0-9])/).test(obj.senha)) {
            throw new Error('Senha deve conter ao menos 1 letra e 1 número');
        }

        // ## INSERE RESTAURANTE ##
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
            codigo_restaurante)
            values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);

            select * from tb_restaurante where id_restaurante = LAST_INSERT_ID();
            `;

        let data = await database.mquery(query, [
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
            obj.codigo_restaurante
        ]);

        let id_restaurante = data[1][0].id_restaurante;

        // ## INSERE LOGIN ADM ##
        query = 'insert into tb_operador(nome_operador,id_restaurante,id_perfil,login_operador,senha_operador) values (?,?,1,?,?)';
        await database.mquery(query, [obj.nome_administrador, id_restaurante, obj.login, obj.senha]);

        res.json('OK');

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.obter = async (req, res) => {
    try {
        let query = `select * from tb_restaurante where id_restaurante = ?`;
        let data = await database.query(query, [req.token.id_restaurante]);
        res.json(data);

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.editar = async (req, res) => {
    try {
        let obj = req.body;
      
        // ## ATUALIZA RESTAURANTE ##
        let query = `
        update tb_restaurante
        set
             cnpj = ?
            ,nome_fantasia = ?
            ,cep = ?
            ,logradouro = ?
            ,numero = ?
            ,bairro = ?
            ,municipio = ?
            ,uf = ?
            ,complemento = ?
            ,celular = ?
            ,email = ?
            ,codigo_banco = ?
            ,id_tipo_cadastro_conta = ?
            ,id_tipo_conta = ?
            ,agencia = ?
            ,conta = ?
            ,digito = ?
            ,cpf_administrador = ?
            ,nome_administrador = ?
            ,codigo_restaurante = ?
        where
            id_restaurante = ?;`;

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
            obj.codigo_restaurante,
            req.token.id_restaurante
        ]);

        res.json('OK');

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.inativar = async (req, res) => {
    try {
        let obj = req.body;
      
        // ## ATUALIZA RESTAURANTE ##
        let query = `
        update tb_restaurante
        set
            ativo = 0
        where
            id_restaurante = ?;`;

        await database.query(query, [req.token.id_restaurante]);

        res.json('OK');

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.reativar = async (req, res) => {
    try {
        let obj = req.body;
      
        // ## ATUALIZA RESTAURANTE ##
        let query = `
        update tb_restaurante
        set
            ativo = 1
        where
            id_restaurante = ?;`;

        await database.query(query, [req.token.id_restaurante]);

        res.json('OK');

    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.obterVariaveisCadastro = async (req, res) => {
    try {
        let query = `
        select * from tb_banco;
        select * from tb_municipio;
        select * from tb_estado;
        select * from tb_tipo_conta;
        select * from tb_tipo_cadastro_conta;
        `;
        let data = await database.mquery(query);
        res.json(data);

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
}


_checarSeCodigoExiste = async (codigo_restaurante) => {
    let data = await database.query("select 1 from tb_restaurante where codigo_restaurante = ?", codigo_restaurante);
    return data.length > 0 ? true : false;
}

_checarSeCNPJExiste = async (cnpj) => {
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