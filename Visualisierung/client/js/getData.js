var stationsURL = 'data/stations.geojson';
var bikesURL = 'data/bikes.geojson';

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