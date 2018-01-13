/*jshint esversion: 6 */
var express = require('express');
var path = require('path');

const nextbikeData = require('./routes/nextbikeData.js');
const gebieteData = require('./routes/gebieteData.js');

var app = express();

app.use(express.static(path.join(__dirname, 'client')));

// API file for interacting with MongoDB
const api = require('./routes/sqlDatabase');

// API location
app.use('/api', api);

app.use('/scripts', express.static(path.join(__dirname, '/node_modules/d3/build/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/leaflet/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/styles', express.static(path.join(__dirname, '/node_modules/leaflet/dist/')));
app.use('/data', nextbikeData);
app.use('/gebiete', gebieteData);

app.set('port', 3000);

app.listen(app.get('port'), function(){
	console.log("Listening on port " + app.get('port'));
});
