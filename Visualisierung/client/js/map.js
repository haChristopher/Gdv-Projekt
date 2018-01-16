var koelnlat = 50.9429;
var koelnlng = 6.95649;
var zoom = 12;

var minX = 6.597;
var minY = 50.716;
var maxX = 7.373;
var maxY = 51.089;

var point1 = L.latLng(minY+0.01, minX+0.01),
point2 = L.latLng(maxY-0.01, maxX-0.01);
var bounds = L.latLngBounds(point1, point2);

var map;

var tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

var map = L.map('map').setView([koelnlat, koelnlng], zoom);
map.scrollWheelZoom.disable();
map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});

// Dark themed map without labels, white street lines
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	maxZoom: 13,
	minZoom: 12
}).addTo(map);
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
	ext: 'png',
	maxZoom: 13,
	minZoom: 12
}).addTo(map);

//suppress keyboard events on map
document.querySelector("#map").addEventListener("keydown", function(event) {
         event.preventDefault();
         event.stopPropagation();
}, false);

var svgLayer = L.svg();
svgLayer.addTo(map);
