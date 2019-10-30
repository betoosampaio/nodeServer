module.exports = (app) => {

    /* MIDDLEWARES */
    const logMW = require('./middlewares/log.middleware');
    const authMW = require('./middlewares/auth.middleware');
    const uploadimgMW = require("./middlewares/multer.uploadimg.middleware").upload;
    app.use(logMW);

    /* CONTROLLERS */
    const restaurante = require('./controllers/restaurante.controller');
    const auth = require('./controllers/auth.controller');
    const produto = require('./controllers/produto.controller');
    const operador = require('./controllers/operador.controller');
    const menu = require('./controllers/menu.controller');
    const mesa = require('./controllers/mesa.controller');

    app.get('/', (req, res) => { res.json("Server Online") });
    app.post('/login', auth.login);
    app.post('/validarToken', auth.validarToken);

    /* RESTAURANTE */
    app.post('/restaurante/checarSeCodigoExiste', restaurante.checarSeCodigoExiste);
    app.post('/restaurante/checarSeCNPJExiste', restaurante.checarSeCNPJExiste);
    app.post('/restaurante/cadastrar', restaurante.cadastrar);
    app.post('/restaurante/obter', [authMW], restaurante.obter);
    app.post('/restaurante/editar/dadosRestaurante', [authMW], restaurante.editarDadosRestaurante);
    app.post('/restaurante/editar/dadosBancarios', [authMW], restaurante.editarDadosBancarios);
    app.post('/restaurante/editar/dadosPessoais', [authMW], restaurante.editarDadosPessoais);
    app.post('/restaurante/inativar', [authMW], restaurante.inativar);
    app.post('/restaurante/reativar', [authMW], restaurante.reativar);

    /* VARIAVEIS CADASTRO */
    app.post('/obterBancos', restaurante.obterBancos);
    app.post('/obterMunicipios', restaurante.obterMunicipios);
    app.post('/obterEspecialidades', restaurante.obterEspecialidades);

    /* OPERADOR */
    app.post('/perfil/listar', [authMW], operador.listarPerfis);
    app.post('/operador/listar', [authMW], operador.listar);
    app.post('/operador/obter', [authMW], operador.obter);
    app.post('/operador/cadastrar', [authMW], operador.cadastrar);
    app.post('/operador/editar', [authMW], operador.editar);
    app.post('/operador/remover', [authMW], operador.remover);
    app.post('/operador/checarSeLoginExiste', [authMW], operador.checarSeLoginExiste);

    /* MENU */
    app.post('/menu/checarSeMenuExiste', [authMW], menu.checarSeMenuExiste);
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
    app.post('/produto/uploadimg', [authMW, uploadimgMW], produto.uploadimg)
    app.post('/produto/checarSeCodigoProdutoExiste', [authMW], produto.checarSeCodigoProdutoExiste);
    app.post('/produto/obterProximoCodigoProduto', [authMW], produto.obterProximoCodigoProduto);

    /* MESA */
    app.post('/mesa/listar', [authMW], mesa.listar);
    app.post('/mesa/obter', [authMW], mesa.obter);
    app.post('/mesa/cadastrar', [authMW], mesa.cadastrar);
    app.post('/mesa/remover', [authMW], mesa.remover);
    app.post('/mesa/fechar', [authMW], mesa.fechar);
    app.post('/mesa/incluirItem', [authMW], mesa.incluirItem);
    app.post('/mesa/removerItem', [authMW], mesa.removerItem);

}