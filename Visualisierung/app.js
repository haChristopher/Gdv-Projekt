/*jshint esversion: 6 */
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');

const nextbikeData = require('./routes/nextbikeData.js');
const gebieteData = require('./routes/gebieteData.js');

var app = express();

app.use(express.static(path.join(__dirname, 'client')));
// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// API file for interacting with MongoDB
const api = require('./routes/sqlDatabase.js');

// API location
app.use('/api', api);

app.use('/scripts', express.static(path.join(__dirname, '/node_modules/d3/build/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/leaflet/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/async/dist/')));
app.use('/styles', express.static(path.join(__dirname, '/node_modules/leaflet/dist/')));
app.use('/data', nextbikeData);
app.use('/gebiete', gebieteData);

app.set('port', 3000);

app.listen(app.get('port'), function(){
	console.log("Listening on port " + app.get('port'));
});
