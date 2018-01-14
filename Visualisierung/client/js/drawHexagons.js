var bbox = [6.597,50.816,7.273,51.089];
var cellSide = 0.5;
var options = {units: 'miles'};

var hexgrid = turf.hexGrid(bbox, cellSide, options);

var geoArray = [];

var maxAmount;

function drawHexagons(bikes){
    async.series([
        function(callback) {createArrayOfHexagons(callback);},
        function(callback) {countBikesInHexagon(bikes, callback);},
        function(callback) {getMaxAmount(callback);},
        function(callback) {colorCodeHexagons(callback);}
    ], function(err) {
        if (err) {
            console.log(err);
            throw err;
        }

		L.geoJSON(geoArray, {
			style: function(hexagon){
				var hexStyle = {
				opacity: hexagon.properties.opacity,
					class: hexagon.properties.class
				};
				return hexStyle;
			}
		}).addTo(map);
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

			if(pointToPolygon(bike.geometry.coordinates, hexagon.geometry.coordinates[0])){
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
    var x = point[1], y = point[0];

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
	for(var i = 0; i < geoArray.length; i++){
		var hexagon = geoArray[i];

		if(hexagon.properties.amount != 0 && hexagon.properties.amount != null){
			hexagon.properties.class = 'filledHexagons';
			hexagon.properties.opacity = (hexagon.properties.amount/maxAmount)+0.1;
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