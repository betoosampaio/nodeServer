module.exports = (app) => {
    const restaurante = require('./controllers/restaurante.controller');
    app.post('/restaurante/selectall', restaurante.selectAll);
    app.post('/restaurante/insert', restaurante.insert);
    app.post('/restaurante/update', restaurante.update);
    app.post('/restaurante/delete', restaurante.delete);

    const cardapio = require('./controllers/cardapio.controller');
    app.post('/cardapio/selectall', cardapio.selectAll);
    app.post('/cardapio/insert', cardapio.insert);
    app.post('/cardapio/update', cardapio.update);
    app.post('/cardapio/delete', cardapio.delete);

    const operador = require('./controllers/operador.controller');
    app.get('/operador/selectall', operador.selectAll);
    app.post('/operador/insert', operador.insert);
    app.post('/operador/update', operador.update);
    app.post('/operador/delete', operador.delete);

    const menu = require('./controllers/menu.controller');
    app.post('/menu/selectall', menu.selectAll);
    app.post('/menu/insert', menu.insert);
    app.post('/menu/update', menu.update);
    app.post('/menu/delete', menu.delete);

    const tabelasVariaveis = require('./controllers/menu.controller');
    app.post('/tabelasVariaveis/banco/selectAll', tabelasVariaveis.banco_selectAll);
    app.post('/tabelasVariaveis/municipio/selectAll', tabelasVariaveis.municipio_selectAll);
    app.post('/tabelasVariaveis/estado/selectAll', tabelasVariaveis.estado_selectAll);
    app.post('/tabelasVariaveis/tipoConta/selectAll', tabelasVariaveis.tipoConta_selectAll);

}