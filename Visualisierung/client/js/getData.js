var url = '/api/bikes';
var bikesURL = 'data/bikes.geojson';

var startTimestamp = '2017-12-13 05:00:00';

var bikes = null;

d3.json(bikesURL, function(jsonBikes){
    jsonBikes.features.forEach(function(d){
        d.LatLng = new L.LatLng(d.geometry.coordinates[0], d.geometry.coordinates[1]);
    })

    bikes = jsonBikes.features;

    drawHexagons(bikes);

    //getData();
})

function getData(){
    async.series([
        function(callback) {sendRequest(callback);}
    ], function(err) {
        if (err) {
            console.log(err);
            throw err;
        }
    }); 
}

function sendRequest(callback){
    $.ajax({
        url: url,
        method: '',
        contentType: 'application/json',
        data: {
            'time' : startTimestamp
        },
        dataType: 'json',
        success: function(data) {
            console.log(data);
        },
        error: function (jqXHR, exception) {
            var msg = '';

            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status === 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status === 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n'.concat(jqXHR.responseText);
            }

            console.log(msg);
            $('#post').html(msg);
        }
    }).done(function() {
        console.log('Data successfully loaded.');

        callback();
    });
}
