function addToolTip(){
	var hexagonElements = d3.selectAll('#hexagon');

hexagonElements.on('mouseover', function() {
    d3.select(this).style('stroke-width', '3');

    var hexClass = this.classList[1];
    var indexBeforeNumber = hexClass.indexOf('r');

    var hexNumber = hexClass.substring(indexBeforeNumber+1, hexClass.length);
    var hexAmount = hexValues[hexNumber];

    tooltip.transition()
        .duration(200)
        .style('opacity', .9);

    tooltip.html('<strong>Anzahl Fahrräder: ' + hexAmount + '</strong>')
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY + 10) + 'px');
    })
    .on('mouseout', function() {
    	d3.select(this).style('stroke-width', '1');

        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });
}