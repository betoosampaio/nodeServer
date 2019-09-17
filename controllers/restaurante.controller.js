const database = require('../config/database.config')

module.exports.selectAll = async (req, res) => {
    try {
        let data = await database.query("select * from tb_restaurante");
        console.log(data);
        res.json(data);

    } catch (error) {
        throw error;
    }
}

module.exports.insert = async (req, res) => {
    try {

        let obj = req.body;

        /* Validações campos vazios. */
        if (obj.cnpj == '')
            throw new Error('Falta CPNPJ a ser preenchidos.')
        else if (obj.nome_fantasia == '')
            throw new Error('Falta Nome Fantasia a ser preenchidos.')
        else if (obj.cep == '')
            throw new Error('Falta o Cep a ser preenchidos.')
        else if (obj.logradouro == '')
            throw new Error('Falta o Logradouro a ser preenchidos.')
        else if (obj.numero == '')
            throw new Error('Falta o Numero a ser preenchidos.')
        else if (obj.bairro == '')
            throw new Error('Falta o Bairro a ser preenchidos.')
        else if (obj.municipio == '')
            throw new Error('Falta o Municipio a ser preenchidos.')
        else if (obj.uf == '')
            throw new Error('Falta o uf a ser preenchidos.')
        else if (obj.celular == '')
            throw new Error('Falta o Celular a ser preenchidos.')
        else if (obj.email == '')
            throw new Error('Falta o Email a ser preenchidos.')
        else if (obj.codigo_banco == '')
            throw new Error('Falta o Banco a ser preenchidos.')
        else if (obj.id_tipo_cadastro_conta == '')
            throw new Error('Falta o tipo de cadastro a ser preenchidos.')
        else if (obj.id_tipo_conta == '')
            throw new Error('Falta o Tipo de cona a ser preenchidos.')
        else if (obj.agencia == '')
            throw new Error('Falta a Agencia a ser preenchidos.')
        else if (obj.conta == '')
            throw new Error('Falta a Conta a ser preenchidos.')
        else if (obj.digito == '')
            throw new Error('Falta o Digito a ser preenchidos.')
        else if (obj.cpf_administrador == '')
            throw new Error('Falta o Cpf do Administrador a ser preenchidos.')
        else if (obj.nome_administrador == '')
            throw new Error('Falta o Nome do Administrador a ser preenchidos.')
        else if (obj.login == '')
            throw new Error('Falta o Login a ser preenchidos.')
        else if (obj.senha == '')
            throw new Error('Falta a Senha a ser preenchidos.')


        obj.cnpj = obj.cnpj.replace(/\D/g, '');
        obj.cep = obj.cep.replace(/\D/g, '');
        obj.cpf_administrador = obj.cpf_administrador.replace(/\D/g, '')
        obj.celular = obj.celular.replace(/\D/g, '')

        console.log(obj);
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


module.exports.update = (req, res) => {
    try {
        let query = "insert into tb_restaurante() values (?)";
        database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.delete = (req, res) => {
    try {
        let query = "update tb_restaurante set ativo = 0, data_exclusao = now() where id_restaurante = ?";
        database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}