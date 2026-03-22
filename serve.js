const express = require('express');
const path = require('path');
const app = express();

// IMPORTANTE: El nombre 'agricultor' debe coincidir con el nombre en angular.json
app.use(express.static(__dirname + '/dist/agricultor/browser'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/agricultor/browser/index.html'));
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Servidor de producción corriendo...');
});
