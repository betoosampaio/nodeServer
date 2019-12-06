module.exports = (app) => {

    /* MIDDLEWARES */
    const logMW = require('./middlewares/log.middleware');
    const authMW = require('./middlewares/auth.middleware');
    const imgprodutoMW = require("./middlewares/multer.imgproduto.middleware").upload;
    const imgrestauranteMW = require("./middlewares/multer.imgrestaurante.middleware").upload;
    app.use(logMW);

    /* CONTROLLERS */
    const restaurante = require('./controllers/restaurante.controller');
    const auth = require('./controllers/auth.controller');
    const produto = require('./controllers/produto.controller');
    const operador = require('./controllers/operador.controller');
    const perfil = require('./controllers/perfil.controller');
    const ambiente = require('./controllers/ambiente.controller');
    const menu = require('./controllers/menu.controller');
    const mesa = require('./controllers/mesa.controller');
    const mesaitem = require('./controllers/mesaitem.controller');
    const pagamento = require('./controllers/pagamento.controller');
    const caixa = require('./controllers/caixa.controller');
    const suprimento = require('./controllers/suprimento.controller');
    const sangria = require('./controllers/sangria.controller');
    const permissao = require('./controllers/permissao.controller');

    app.get('/', (req, res) => { res.json("Server Online") });
    app.post('/login', auth.login);
    app.post('/validarToken', auth.validarToken);

    /* RESTAURANTE */
    app.post('/restaurante/checarSeCodigoExiste', restaurante.checarSeCodigoExiste);
    app.post('/restaurante/checarSeCNPJExiste', restaurante.checarSeCNPJExiste);
    app.post('/restaurante/cadastrar', restaurante.cadastrar);
    app.post('/restaurante/uploadimg', [imgrestauranteMW], restaurante.uploadimg);
    app.post('/restaurante/obter', [authMW], restaurante.obter);
    app.post('/restaurante/editar/dadosRestaurante', [authMW], restaurante.editarDadosRestaurante);
    app.post('/restaurante/editar/dadosBancarios', [authMW], restaurante.editarDadosBancarios);
    app.post('/restaurante/editar/dadosPessoais', [authMW], restaurante.editarDadosPessoais);
    app.post('/restaurante/inativar', [authMW], restaurante.inativar);
    app.post('/restaurante/reativar', [authMW], restaurante.reativar);
    app.post('/restaurante/editar/configuracoes', [authMW], restaurante.editarConfiguracoes);
    app.post('/restaurante/obter/configuracoes', [authMW], restaurante.obterConfiguracoes);
    

    /* VARIAVEIS CADASTRO */
    app.post('/obterBancos', restaurante.obterBancos);
    app.post('/obterMunicipios', restaurante.obterMunicipios);
    app.post('/obterEspecialidades', restaurante.obterEspecialidades);
    app.post('/obterTipoAtendimento', restaurante.obterTipoAtendimento);
    app.post('/obterFormasPagamento', [authMW], restaurante.obterFormasPagamento);

    /* OPERADOR */
    app.post('/operador/listar', [authMW], operador.listar);
    app.post('/operador/obter', [authMW], operador.obter);
    app.post('/operador/cadastrar', [authMW], operador.cadastrar);
    app.post('/operador/editar', [authMW], operador.editar);
    app.post('/operador/remover', [authMW], operador.remover);
    app.post('/operador/checarSeLoginExiste', [authMW], operador.checarSeLoginExiste);

    /* PERFIL */
    app.post('/perfil/existe', [authMW], perfil.existe);
    app.post('/perfil/listar', [authMW], perfil.listar);
    app.post('/perfil/obter', [authMW], perfil.obter);
    app.post('/perfil/cadastrar', [authMW], perfil.cadastrar);
    app.post('/perfil/editar', [authMW], perfil.editar);
    app.post('/perfil/remover', [authMW], perfil.remover);

    /* AMBIENTE */
    app.post('/ambiente/existe', [authMW], ambiente.existe);
    app.post('/ambiente/listar', [authMW], ambiente.listar);
    app.post('/ambiente/obter', [authMW], ambiente.obter);
    app.post('/ambiente/cadastrar', [authMW], ambiente.cadastrar);
    app.post('/ambiente/editar', [authMW], ambiente.editar);
    app.post('/ambiente/remover', [authMW], ambiente.remover);

    /* MENU */
    app.post('/menu/existe', [authMW], menu.existe);
    app.post('/menu/listar', [authMW], menu.listar);
    app.post('/menu/obter', [authMW], menu.obter);
    app.post('/menu/cadastrar', [authMW], menu.cadastrar);
    app.post('/menu/editar', [authMW], menu.editar);
    app.post('/menu/remover', [authMW], menu.remover);

    /* PRODUTO */
    app.post('/produto/listar', [authMW], produto.listar);
    app.post('/produto/listarAtivos', [authMW], produto.listarAtivos);
    app.post('/produto/obter', [authMW], produto.obter);
    app.post('/produto/cadastrar', [authMW], produto.cadastrar);
    app.post('/produto/editar', [authMW], produto.editar);
    app.post('/produto/remover', [authMW], produto.remover);
    app.post('/produto/uploadimg', [authMW, imgprodutoMW], produto.uploadimg)
    app.post('/produto/checarSeCodigoProdutoExiste', [authMW], produto.checarSeCodigoProdutoExiste);
    app.post('/produto/obterProximoCodigoProduto', [authMW], produto.obterProximoCodigoProduto);

    /* MESA */
    app.post('/mesa/listar', [authMW], mesa.listar);
    app.post('/mesa/obter', [authMW], mesa.obter);
    app.post('/mesa/abrir', [authMW], mesa.abrir);
    app.post('/mesa/remover', [authMW], mesa.remover);
    app.post('/mesa/fechar', [authMW], mesa.fechar);
    app.post('/mesa/reabrir', [authMW], mesa.reabrir);
    app.post('/mesa/encerrar', [authMW], mesa.encerrar);
    app.post('/mesa/editarDesconto', [authMW], mesa.editarDesconto);
    app.post('/mesa/editarTaxaServico', [authMW], mesa.editarTaxaServico);
    app.post('/mesa/consultar', [authMW], mesa.consultar);

    /* MESA - ITEM */
    app.post('/mesa/item/incluir', [authMW], mesaitem.incluir);
    app.post('/mesa/item/remover', [authMW], mesaitem.remover);

    /* MESA - PAGAMENTO */
    app.post('/mesa/pagamento/incluir', [authMW], pagamento.incluir);
    app.post('/mesa/pagamento/remover', [authMW], pagamento.remover);

    /* CAIXA */
    app.post('/caixa/listar', [authMW], caixa.listar);
    app.post('/caixa/obter', [authMW], caixa.obter);
    app.post('/caixa/abrir', [authMW], caixa.abrir);
    app.post('/caixa/fechar', [authMW], caixa.fechar);
    app.post('/caixa/reabrir', [authMW], caixa.reabrir);
    app.post('/caixa/consultar', [authMW], caixa.consultar);

    /* CAIXA - SUPRIMENTO */
    app.post('/caixa/suprimento/incluir', [authMW], suprimento.incluir);
    app.post('/caixa/suprimento/remover', [authMW], suprimento.remover);

    /* CAIXA - SANGRIA */
    app.post('/caixa/sangria/incluir', [authMW], sangria.incluir);
    app.post('/caixa/sangria/remover', [authMW], sangria.remover);

    /* PERMISSAO */
    app.post('/permissao/listarPaginas', [authMW], permissao.listarPaginas);
    app.post('/permissao/listarPermissaoPaginas', [authMW], permissao.listarPermissaoPaginas);
    app.post('/permissao/incluirPermissaoPagina', [authMW], permissao.incluirPermissaoPagina);
    app.post('/permissao/removerPermissaoPagina', [authMW], permissao.removerPermissaoPagina);
    app.post('/permissao/listarMetodos', [authMW], permissao.listarMetodos);
    app.post('/permissao/listarPermissaoMetodos', [authMW], permissao.listarPermissaoMetodos);
    app.post('/permissao/incluirPermissaoMetodo', [authMW], permissao.incluirPermissaoMetodo);
    app.post('/permissao/removerPermissaoMetodo', [authMW], permissao.removerPermissaoMetodo);

}