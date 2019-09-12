const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./routes.js')(app);

app.listen(3001, () => {
  console.log("Server UP");
});