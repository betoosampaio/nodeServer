
const crypto = require('../utils/crypto.util')

module.exports = (req, res, next) => {
    try {
        if (!req.headers.token)
            return res.status(401).send('token não fornecido');

        let token;

        try {
            let decrypted = crypto.decrypt(req.headers.token);
            token = JSON.parse(decrypted);
        } catch (error) {
            return res.status(401).send('token inválido');
        }

        if (token.expire < new Date().getTime())
            return res.status(401).send('token expirado');

        req.token = token;

        next();
    }
    catch (error) {
        return res.status(500).send(error.message);
    }

}