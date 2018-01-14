/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "root",
    "port": "3306",
    "database": "gdv_nextbike"
});

connection.connect();

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};


/* get all users from database */
router.get('/wetter', function (req, res) {
    connection.query('SELECT * FROM wetter', function (error, results) {
        if (error) {
            throw error;
        } else {
            response.data = results;
            res.json(response);
        }
    });
});

/* get all users from database */
router.get('/bikes', function (req, res) {
    console.log('hello');
    connection.query('SELECT * FROM bikes', function (error, results) {
        if (error) {
            throw error;
        } else {
            response.data = results;
            res.json(response);
        }
    });
});

/* get all users from database */
router.get('/stationen', function (req, res) {
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
