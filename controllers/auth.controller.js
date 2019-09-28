const crypto = require('../config/crypto.config')
const database = require('../config/database.config')
const model = require('../models/credenciais.model');

module.exports.login = async (req, res) => {
    try {
        let obj = req.body;

        let errors = model.validar(obj);
        if (errors)
            throw new Error('Credenciais invalidas');

        let query = (`
SELECT
	 r.id_restaurante
	,o.id_operador
FROM
	tb_restaurante r
	INNER JOIN tb_operador o
		ON o.id_restaurante = r.id_restaurante
WHERE
	r.codigo_restaurante = ?
	AND o.login_operador = ?
	AND o.senha_operador = ?
        `);

        let data = await database.query(query, [obj.codigo_restaurante, obj.login_operador, obj.senha_operador]);

        if (data.length == 0)
            throw new Error('Login e/ou senha incorreto');

        let token = data[0];
        token.expire = (new Date()).setHours((new Date()).getHours()+6);
        let tokenCript = crypto.encrypt(JSON.stringify(token));
        res.json(tokenCript);
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
}