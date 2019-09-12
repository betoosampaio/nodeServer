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
        let query = `insert into cadastro_restaurante(cnpj,
             nome_Fantasia,
             cep,
             rua,
             numero,
             bairro,
             cidade,
             Estado,
             complemento,
             celular,
             email,
             banco,
             tipo_Conta,
             agencia,
             conta,
             cpf,
             nome_Administrador,
             login_Restaurante,
             senha_Restaurante,
             ativo) 
             
             values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`;


        database.query(query, [
            obj.cnpj,
             obj.nome_Fantasia,
             obj.cep,
             obj.rua,
             obj.numero_endereco,
             obj.bairro,
             obj.cidade,
             obj.estado,
             obj.complemento,
             obj.celular,
             obj.email,
             obj.banco,
             obj.tipo_Conta,
             obj.agencia,
             obj.conta,
             obj.cpf,
             obj.nome_Administrador,
             obj.login_Restaurante,
             obj.senha
            ]);
        res.json('OK');
    } catch (error) {
        throw error;
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