module.exports = (app) => {
    const teste = require('./controllers/teste.controller');

    app.get('/', teste.getAll);
    app.get('/insere', teste.insere);
}