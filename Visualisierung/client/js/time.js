var graphTooltip = d3.select("body").append("div")
.attr("class", "graphTooltip")
.style("opacity", 0);

var index = null;
var globalMouse = null;

function drawGraph(callback){
  var margin = {top: 10, right: 37, bottom: 20, left: 15};
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

        mouseG.append("path")
    .attr("class", "selected-line")
        .style("stroke", "white")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  var verticalLine = mouseG.append('rect') // append a rect to catch mouse movements on canvas
      .attr('width', width-margin.right) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('x', margin.left*2);

  verticalLine.on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select('.mouse-line')
          .style("opacity", "0");
        graphTooltip.transition()
          .duration(500)
          .style('opacity', 0);
  })
  .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select('.mouse-line')
          .style("opacity", "1");
      })
  .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectDate(totalBikes, x0, 0);
        if(i === totalBikes.length){
          i--;
        }
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + (height-(margin.top*1.5));
            d += " " + mouse[0] + "," + margin.top;
            return d;
          });

        graphTooltip.transition()
            .duration(200)
            .style('opacity', .9);

        graphTooltip.html(totalBikes[i].displayTime + ' Uhr</strong>')
            .style('left', (d3.event.pageX + 15) + 'px')
            .style('top', (d3.event.pageY + 15) + 'px');
  })
  .on('click', function(){
    index = 0;
    var mouse = d3.mouse(this);
    console.log(mouse);
    globalMouse = mouse;
    var x0 = x.invert(d3.mouse(this)[0]);
    index = bisectDate(totalBikes, x0, 0);
    if(index === totalBikes.length){
      index--;
    }

    d3.select('.selected-line')
      .style("opacity", "1")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + (height-(margin.top*1.5));
            d += " " + mouse[0] + "," + margin.top;
            return d;
          });

    queryTimestamp = totalBikes[index].b_time;
      var postbody = {
        'time': queryTimestamp
      }

      initiateHexagons(postbody);
  });

  d3.select('body').on('keydown', function(){
    var mouse = d3.mouse(this);
    if(index != null){
      var mousemovement = 0;
      var noUpdate = false;
        if(d3.event.keyCode === 39){
          if(index === (totalBikes.length-1)){
          noUpdate = true;
        }else{
          index++;
          mousemovement = globalMouse[0]+1;
          globalMouse[0]++;
        }
      }else if(d3.event.keyCode === 37){
        if(index === 0){
          noUpdate = true;
        }else{
          index--;
          mousemovement = globalMouse[0]-1;
          globalMouse[0]--;
        }
      }

      if(!noUpdate){
        d3.select('.selected-line')
        .style("opacity", "1")
            .attr("d", function() {
              var d = "M" + mousemovement + "," + (height-(margin.top*1.5));
              d += " " + mousemovement + "," + margin.top;
              return d;
            });

      queryTimestamp = totalBikes[index].b_time;
        var postbody = {
          'time': queryTimestamp
        }

        initiateHexagons(postbody);
      }
      }
    });

  callback();
}
