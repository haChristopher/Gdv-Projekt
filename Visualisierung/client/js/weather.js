function drawWeather(callback){
  var weatherText = bikes[0].w_text;

  var now = new Date(bikes[0].b_time);
  var timeUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
                         now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

  var timeString = timeUTC.toString();
  var index = timeString.indexOf('G');
  timeString = timeString.substring(0, index-1);

  var temp = parseFloat(bikes[0].temp);
  temp = Math.round(temp) + " °C";
  var imagePath = "./images/" + weatherText + ".svg";

  async.series([
      function(callback) {removeOldWeather(callback);},
      function(callback) {drawImages(callback, imagePath, temp, timeString);}
  ], function(err) {
      if (err) {
          console.log(err);
          throw err;
      }
  callback();
  });
}

function drawImages(callback, imagePath, temp, time){

  var svg = d3.select(".weather").append("svg")
      .attr("width", 500)
      .attr("height", 170);

  var g = svg.append("g");

  var img = g.append("svg:image")
      .attr("xlink:href", imagePath)
      .attr("width", 100)
      .attr("height", 100)
      .attr("x", 10)
      .attr("y", 0);

  var text = g.append("text")
      .html(temp)
      .attr("width", 200)
      .attr("height", 200)
      .style('fill', '#f7f7f7')
      .attr('class', 'weather-celcius')
      .attr("x", 180)
      .attr("y", 70);

    var time2 = g.append("text")
      .html(time)
      .attr("width", 200)
      .attr("height", 200)
      .style('fill', '#f7f7f7')
      .attr('class', 'weather-text')
      .attr("x", 0)
      .attr("y", 130);

    callback();
}

function removeOldWeather(callback){
  d3.selectAll('.weather').select('svg').remove();

  callback();
}
