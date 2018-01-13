var koelnlat = 50.9429;
var koelnlng = 6.95649;
var zoom = 11;

var districtsURL = '/data/stadtgebiete.geojson';
var stationsURL = 'data/stations.geojson';
var bikesURL = 'data/bikes.geojson';

var map;
var g;

var tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

map = L.map('map').setView([koelnlat, koelnlng], zoom);
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: 18,
}).addTo(map);

var svgLayer = L.svg();
svgLayer.addTo(map);

var g = d3.select('#map').select('svg').select('g');
g.attr('class', 'leaflet-zoom-hide');

var gBikes = g.append('g');
var gStations = g.append('g');
var gDistricts = g.append('g');

var districts = null;

d3.json(districtsURL, function(jsonDistricts){
    jsonDistricts.features.forEach(function(d){
        districts = jsonDistricts.geometry.rings;
    })

    for(i = 0; i < districts.length; i++) {
        var area = d3.polygonArea(districts[i]);
        console.log(area);
    }


    map.on('zoom', updateMapDistricts);
    updateMapDistricts();

    function updateMapDistricts(){
        circlesDistricts.attr('transform', function(d){
            return 'translate(' + map.latLngToLayerPoint(d.LatLng).x + ',' + map.latLngToLayerPoint(d.LatLng).y + ')';
        })
    }
})

d3.json(bikesURL, function(jsonBikes){
    jsonBikes.features.forEach(function(d){
        d.LatLng = new L.LatLng(d.geometry.coordinates[0], d.geometry.coordinates[1]);
    })

    var circlesBikes = gBikes.selectAll('circle')
    .data(jsonBikes.features)
    .enter()
    .append('circle')
    .attr('id', 'bike')
    .attr('r', 5)
    .on('mouseover', function(d) {
        tooltip.transition()
        .duration(200)
        .style('opacity', .9);

        tool.html('<p>' + d.properties.name + '</p><br/>' + '<p>Bikes: ' + d.properties.bikes + '</p>')
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
        tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });

    map.on('zoom', updateMapBikes);
    updateMapBikes();

    function updateMapBikes(){
        circlesBikes.attr('transform', function(d){
            return 'translate(' + map.latLngToLayerPoint(d.LatLng).x + ',' + map.latLngToLayerPoint(d.LatLng).y + ')';
        })
    }
})

d3.json(stationsURL, function(jsonStations){
    jsonStations.features.forEach(function(d){
        d.LatLng = new L.LatLng(d.geometry.coordinates[0], d.geometry.coordinates[1]);
    })

    var circlesStations = gStations.selectAll('circle')
    .data(jsonStations.features)
    .enter()
    .append('circle')
    .attr('id', 'station')
    .attr('r', 10)
    .on('mouseover', function(d) {
        tooltip.transition()
        .duration(200)
        .style('opacity', .9);

        tooltip.html(d.properties.name)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
        tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });;

    map.on('zoom', updateMapStations);
    updateMapStations();

    function updateMapStations(){
        circlesStations.attr('transform', function(d){
            return 'translate(' + map.latLngToLayerPoint(d.LatLng).x + ',' + map.latLngToLayerPoint(d.LatLng).y + ')';
        })
    }
})

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
