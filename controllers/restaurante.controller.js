const database = require('../config/database.config')

module.exports.selectAll = (req, res) => {
    try {
        let data = database.query("select * from TB_RESTAURANTE");
        res.json(data);
    } catch (error) {
        throw error;
    }
}

module.exports.insert = (req, res) => {
    try {
        let obj = req.body;
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

        database.query(query, [
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
        res.status(500).send(error.message);
    }
}

module.exports.update = (req, res) => {
    try {
        let query = "insert into TB_RESTAURANTE() values (?)";
        database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.delete = (req, res) => {
    try {
        let query = "update TB_RESTAURANTE set ativo = 0, data_exclusao = now() where id_restaurante = ?";
        database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}