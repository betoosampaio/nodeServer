
const crypto = require('../config/crypto.config')

module.exports = (req, res, next) => {
    try {
        if (!req.headers.token)
            throw new Error('token não fornecido');

        let token;

        try {
            let decrypted = crypto.decrypt(req.headers.token);
            token = JSON.parse(decrypted);
        } catch (error) {
            throw new Error('token inválido');
        }

        if (token.expire < new Date().getTime())
            throw new Error('token expirado');

        req.token = token;

        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).send({ msg: error.message });
    }

}