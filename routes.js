module.exports = (app) => {

    const restaurante = require('./controllers/restaurante.controller'); 
    const auth = require('./controllers/auth.controller'); 
    const cardapio = require('./controllers/cardapio.controller');
    const operador = require('./controllers/operador.controller');
    const menu = require('./controllers/menu.controller');
    const tabelasVariaveis = require('./controllers/tabelasVariaveis.controller');

    app.get('/', (req, res) =>{ res.json("Server Online") });
    app.post('/login', auth.login);

    /* ROTAS PARA A PAGINA RESTAURANTE */      
    app.post('/restaurante/checarSeCodigoExiste', restaurante.checarSeCodigoExiste); 
    app.post('/restaurante/checarSeCNPJExiste', restaurante.checarSeCNPJExiste);   
    app.post('/restaurante/cadastrar', restaurante.cadastrar);
    
    /* ROTAS PARA A PAGINA CARDÁPIO */  
    app.post('/cardapio/selectall', cardapio.selectAll);
    app.post('/cardapio/insert', cardapio.insert);
    app.post('/cardapio/update', cardapio.update);
    app.post('/cardapio/delete', cardapio.delete);

    /* ROTAS PARA A PAGINA OPERADOR */  
    app.post('/operador/selectall', operador.selectAll);
    app.post('/operador/selectwhere', operador.selectWhere);
    app.post('/operador/insert', operador.insert);
    app.post('/operador/update', operador.update);
    app.post('/operador/delete', operador.delete);
   
    app.post('/menu/selectall', menu.selectAll);
    app.post('/menu/insert', menu.insert);
    app.post('/menu/update', menu.update);
    app.post('/menu/delete', menu.delete);
  
    app.post('/tabelasVariaveis/banco/selectAll', tabelasVariaveis.banco_selectAll);
    app.post('/tabelasVariaveis/municipio/selectAll', tabelasVariaveis.municipio_selectAll);
    app.post('/tabelasVariaveis/estado/selectAll', tabelasVariaveis.estado_selectAll);
    app.post('/tabelasVariaveis/tipoConta/selectAll', tabelasVariaveis.tipoConta_selectAll);
    app.post('/tabelasVariaveis/tipoCadastroConta/selectAll', tabelasVariaveis.tipoCadastroConta_selectAll);

}