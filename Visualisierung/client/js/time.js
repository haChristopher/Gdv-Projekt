var graphTooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

function drawGraph(callback){
  var margin = {top: 10, right: 15, bottom: 20, left: 15};
  var width = parseInt((d3.select('#time').attr('width')).substring(0,4));
  var height = parseInt((d3.select('#time').attr('height')).substring(0,4));

  var parseTime = d3.timeParse("%d-%b-%y");

  var x = d3.scaleTime()
  .domain(d3.extent(totalBikes, function(d) { return d.date; }))
  .range([0, width-margin.left*3]);
  var y = d3.scaleLinear()
  .domain([parseInt(totalBikes.maxTotal), 550])
  .range([margin.top, height-margin.bottom]);

  var bisectDate = d3.bisector(function(d) { return d.date; }).left;

  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(parseInt(d.total_bikes)); });

  var svg = d3.select('#time')
    .append("g")
    .attr('class', 'timeChart')
    .attr('width' , '100%')
    .attr('height', '100%');

  svg.append('rect')
    .attr('class', 'graphBackground')
    .attr('width' , '100%')
    .attr('height', '100%');

  var g = svg.append('g')
    .attr('class', 'timeG')
    .attr('width' , '100%')
    .attr('height', '100%');

  g.append("g")
    .attr('width', '100%')
    .attr('class', 'axis')
    .attr("transform", "translate(" + margin.left*2 + "," + (height-margin.bottom) + ")")
    .call(d3.axisBottom(x).ticks(30));

  g.append("g")
    .attr('height', '100%')
    .attr('class', 'axis')
    .attr("transform", "translate(" + margin.left*2 + ",0)")
    .call(d3.axisLeft(y).ticks(5));

  g.append("path")
    .data([totalBikes])
    .attr("class", "line")
    .attr("transform", "translate(" + margin.left*2 + ",0)")
    .attr("d", valueline);

  var mouseG = g.append("g") // this is the black vertical line to follow mouse
      .attr("class", "mouse-over-effects");

  mouseG.append("path")
    .attr("class", "mouse-line")
    .style("stroke", "white")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  var verticalLine = mouseG.append('rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');
      
  verticalLine.on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select('.mouse-line')
          .style("opacity", "0");
        var mouse = d3.mouse(this);
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectDate(totalBikes, x0, 0);

        tooltip.transition()
            .duration(200)
            .style('opacity', .9);

        tooltip.html('Anzahl Fahrräder: <strong>' + hexAmount + '</strong>')
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY + 10) + 'px');
  })
  .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select('.mouse-line')
          .style("opacity", "1");
        // d3.selectAll(".mouse-per-line text")
        //   .style("opacity", "1");
      })
  .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectDate(totalBikes, x0, 0);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + (height-(margin.top*1.5));
            d += " " + mouse[0] + "," + margin.top;
            return d;
          });
  })
  .on('click', function(){
    var mouse = d3.mouse(this);
  });

  callback();
}