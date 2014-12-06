var express = require('express');
var api = require('./node_app/api');

var app = express();

app.use(express.static('app'));

app.get('/api/relations', api.relations);
app.get('/api/identifiers', api.identifiers);

var server = app.listen(8000, function () {

  var host = server.address().address
  var port = server.address().port



  console.log('Example app listening at http://%s:%s', host, port)

})