const database = require('../config/database.config')

module.exports.selectAll = (req, res) => {
    try {
        let data = database.query("select * from tb_operador");
        res.json(data);
    } catch (error) {
        throw error;
    }
}



module.exports.insert = (req, res) => {
    try {

        let obj = req.body;

        /* Validação dos campos vazios */
        if(obj.nome_Operador == ''){
            console.log('Falta o Nome do Operador a ser preenchidos.')
        }
       else if(obj.perfil == ''){
            console.log('Falta o perfil a ser preenchidos.')
        }
        else if(obj.login_Operador == ''){
            console.log('Falta o Login Operador a ser preenchidos.')
        }
        else if(obj.senha_Operador == ''){
            console.log('Falta o Senha Operador a ser preenchidos.')
        }

        else{
              console.log(obj);
        let query = `insert into tb_operador(
            nome_Operador,
            perfil,
            login_Operador,
            senha_Operador)
            values (?,?,?,?)`;


        database.query(query, [
            obj.nome_Operador,
            obj.perfil,
            obj.login_Operador,
            obj.senha_Operador,
        ]);
    }
        res.json('OK');
    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports.update = (req, res) => {
    try {
        let query = "insert into tb_operador() values (?)";
        database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}

module.exports.delete = (req, res) => {
    try {
        let query = "update tb_operador set ativo = 0, data_exclusao = now() where id_restaurante = ?";
        database.query(query, [req.body.id_restaurante]);
        res.json('OK');
    } catch (error) {
        throw error;
    }
}
