var koelnlat = 50.9429;
var koelnlng = 6.95649;
var zoom = 12;

var stationsURL = 'data/stations.geojson';
var bikesURL = 'data/bikes.geojson';

var map;
var g;

var div = d3.select("body").append("div")
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

        div.html('<p>' + d.properties.name + '</p><br/>' + '<p>Bikes: ' + d.properties.bikes + '</p>')
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px');
    })
    .on('mouseout', function(d) {
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

        div.html(d.properties.name)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px');
    })
    .on('mouseout', function(d) {
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

//------------create hexagonal grid--------------
//svg sizes and margins
var margin = {
    top: 50,
    right: 20,
    bottom: 20,
    left: 50
}

var mapWidth = 800;
var mapHeight = 500;

//The number of columns and rows of the heatmap
var MapColumns = 30,
    MapRows = 20;

//The maximum radius the hexagons can have to still fit the screen
var hexRadius = d3.min([mapWidth/((MapColumns + 0.5) * Math.sqrt(3)),
   mapHeight/((MapRows + 1/3) * 1.5)]);

//Calculate the center positions of each hexagon
var points = [];
for (var i = 0; i < MapRows; i++) {
   for (var j = 0; j < MapColumns; j++) {
       points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
   }//for j
}//for i

//Set the hexagon radius
var hexbin = d3.hexbin().radius(hexRadius);

//Draw the hexagons
svg.append("g")
    .selectAll(".hexagon")
    .data(hexbin(points))
    .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", function (d) {
  return "M" + d.x + "," + d.y + hexbin.hexagon();
 })
    .attr("stroke", "white")
    .attr("stroke-width", "1px")
    .style("fill", "teal");
