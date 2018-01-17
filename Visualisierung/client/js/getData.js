var urlTimeframe = '/api/data';
var urlTotalbikes = '/api/totalbikes';
var urlTemperature = '/api/weatherhourly';
var bikesURL = 'data/bikes.geojson';

var queryTimestamp = '2017-12-13T06:00:00Z';

var bikes = null;
var totalBikes = null;
var weather = null;

(function getData(){
    var postbody = {
        'time': queryTimestamp
    }
    
    async.series([
        function(callback) {sendRequestForTotalBikes(callback);},
        function(callback) {sendRequestForTemperature(callback);},
        function(callback) {drawGraph(callback);},
        function(callback) {sendRequestForTimeframe(postbody, callback);},
        function(callback) {drawHexagons(callback);},
        function(callback) {drawWeather(callback);}
    ], function(err) {
        if (err) {
            console.log(err);
            throw err;
        }
    });
})();

function sendRequestForTimeframe(postbody, callback){
    bikes = null;
    $.ajax({
        url: urlTimeframe,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(postbody),
        success: function(data) {
            bikes = data.data;
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

function sendRequestForTotalBikes(callback){
    totalBikes = null;
    $.ajax({
        url: urlTotalbikes,
        method: 'GET',
        success: function(data) {
            totalBikes = data.data;

            var max = 0;
            var maxTemp = 0;
            var latestTimeStamp = 0;

            for(var i = 0; i < totalBikes.length; i++){
                var timestamp = totalBikes[i];
                var date = timestamp.b_time.substring(0,10);
                var time = timestamp.b_time.substring(11,16);

                timestamp.displayTime = date + ' ' + time;
                timestamp.date = new Date(timestamp.b_time);

                if(timestamp.total_bikes > max){
                    max = timestamp.total_bikes;
                }

                // if(timestamp.temperature > max){
                //     maxTemp = timestamp.temperature;
                // }

                if(i === totalBikes.length){
                    latestTimeStamp = timestamp.date;
                }
            }

            totalBikes.maxTotal = max;
            // totalBikes.maxTemperatur = maxTemperature;
            totalBikes.latestTimeStamp = latestTimeStamp;
            totalBikes.earliestTimeStamp = totalBikes[0].date;
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

function sendRequestForTemperature(callback){
    weather = null;
    $.ajax({
        url: urlTemperature,
        method: 'GET',
        success: function(data) {
            weather = data.data;

            

            var maxTemp = 0;

            for(var i = 0; i < weather.length; i++){
                var weatherItem = weather[i];
                weatherItem.temp = Math.round(weatherItem.temp);
                weatherItem.date = new Date(weatherItem.w_time);
                weatherItem.temperature = Math.round(weatherItem.temp) + '°C';
                if(weatherItem.temp > maxTemp){
                    maxTemp = weatherItem.temp;
                }
            }

            weather.maxTemperature = maxTemp;
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

function initiateHexagons(postbody){
    async.series([
        function(callback) {sendRequestForTimeframe(postbody, callback);},
        function(callback) {drawHexagons(callback);}
    ], function(err) {
        if (err) {
            console.log(err);
            throw err;
        }

        console.log('Hexagons built');

        initiateWeather();
    });
}

function initiateWeather(){
    async.series([
        function(callback) {drawWeather(callback);}
    ], function(err) {
        if (err) {
            console.log(err);
            throw err;
        }

        console.log('Weather built');
    });
}