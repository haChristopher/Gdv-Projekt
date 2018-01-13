var g = d3.select('#map').select('svg').select('g');
g.attr('class', 'leaflet-zoom-hide');

var gBikes = g.append('g');

var bikes = null;

bikes = $.ajax({
    type: 'GET',
    url: '/data'
});
