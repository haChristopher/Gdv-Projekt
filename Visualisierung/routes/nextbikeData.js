var express = require('express');
var path = require('path');
var request = require('request');
var to_json = require('xmljson').to_json;
var jsonFile = require('jsonfile');

const router = express.Router();

const bikesFile = '../data/bikes.json';
const stationsFile = '../data/stations.json';

var daten;
var json;

router.get('/bikes.json', function(req, res) {
    res.sendFile(path.join(__dirname, bikesFile), function(err) {
        if (err) {
            throw err;
        }

        console.log(path.join(__dirname, bikesFile) + ' sent to client.');
    });
});

router.get('/stations.json', function(req, res) {
    res.sendFile(path.join(__dirname, stationsFile), function(err) {
        if (err) {
            throw err;
        }

        console.log(path.join(__dirname, stationsFile) + ' sent to client.');
    });
});

module.exports = router;