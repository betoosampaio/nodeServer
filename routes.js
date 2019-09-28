

module.exports = (app) => {

    const logMW = require('./middlewares/log.middleware');
    app.use(logMW);

    const authMW = require('./middlewares/auth.middleware');

    const restaurante = require('./controllers/restaurante.controller');
    const auth = require('./controllers/auth.controller');
    const produto = require('./controllers/produto.controller');
    const operador = require('./controllers/operador.controller');
    const menu = require('./controllers/menu.controller');

    app.get('/', (req, res) => { res.json("Server Online") });
    app.post('/login', auth.login);

    /* RESTAURANTE */
    app.post('/restaurante/obterVariaveisCadastro', restaurante.obterVariaveisCadastro);
    app.post('/restaurante/checarSeCodigoExiste', restaurante.checarSeCodigoExiste);
    app.post('/restaurante/checarSeCNPJExiste', restaurante.checarSeCNPJExiste);
    app.post('/restaurante/cadastrar', restaurante.cadastrar);
    app.post('/restaurante/obter', [authMW], restaurante.obter);
    app.post('/restaurante/editar', [authMW], restaurante.editar);
    app.post('/restaurante/inativar', [authMW], restaurante.inativar);
    app.post('/restaurante/reativar', [authMW], restaurante.reativar);

    /* OPERADOR */
    app.post('/perfil/listar', operador.listarPerfis);
    app.post('/operador/listar', [authMW], operador.listar);
    app.post('/operador/obter', [authMW], operador.obter);
    app.post('/operador/cadastrar', [authMW], operador.cadastrar);
    app.post('/operador/editar', [authMW], operador.editar);
    app.post('/operador/remover', [authMW], operador.remover);

    /* MENU */
    app.post('/menu/listar', [authMW], menu.listar);
    app.post('/menu/obter', [authMW], menu.obter);
    app.post('/menu/cadastrar', [authMW], menu.cadastrar);
    app.post('/menu/editar', [authMW], menu.editar);
    app.post('/menu/remover', [authMW], menu.remover);

    /* PRODUTO */
    app.post('/produto/listar', [authMW], produto.listar);
    app.post('/produto/obter', [authMW], produto.obter);
    app.post('/produto/cadastrar', [authMW], produto.cadastrar);
    app.post('/produto/editar', [authMW], produto.editar);
    app.post('/produto/remover', [authMW], produto.remover);
}