const database = require('../config/database.config')


module.exports.listar = async (req, res) => {
    try {
        let query = `
        select 
             o.id_operador
            ,o.nome_operador
            ,o.id_perfil
            ,p.tipo_perfil
            ,o.login_operador
        from 
            tb_operador o
            inner join tb_perfil p
                on p.id_perfil = o.id_perfil
        where 
            id_restaurante = ?
            and ativo = 1`

        let data = await database.query(query, [req.token.id_restaurante]);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.cadastrar = async (req, res) => {
    try {
        let obj = req.body;
        let query = `
        insert into tb_operador(
             nome_operador
            ,id_restaurante
            ,id_perfil
            ,login_operador
            ,senha_operador
            )
        values(?,?,?,?,?)`

        let data = await database.query(query, [
             obj.nome_operador
            ,req.token.id_restaurante
            ,obj.id_perfil
            ,obj.login_operador
            ,obj.senha_operador
        ]);

        res.json("OK");
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.editar = async (req, res) => {
    try {
        let obj = req.body;
        let query = `
        update tb_operador
        set
               nome_operador = ?
              ,id_perfil = ?
              ,login_operador = ?
              ,senha_operador = ?
        where
            id_operador = ?
            and id_restaurante = ?`

        let data = await database.query(query, [
             obj.nome_operador            
            ,obj.id_perfil
            ,obj.login_operador
            ,obj.senha_operador
            ,obj.id_operador
            ,req.token.id_restaurante
        ]);

        res.json("OK");
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

module.exports.remover = async (req, res) => {
    try {
        let obj = req.body;
        let query = `
        update tb_operador
        set
            ativo = 0
        where
            id_operador = ?
            and id_restaurante = ?`

        let data = await database.query(query, [
             obj.id_operador
            ,req.token.id_restaurante
        ]);

        res.json("OK");
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
    }
}

