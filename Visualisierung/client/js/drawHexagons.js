var bbox = [minX,minY,maxX,maxY];
var cellSize = 1;
var options = {units: 'kilometres'};

var hexgrid = turf.hexGrid(bbox, cellSize, options);

var geoArray = [];

var maxAmount;

var hexCounter = 0;
var hexValues = [];

function drawHexagons(callback){
    async.series([
        function(callback) {createArrayOfHexagons(callback);},
        function(callback) {countBikesInHexagon(bikes, callback);},
        function(callback) {getMaxAmount(callback);},
        function(callback) {colorCodeHexagons(callback);},
        function(callback) {drawLegend(callback);},
        function(callback) {removeOldHexagons(callback);}
    ], function(err) {
        if (err) {
            console.log(err);
            throw err;
        }

		allHexagons = L.geoJSON(geoArray, {
			style: function(hexagon){
				var hexStyle = {
					fillOpacity: hexagon.properties.opacity,
					className: hexagon.properties.class
				};
				return hexStyle;
			}
		}).addTo(map);

		allHexagons.eachLayer(function (hexagon) {
			if(hexagon._path.classList[0] === 'filledHexagons'){
				hexagon._path.id = 'hexagon';
			}else{
				hexagon._path.id = 'greyHexagon';
			}
		});

		addToolTip();

		callback();
    });
}

function createArrayOfHexagons(callback){
	geoArray = [];
	for(var i = 0; i < hexgrid.features.length; i++){
		var geo = hexgrid.features[i];

		var object = {
			type: 'Feature',
			properties: {
				amount: null,
				class: 'hexagons',
				opacity: null
			},
			geometry: geo.geometry
		}

		geoArray.push(object);

		if(i === (hexgrid.features.length-1)){
			callback();
		}
	}
}

function countBikesInHexagon(bikes, callback){
	for(var i = 0; i < bikes.length; i++){
		var bike = bikes[i];
		for(var j = 0; j < geoArray.length; j++){
			var hexagon = geoArray[j];

			var coordinates = [bike.longitude, bike.latitude];

			if(pointToPolygon(coordinates, hexagon.geometry.coordinates[0])){
				var counter = hexagon.properties;
				if(counter === null){
					counter = 1;
					hexagon.properties.amount = counter;
				} else {
					counter = hexagon.properties.amount;
					counter++;
					hexagon.properties.amount = counter;
				}
			}
		}

		if(i === (bikes.length-1)){
			callback();
		}
	}
}

function pointToPolygon(point, vs) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function colorCodeHexagons(callback){
	hexValues = [];
	hexCounter = 0;
	for(var i = 0; i < geoArray.length; i++){
		var hexagon = geoArray[i];

		if(hexagon.properties.amount != 0 && hexagon.properties.amount != null){
			hexCounter++;
			hexagon.properties.class = 'filledHexagons Hexnumber' + hexCounter;
      var percentage = hexagon.properties.amount / (60.0*cellSize);
      if (percentage < 0.2) {
        hexagon.properties.opacity = 0.4;
      } else if (percentage < 0.4){
        hexagon.properties.opacity = 0.55;
      } else if (percentage < 0.6){
        hexagon.properties.opacity = 0.7;
      } else if (percentage < 0.8){
        hexagon.properties.opacity = 0.85;
      } else {
        hexagon.properties.opacity = 1;
      }
			hexValues[hexCounter] = hexagon.properties.amount;
		}

		if(i === (geoArray.length-1)){
			callback();
		}
	}
}

function getMaxAmount(callback){
	maxAmount = 0;
	for(var i = 0; i < geoArray.length; i++){
		var hexagon = geoArray[i];

		if(hexagon.properties.amount > maxAmount){
			maxAmount = hexagon.properties.amount;
		}

		if(i === (geoArray.length-1)){
			callback();
		}
	}
}

function removeOldHexagons(callback){
	d3.selectAll('#hexagon').remove();
	d3.selectAll('#greyHexagon').remove();

	callback();
}

function calculateSize(x){
   return ((60 * cellSize)/100 * x *100);
}

function drawLegend(callback) {
    var ranges = [1 + " - " + calculateSize(0.2),
        calculateSize(0.2) + " - " + calculateSize(0.4),
        calculateSize(0.4) + " - " + calculateSize(0.6),
        calculateSize(0.6) + " - " + calculateSize(0.8),
        calculateSize(0.8) + " - " + calculateSize(1)
    ];

    d3.selectAll('.legendText').remove();

    var yCoordAll = 50;
    var svg = d3.select('.legend')
        .append('div')
        .attr('class', 'legendText')
        .attr('width', 430)
        .attr('height', 200);

    svg.append('span')
        .html('0')
        // .style('float', 'left')
        .style('fill', '#f7f7f7 ')
        .attr('width', 20)
        .attr('height', 20)
        // .attr('x', 20)
        .attr('y', yCoordAll)
        .attr('id', 'legend0Text');

    svg.append('span')
        .html(ranges[0])
        // .style('float', 'left')
        .style('fill', '#f7f7f7 ')
        .attr('width', 20)
        .attr('height', 20)
        // .attr('x', 20)
        .attr('y', yCoordAll)
        .attr('id', 'legend1Text');

    svg.append('span')
        .html(ranges[1])
        // .style('float', 'left')
        .style('fill', '#f7f7f7 ')
        .attr('width', 20)
        .attr('height', 20)
        // .attr('x', 20)
        .attr('y', yCoordAll)
        .attr('id', 'legend2Text');

    svg.append('span')
        .html(ranges[2])
        // .style('float', 'left')
        .style('fill', '#f7f7f7 ')
        .attr('width', 20)
        .attr('height', 20)
        // .attr('x', 20)
        .attr('y', yCoordAll)
        .attr('id', 'legend3Text');

    svg.append('span')
        .html(ranges[3])
        // .style('float', 'left')
        .style('fill', '#f7f7f7 ')
        .attr('width', 20)
        .attr('height', 20)
        // .attr('x', 20)
        .attr('y', yCoordAll)
        .attr('id', 'legend4Text');

    svg.append('span')
        .html(ranges[4])
        // .style('float', 'left')
        .style('fill', '#f7f7f7 ')
        .attr('width', 20)
        .attr('height', 20)
        // .attr('x', 20)
        .attr('y', yCoordAll)
        .attr('id', 'legend5Text');

    callback();
}
