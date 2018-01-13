var express = require('express');
var path = require('path');
var request = require('request');
var to_json = require('xmljson').to_json;
var jsonFile = require('jsonfile');

const router = express.Router();

const bikesFile = '../data/bikes.geojson';
const stationsFile = '../data/stations.geojson';

var daten;
var json;

router.get('/bikes.geojson', function(req, res) {
    res.sendFile(path.join(__dirname, bikesFile), function(err) {
        if (err) {
            throw err;
        }

        console.log(path.join(__dirname, bikesFile) + ' sent to client.');
    });
});

router.get('/stations.geojson', function(req, res) {
    res.sendFile(path.join(__dirname, stationsFile), function(err) {
        if (err) {
            throw err;
        }

        console.log(path.join(__dirname, stationsFile) + ' sent to client.');
    });
});

/*
function checkForExistingSessions(user, callback){
    var select = 'SELECT sessionId FROM sessions ';
    var where = 'WHERE username="' + user + '";';

    var query = select + where;

    logger.log({
        level: 'error',
        message: 'Query sent: ' + query
    });

    connection.query(query, function(err, result, fields) {
        if(err){
            logger.log({
                level: 'error',
                message: err
            });

            callback();
        } else{
            logger.log({
                level: 'info',
                message: 'Query sent to data base.'
            });

            logger.log({
                level: 'info',
                message: result
            });

            if(result.length != 0){
                tokenExists = true;
            }

            callback();
        }
    })
} 
*/

module.exports = router;