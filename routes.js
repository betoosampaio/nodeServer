

module.exports = (app) => {

    const authMW = require('./middlewares/auth.middleware');

    const restaurante = require('./controllers/restaurante.controller');
    const auth = require('./controllers/auth.controller');
    const cardapio = require('./controllers/cardapio.controller');
    const operador = require('./controllers/operador.controller');
    const menu = require('./controllers/menu.controller');
    const tabelasVariaveis = require('./controllers/tabelasVariaveis.controller');

    app.get('/', (req, res) => { res.json("Server Online") });
    app.post('/login', auth.login);

    /* RESTAURANTE */
    app.post('/restaurante/checarSeCodigoExiste', restaurante.checarSeCodigoExiste);
    app.post('/restaurante/checarSeCNPJExiste', restaurante.checarSeCNPJExiste);
    app.post('/restaurante/cadastrar', restaurante.cadastrar);
    app.post('/restaurante/obter', [authMW], restaurante.obter);
    app.post('/restaurante/editar', [authMW], restaurante.editar);
    app.post('/restaurante/inativar', [authMW], restaurante.inativar);
    app.post('/restaurante/reativar', [authMW], restaurante.reativar);

    /* OPERADOR */
    app.post('/operador/listar', [authMW], operador.listar);
    app.post('/operador/cadastrar', [authMW], operador.cadastrar);
    app.post('/operador/editar', [authMW], operador.editar);
    app.post('/operador/remover', [authMW], operador.remover);

    /* MENU */
    app.post('/menu/listar', [authMW], menu.listar);
    app.post('/menu/cadastrar', [authMW], menu.cadastrar);
    app.post('/menu/editar', [authMW], menu.editar);
    app.post('/menu/remover', [authMW], menu.remover);





    /* ROTAS PARA A PAGINA CARDÁPIO */
    app.post('/cardapio/selectall', cardapio.selectAll);
    app.post('/cardapio/insert', cardapio.insert);
    app.post('/cardapio/update', cardapio.update);
    app.post('/cardapio/delete', cardapio.delete);

    app.post('/tabelasVariaveis/banco/selectAll', tabelasVariaveis.banco_selectAll);
    app.post('/tabelasVariaveis/municipio/selectAll', tabelasVariaveis.municipio_selectAll);
    app.post('/tabelasVariaveis/estado/selectAll', tabelasVariaveis.estado_selectAll);
    app.post('/tabelasVariaveis/tipoConta/selectAll', tabelasVariaveis.tipoConta_selectAll);
    app.post('/tabelasVariaveis/tipoCadastroConta/selectAll', tabelasVariaveis.tipoCadastroConta_selectAll);

}