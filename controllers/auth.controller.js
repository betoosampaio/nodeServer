const crypto = require('../utils/crypto.util');
const mariadb = require('../utils/mariadb.util');
const model = require('../models/credenciais.model');
const mongodb = require('../utils/mongodb.util');

module.exports.login = async (req, res) => {
    try {
        let obj = req.body;

        let errors = model.validar(obj);
        if (errors) {
            mongodb.insertOne('logdb', 'failed_login_attempts', { ip: req.ip, createdAt: new Date() });
            return res.status(401).send('Credenciais invalidas');
        }

        let tentativasFalhas = await mongodb.find('logdb', 'failed_login_attempts', { ip: req.ip });
        if (tentativasFalhas.length >= 3)
            return res.status(429).send('Muitas tentativas inválidas, favor tentar novamente mais tarde');

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

        let data = await mariadb.query(query, [obj.codigo_restaurante, obj.login_operador, obj.senha_operador]);

        if (data.length == 0) {
            mongodb.insertOne('logdb', 'failed_login_attempts', { ip: req.ip, createdAt: new Date() });
            return res.status(401).send('Login e/ou senha incorreto');
        }


        let token = data[0];
        token.expire = (new Date()).setHours((new Date()).getHours() + 6);
        let tokenCript = crypto.encrypt(JSON.stringify(token));
        return res.json(tokenCript);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}