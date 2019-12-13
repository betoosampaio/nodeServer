
const crypto = require('../utils/crypto.util')
const permissaoCtrl = require('../controllers/permissao.controller');

module.exports = async (req, res, next) => {
    try {

        try {
            req.token = validarToken(req.headers.token)

            // verificar permissao ao metodo (exceto do proprio menu)
            if(req.originalUrl !== "/permissao/listarMenu"){
                let permissao = await permissaoCtrl.temPermissaoMetodo(req.originalUrl, req.token.id_restaurante, req.token.id_perfil);
                if(!permissao) return res.status(403).send("Seu perfil de acesso não tem permissão a este recurso. Contate o administrador do sistema.");
            }            
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

module.exports.validarToken = token =>{
    return validarToken(token);
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

