const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./routes.js')(app);

app.listen(3000, () => {
  console.log("Server UP Port 3001");
});