var urlTimeframe = '/api/data';
var urlTotalbikes = '/api/totalbikes';
var urlTemperature = '/api/weatherhourly';
var bikesURL = 'data/bikes.geojson';

// The very first date in database to initiate Hex-Bike
var queryTimestamp = '2017-12-13T06:00:00Z';

var bikes = null;
var totalBikes = null;
var weather = null;

/* 
** This method works like a central flow controller for data fetching.
** Since JavaScript is asynchronous by nature this has to be done in order to make everything work the way we want it to.
** After the data is fetched, the graphs are drawn. After the bike data for a specific time is fetched the hexagons and weather display are drawn.
*/
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

/* 
** Fetches bike data for specific time frame (specific hour in a day).
*/
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
        console.log('Bikes successfully loaded.');

        callback();
    });
}

/* 
** Fetches total amount of available bikes for each hour.
** Once the data is fetched the date and the time must be separatly saved as strings for display purposes.
** Also the date is turned into a JavaScript-Date object and the maximum amount of total bikes and the latest timestamp are saved as well.
*/
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

                // Saves date and time as String for display purposes
                var date = timestamp.b_time.substring(0,10);
                var time = timestamp.b_time.substring(11,16);

                timestamp.displayTime = date + ' ' + time;
                timestamp.date = new Date(timestamp.b_time);

                // Gets maximum total amount of available bikes
                if(timestamp.total_bikes > max){
                    max = timestamp.total_bikes;
                }

                // Saves the latest timestamp for x-axis
                if(i === totalBikes.length){
                    latestTimeStamp = timestamp.date;
                }
            }

            // Saves maximum total amount of available bikes for total available bikes y-axis
            totalBikes.maxTotal = max;

            // Saves the latest timestamp for x-axis
            totalBikes.latestTimeStamp = latestTimeStamp;

            // Saves the earliest timestamp for x-axis
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
        console.log('Total bikes successfully loaded.');

        callback();
    });
}

/* 
** Fetches all the weather data.
** Once the data is fetched the temperature is separatly saved as an integer,
** the date is turned into a JavaScript-Date object and the temperature is formatted as a string
** Also the maximum overall temperature is saved for the temperature y-axis
*/
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

                // Save temperature as integer
                weatherItem.temp = Math.round(weatherItem.temp);

                // Save date as JavaScript-Date object
                weatherItem.date = new Date(weatherItem.w_time);

                // Save temperature as formatted string for weather display
                weatherItem.temperature = Math.round(weatherItem.temp) + '°C';

                // Get overall maximum temperature
                if(weatherItem.temp > maxTemp){
                    maxTemp = weatherItem.temp;
                }
            }

            // Save maximum temperature for temperature y-axis
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
        console.log('Weather successfully loaded.');

        callback();
    });
}

/* 
** Initiates the drawing of the hexagons.
** This method is called when a specific time frame is selected in the graph.
** After the new data is fetched the hexagons are redrawn
*/ 
function initiateHexagons(postbody){
    async.series([
        function(callback) {sendRequestForTimeframe(postbody, callback);},
        function(callback) {drawHexagons(callback);}
    ], function(err) {
        if (err) {
            console.log(err);
            throw err;
        }

        // Update weather display
        initiateWeather();
    });
}

/* 
** Initiates the drawing of the weather.
** This method is called when a specific time frame is selected in the graph.
** After the new data is fetched and the hexagons are redrawn the weather display is updated
*/ 
function initiateWeather(){
    async.series([
        function(callback) {drawWeather(callback);}
    ], function(err) {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}