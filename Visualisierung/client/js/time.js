var data = [
    {
      date: '1',
      bikes: '1'
    },
    {
      date: '2',
      bikes: '2'
    },
    {
      date: '3',
      bikes: '3'
    },
    {
      date: '4',
      bikes: '4'
    },
    {
      date: '5',
      bikes: '5'
    }
]

var margin = {top: 10, right: 0, bottom: 20, left: 15};
var width = parseInt((d3.select('#time').attr('width')).substring(0,4));
var height = parseInt((d3.select('#time').attr('height')).substring(0,4));

var x = d3.scaleLinear()
.domain([0, 5])
.range([0, width-margin.left*1.5]);
var y = d3.scaleLinear()
.domain([5, 0])
.range([margin.top, height-margin.bottom]);

var valueline = d3.line()
    .x(function(d) { return x(parseInt(d.date)); })
    .y(function(d) { return y(parseInt(d.bikes)); });

var svg = d3.select('#time')
  .append("g")
  .attr('class', 'timeChartRect')
  .attr('width' , '100%')
  .attr('height', '100%');

var line = svg.append("path")
  .data([data])
  .attr("class", "line")
  .attr("transform", "translate(" + margin.left + ",0)")
  .attr("d", valueline);

svg.append("g")
  .attr('width', '100%')
  .attr("transform", "translate(" + margin.left + "," + (height-margin.bottom) + ")")
  .call(d3.axisBottom(x).ticks(6));

svg.append("g")
  .attr('height', '100%')
  .attr("transform", "translate(" + margin.left + ",0)")
  .call(d3.axisLeft(y).ticks(6));

var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

// var mousePerLine = mouseG.selectAll('.mouse-per-line')
//     .data(cities)
//     .enter()
//     .append("g")
//     .attr("class", "mouse-per-line");

// mousePerLine.append("text")
// .attr("transform", "translate(10,3)");

var verticalLine = mouseG.append('rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all');
    
verticalLine.on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      // d3.selectAll(".mouse-per-line text")
      //   .style("opacity", "0");
})
.on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      // d3.selectAll(".mouse-per-line text")
      //   .style("opacity", "1");
    })
.on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });
});