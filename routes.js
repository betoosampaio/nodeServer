module.exports = (app) => {
    const restaurante = require('./controllers/restaurante.controller');
    const cardapio = require('./controllers/cardapio.controller');
    const operador = require('./controllers/operador.controller');
    const menu = require('./controllers/menu.controller');

    app.post('/restaurante/selectall', restaurante.selectAll);
    app.post('/restaurante/insert', restaurante.insert);
    app.post('/restaurante/update', restaurante.update);
    app.post('/restaurante/delete', restaurante.delete);

    app.post('/cardapio/selectall', cardapio.selectAll);
    app.post('/cardapio/insert', cardapio.insert);
    app.post('/cardapio/update', cardapio.update);
    app.post('/cardapio/delete', cardapio.delete);

    app.get('/operador/selectall', operador.selectAll);
    app.post('/operador/insert', operador.insert);
    app.post('/operador/update', operador.update);
    app.post('/operador/delete', operador.delete);

    app.post('/menu/selectall', menu.selectAll);
    app.post('/menu/insert', menu.insert);
    app.post('/menu/update', menu.update);
    app.post('/menu/delete', menu.delete);
    
}