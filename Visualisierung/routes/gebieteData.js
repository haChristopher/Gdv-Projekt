var express = require('express');

const router = express.Router();

const gebieteFile = '../data/stadtgebiete.geojson';

router.get('/bikes.geojson', function(req, res) {
    res.sendFile(path.join(__dirname, gebieteFile), function(err) {
        if (err) {
            throw err;
        }

        console.log(path.join(__dirname, gebieteFile) + ' sent to client.');
    });
});

module.exports = router;