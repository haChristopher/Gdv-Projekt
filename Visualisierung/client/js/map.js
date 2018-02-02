// Latitude and longitude for Cologne
var koelnlat = 50.9429;
var koelnlng = 6.95649;

// Standard map zoom
var zoom = 12;

// Map borders
var minX = 6.597;
var minY = 50.716;
var maxX = 7.373;
var maxY = 51.089;

// Saving map borders as special object for leaflet
var point1 = L.latLng(minY+0.01, minX+0.01);
var point2 = L.latLng(maxY-0.01, maxX-0.01);
var bounds = L.latLngBounds(point1, point2);

// City name
var imageUrl = '/images/textKoeln.png';
var imageBounds = [[50.955349, 6.937181], [50.942341, 7.0]];

// Tooltip to display amount of bikes in hexagons
var tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// Creating the map by setting point of view (center of cologne) and the standard map zoom
var map;
var map = L.map('map').setView([koelnlat, koelnlng], zoom);

// Disable zoom with middle mouse wheel
map.scrollWheelZoom.disable();

// Setting the bounds of the map so one can't drag beyond displayed hexagons
map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});

// Adds Köln as text to map
L.imageOverlay(imageUrl, imageBounds).addTo(map);

// Adding dark themed map without labels to map
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	maxZoom: 13,
	minZoom: 12
}).addTo(map);

// Adding white street lines to map
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
	ext: 'png',
	maxZoom: 13,
	minZoom: 12
}).addTo(map);

// Suppress keyboard events on map
document.querySelector("#map").addEventListener("keydown", function(event) {
         event.preventDefault();
         event.stopPropagation();
}, false);

// Adding svg layer to map for hexagons
var svgLayer = L.svg();
svgLayer.addTo(map);
