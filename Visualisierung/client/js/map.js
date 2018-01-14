var koelnlat = 50.9429;
var koelnlng = 6.95649;
var zoom = 11;

var map;
var g;

var tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

var map = L.map('map', {zoomControl: false }).setView([koelnlat, koelnlng], zoom);
map.scrollWheelZoom.disable();

var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
}).addTo(map);

var svgLayer = L.svg();
svgLayer.addTo(map);