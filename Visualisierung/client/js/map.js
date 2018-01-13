var koelnlat = 50.9429;
var koelnlng = 6.95649;
var zoom = 11;

var map;
var g;

var tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

map = L.map('map').setView([koelnlat, koelnlng], zoom);
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: 11, minZoom: 11,
}).addTo(map);

var svgLayer = L.svg();
svgLayer.addTo(map);

var g = d3.select('#map').select('svg').select('g');
g.attr('class', 'leaflet-zoom-hide');

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
