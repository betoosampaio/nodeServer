const database = require('../config/database.config')

module.exports.selectAll = (req, res) => {
    try {
        let data = database.query("select * from tb_restaurante");
        res.json(data);
    } catch (error) {
        throw error;
    }
}



module.exports.insert = (req, res) => {
    try {

        let obj = req.body;

        /* Validações campos vazios. */
        if(obj.cnpj == ''){
            console.log('Falta CPNPJ a ser preenchidos.')
        }
        else if(obj.nome_fantasia == ''){
            console.log('Falta Nome Fantasia a ser preenchidos.')
        }
        else if(obj.cep == ''){
            console.log('Falta o Cep a ser preenchidos.')
        }
        else if(obj.logradouro == ''){
            console.log('Falta o Logradouro a ser preenchidos.')
        }
        else if(obj.numero == ''){
            console.log('Falta o Numero a ser preenchidos.')
        }
        else if(obj.bairro == ''){
            console.log('Falta o Bairro a ser preenchidos.')
        }
        else if(obj.municipio == ''){
            console.log('Falta o Municipio a ser preenchidos.')
        }
        else if(obj.uf == ''){
            console.log('Falta o uf a ser preenchidos.')
        }
        else if(obj.celular == ''){
            console.log('Falta o Celular a ser preenchidos.')
        }
        else if(obj.email == ''){
            console.log('Falta o Email a ser preenchidos.')
        }
        else if(obj.codigo_banco == ''){
            console.log('Falta o Banco a ser preenchidos.')
        }
        else if(obj.id_tipo_cadastro_conta == ''){
            console.log('Falta o tipo de cadastro a ser preenchidos.')
        }
        else if(obj.id_tipo_conta == ''){
            console.log('Falta o Tipo de cona a ser preenchidos.')
        }
        else if(obj.agencia == ''){
            console.log('Falta a Agencia a ser preenchidos.')
        }
        else if(obj.conta == ''){
            console.log('Falta a Conta a ser preenchidos.')
        }
        else if(obj.digito == ''){
            console.log('Falta o Digito a ser preenchidos.')
        }
        else if(obj.cpf_administrador == ''){
            console.log('Falta o Cpf do Administrador a ser preenchidos.')
        }
        else if(obj.nome_administrador == ''){
            console.log('Falta o Nome do Administrador a ser preenchidos.')
        }
        else if(obj.login == ''){
            console.log('Falta o Login a ser preenchidos.')
        }
        else if(obj.senha == ''){
            console.log('Falta a Senha a ser preenchidos.')
        }




else{
        obj.cnpj =  obj.cnpj.replace(/\D/g, '');
        obj.cep =  obj.cep.replace(/\D/g, '');
        obj.cpf_administrador =  obj.cpf_administrador.replace(/\D/g, '')
        obj.celular =  obj.celular.replace(/\D/g, '')

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
    }
        res.json('OK');
    } catch (error) {
        res.status(500).send(error.message);
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