require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./routes.js')(app);

app.listen(3001, () => {
  console.log("Server UP");
});