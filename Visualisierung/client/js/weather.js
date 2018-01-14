
function drawWeather(callback){

  console.log("HALLOOOOO");

  var weatherText = bikes[0].w_text;
  weatherText = "Rain";
  var imagePath = "./images/" + weatherText + ".svg";


  console.log(imagePath);

  async.series([
      function(callback) {drawImage(callback, imagePath);}
  ], function(err) {
      if (err) {
          console.log(err);
          throw err;
      }
  callback();
  });
}


function drawImage(callback, imagePath){

  var svg = d3.select(".weather").append("svg")
      .attr("width", 200)
      .attr("height", 200);

  var g = svg.append("g");

  var img = g.append("svg:image")
      .attr("xlink:href", imagePath)
      .attr("width", 100)
      .attr("height", 100)
      .attr("x", 0)
      .attr("y", 0);

    callback();
}
