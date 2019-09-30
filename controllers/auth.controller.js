const crypto = require('../utils/crypto.util');
const mariadb = require('../utils/mariadb.util');
const model = require('../models/credenciais.model');
const mongodb = require('../utils/mongodb.util');

let MongClientoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

module.exports.login = async (req, res) => {
    try {
        let obj = req.body;

        let errors = model.validar(obj);
        if (errors)
            throw new Error('Credenciais invalidas');

            

        let tentativasFalhas = await mongodb.find('logdb', 'failed_login_attempts', {ip: req.ip});
        if(tentativasFalhas.length >= 3)
            throw new Error('Muitas tentativas inválidas, favor tentar novamente mais tarde')    

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

        if (data.length == 0)
            throw new Error('Login e/ou senha incorreto');

        let token = data[0];
        token.expire = (new Date()).setHours((new Date()).getHours() + 6);
        let tokenCript = crypto.encrypt(JSON.stringify(token));
        res.json(tokenCript);
    } catch (error) {
        mongodb.insertOne('logdb', 'failed_login_attempts', { ip: req.ip, createdAt: new Date() });
        res.status(400).send({ msg: error.message });
    }
}