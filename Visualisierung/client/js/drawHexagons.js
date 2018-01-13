var bbox = [6.597,50.816,7.273,51.089];
var cellSide = 0.5;
var options = {units: 'miles'};

var hexgrid = turf.hexGrid(bbox, cellSide, options);

var geoArray = [];

hexgrid.features.forEach(function(geo){
	var object = {
		type: 'Feature',
		properties: null,
		geometry: geo.geometry
	}

	geoArray.push(object);
})

L.geoJSON(geoArray, {
	style: function(feature){
		return {color: 'red'};
	}
}).addTo(map);