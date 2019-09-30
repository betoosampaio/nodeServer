const crypto = require('../utils/crypto.util');
const mariadb = require('../utils/mariadb.util');
const model = require('../models/credenciais.model');
const MongoClient = require('mongodb').MongoClient;

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

        let tentativasFalhas = await _checarTentativasFalhas(req.ip);
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
        _inserirTentativaFalha(req.ip);
        res.status(400).send({ msg: error.message });
    }
}

_checarTentativasFalhas = async (ip) => {

    console.log('inicio' + new Date().getTime());
    let client = await MongoClient.connect(process.env.MONGODB_LOG, MongClientoOptions);
    console.log('client' + new Date().getTime());
    let collection = client.db('logdb').collection('failed_login_attempts');
    let res = await collection.find({ ip: ip }).toArray();
    console.log('find' + new Date().getTime());
    client.close(); 
    return res;
}

_inserirTentativaFalha = (ip) => {   
    MongoClient.connect(process.env.MONGODB_LOG, MongClientoOptions, function (err, client) {
        if (err) throw err;
        let collection = client.db('logdb').collection('failed_login_attempts');
        collection.insertOne({ ip: ip, createdAt: new Date() }, function (err, dbs) {
            if (err) throw err;
            client.close();
        });
    });
}