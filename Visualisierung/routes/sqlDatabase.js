/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "root",
    "port": "3306",
    "database": "gdv_nextbike",
    "timezone": 'local'
});

connection.connect();

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};


/* get weather from database */
router.post('/data', function (req, res) {
    console.log(req.body);
    var timestamp = req.body.time;
    connection.query('SELECT * FROM bike_location_total_weather_by_time WHERE b_time = ' +
                      mysql.escape(timestamp), function (error, results) {
        if (error) {
            throw error;
        } else {
            response.data = results;
            res.json(response);
        }
    });
});


/* get weather from database */
router.get('/totalbikes', function (req, res) {
    connection.query('SELECT * FROM totalbikes', function (error, results) {
        if (error) {
            throw error;
        } else {
            response.data = results;
            res.json(response);
        }
    });
});

/* get weather from database */
router.get('/weatherhourly', function (req, res) {
    connection.query('SELECT * FROM weatherhourly', function (error, results) {
        if (error) {
            throw error;
        } else {
            response.data = results;
            res.json(response);
        }
    });
});

/* get all bikes from database */
router.get('/bikes', function (req, res) {
    connection.query('SELECT * FROM bikes', function (error, results) {
        if (error) {
            throw error;
        } else {
            response.data = results;
            res.json(response);
        }
    });
});

/* get all stations from database */
router.get('/stations', function (req, res) {
    connection.query('SELECT * FROM stationen', function (error, results) {
        if (error) {
            throw error;
        } else {
            response.data = results;
            res.json(response);
        }
    });
});

module.exports = router;
