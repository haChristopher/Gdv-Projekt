var graphTooltip = d3.select("body").append("div")
.attr("class", "graphTooltip")
.style("opacity", 0);

var index = null;
var x0 = null;
var startMouse = [30, 46];
var globalMouse = [30, 46];

function drawGraph(callback){
  jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = new MouseEvent("click");
    e.dispatchEvent(evt);
  });
};


  var margin = {top: 10, right: 37, bottom: 20, left: 15};
  var width = parseInt((d3.select('#time').attr('width')).substring(0,4));
  var height = parseInt((d3.select('#time').attr('height')).substring(0,4));

  var parseTime = d3.timeParse("%d-%b-%y");

  var x = d3.scaleTime()
  .domain(d3.extent(totalBikes, function(d) { return d.date; }))
  .range([0, (width-(margin.left*4))]);

  var y = d3.scaleLinear()
  .domain([parseInt(totalBikes.maxTotal), 550])
  .range([margin.top, height-margin.bottom]);

  var xT = d3.scaleTime()
  .domain(d3.extent(weather, function(d) { return d.date; }))
  .range([0, (width-(margin.left*3))]);

  var yT = d3.scaleLinear()
  .domain([parseInt(weather.maxTemperature), 0])
  .range([margin.top, height-margin.bottom]);

  var bisectDate = d3.bisector(function(d) { return d.date; }).left;

  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(parseInt(d.total_bikes)); })
      .defined(function(d) { return parseInt(d.total_bikes) != 0;});

      var templine = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return yT(Math.round(d.temp)); })
      .defined(function(d) { return parseInt(d.temp) != (-273);});


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

  g.append("g")
    .attr('height', '100%')
    .attr('class', 'axis')
    .attr("transform", "translate(" + (width-(margin.left*2)) + ",0)")
    .call(d3.axisRight(yT).ticks(5));

  g.append("path")
    .data([weather])
    .attr("class", "tempLine")
    .attr("transform", "translate(" + margin.left*2 + ",0)")
    .attr("d", templine);

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
    .style("opacity", "1")
    .attr("d", function() {
        var d = "M" + (margin.left*2) + "," + (height-(margin.top*1.5));
        d += " " + (margin.left*2) + "," + margin.top;
        return d;
    });

    x0 = x.invert(globalMouse[0]-(margin.left*2));
    index = bisectDate(totalBikes, x0, 0);

  var verticalLine = mouseG.append('rect') // append a rect to catch mouse movements on canvas
      .attr('width', width-margin.right) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('x', margin.left*2);

    var playPushed = false;
var pausePushed = false;

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
        var x0 = x.invert(d3.mouse(this)[0]-(margin.left*2));
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

        graphTooltip.html('<strong>' + totalBikes[i].displayTime + ' Uhr</strong></br></br><strong>Freie Fahrräder:</br><strong>' + totalBikes[i].total_bikes + '</strong></br></br><strong>Temperatur:</br><strong>' + weather[i].temperature + '</strong>')
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 60) + 'px');
  })
  .on('click', function(){
    pausePushed = true;
    playPushed = false;
    var mouse = d3.mouse(this);
    globalMouse = mouse;
    x0 = x.invert(d3.mouse(this)[0]-(margin.left*2));
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
      if(d3.event.keyCode === 39){
        $("#buttonForwards").d3Click();
      }else if(d3.event.keyCode === 37){
        $("#buttonBackwards").d3Click();
      }else if(d3.event.keyCode === 32){
          $("#buttonPlayOrPause").d3Click();
      }else if(d3.event.keyCode === 82){
        $("#buttonReturn").d3Click();
      }
    });

  playPauseButton = d3.select('#buttonPlayOrPause');
returnButton = d3.select('#buttonReturn');
backwardsButton = d3.select('#buttonBackwards');
forwardsButton = d3.select('#buttonForwards');

  playPauseButton.on('click', function(){
      if(!playPushed && !pausePushed){
        playPushed = true;
        console.log('Play button pushed.');
      } else if(pausePushed){
        pausePushed = false;
        playPushed = true;
        console.log('Play button pushed after Pause.');
      } else if(playPushed){
        pausePushed = true;
        playPushed = false;
        console.log('Pause button pushed.');
      }

      if(playPushed){
        var interval = setInterval(function(){
            if(playPushed && !pausePushed){
            x0 = x.invert(globalMouse[0]-(margin.left*2));
              index = bisectDate(totalBikes, x0, 0);

                var mousemovement = 0;
                var noUpdate = false;
                  
                if(index === (totalBikes.length-1)){
                    pausePushed = true;
                    playPushed = false;
                }else{
                  index++;
                  mousemovement = globalMouse[0]+1.25;
                  globalMouse[0]+=1.5;
                }

                d3.select('.selected-line')
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

              if(!playPushed){
              clearInterval(interval);
            }
          } else {
            if(!playPushed){
              clearInterval(interval);
            }
          }
        }, 2500);
      }
  })

returnButton.on('click', function(){
  pausePushed = true;
  playPushed = false;

  globalMouse[0] = startMouse[0];

  index = 0;

  d3.select('.selected-line')
  .attr("d", function() {
        var d = "M" + (margin.left*2) + "," + (height-(margin.top*1.5));
        d += " " + (margin.left*2) + "," + margin.top;
        return d;
    });

  queryTimestamp = totalBikes[index].b_time;
                var postbody = {
                    'time': queryTimestamp
                }

  initiateHexagons(postbody);
})

forwardsButton.on('click', function(){
  pausePushed = true;
  playPushed = false;

  if(index != totalBikes.length-1){
    index++;
  mousemovement = globalMouse[0]+1;
  globalMouse[0]++;

  d3.select('.selected-line')
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
})

backwardsButton.on('click', function(){
  pausePushed = true;
  playPushed = false;

  if(index != 0){
    index--;
    mousemovement = globalMouse[0]-1;
    globalMouse[0]--;

    d3.select('.selected-line')
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
})

  callback();
}
