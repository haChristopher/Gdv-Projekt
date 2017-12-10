var express = require('express');
var path = require('path');

const nextbikeData = require('./routes/nextbikeData.js');

var app = express();

app.use(express.static(path.join(__dirname, 'client')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/d3/build/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/leaflet/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/styles', express.static(path.join(__dirname, '/node_modules/leaflet/dist/')));
app.use('/data', nextbikeData);

app.set('port', 3000);

app.listen(app.get('port'), function(){
	console.log("Listening on port " + app.get('port'));
});