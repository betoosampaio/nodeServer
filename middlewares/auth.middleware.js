
const crypto = require('../utils/crypto.util')

module.exports = (req, res, next) => {
    try {

        try {
            req.token = validarToken(req.headers.token)
        }
        catch (err) {
            return res.status(401).send(err.message);
        }

        next();
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports.socket = (socket, next) => {
    try {
        socket.token = validarToken(socket.request._query.token)
        next();
    }
    catch (error) {
        next(new Error(error));
    }
}

validarToken = (_token) => {

    if (!_token)
        throw new Error('token não fornecido');

    let token;

    try {
        let decrypted = crypto.decrypt(_token);
        token = JSON.parse(decrypted);
    } catch (error) {
        throw new Error('token inválido');
    }

    if (token.expire < new Date().getTime())
        throw new Error('token expirado');

    return token;
}