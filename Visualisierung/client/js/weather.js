
function drawWeather(callback){

  console.log("HALLOOOOO");

  var weatherText = bikes[0].w_text;
  var temp = parseFloat(bikes[0].temp);
  temp = Math.round(temp).toFixed(1);
  var imagePath = "./images/" + weatherText + ".svg";


  console.log(imagePath);

  async.series([
      function(callback) {drawImages(callback, imagePath, temp);}
  ], function(err) {
      if (err) {
          console.log(err);
          throw err;
      }
  callback();
  });
}


function drawImages(callback, imagePath, temp){

  var svg = d3.select(".weather").append("svg")
      .attr("width", 400)
      .attr("height", 400);

  var g = svg.append("g");
//  var gg = svg.append("gg");

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
      .style('fill', 'white')
      .attr('class', 'weather-text')
      .attr("x", 120)
      .attr("y", 50);

  var celsius = g.append("svg:image")
      .attr("xlink:href", "./images/Celsius.svg")
      .attr("width", 100)
      .attr("height", 100)
      .attr("x", 210)
      .attr("y", 0);

    callback();
}
