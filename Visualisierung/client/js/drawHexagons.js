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
        hexagon.properties.opacity = 0.2 + 0.3 + 1/(cellSize*100);
      } else if (percentage < 0.4){
        hexagon.properties.opacity = 0.4 + 0.3 + 1/(cellSize*100);
      } else if (percentage < 0.6){
        hexagon.properties.opacity = 0.6 + 0.3 + 1/(cellSize*100);
      } else if (percentage < 0.8){
        hexagon.properties.opacity = 0.8 + 0.3 + 1/(cellSize*100);
      } else {
        hexagon.properties.opacity = 1 + 0.3 + 1/(cellSize*100);
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
