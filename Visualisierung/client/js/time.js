// Tooltip for the graph
var graphTooltip = d3.select("body").append("div")
    .attr("class", "graphTooltip")
    .style("opacity", 0);

var index = null;
var x0 = null;

// Starting point of the vertical line in the graph, which can be moved by the mouse
var startMouse = [30, 46];
var globalMouse = [30, 46];

/*
** Draws the line graph.
*/
function drawGraph(callback){
    // This allows us to simulate a click when pressing specific key (for key-board interaction). This reduces redundant code.
    jQuery.fn.d3Click = function () {
        this.each(function (i, e) {
            var evt = new MouseEvent("click");
            e.dispatchEvent(evt);
        });
    }

    // Setting the margins for the axes and lines
    var margin = {top: 10, right: 37, bottom: 20, left: 15};

    // Gets the width of the svg
    var width = parseInt((d3.select('#time').attr('width')).substring(0,4));
    var height = parseInt((d3.select('#time').attr('height')).substring(0,4));

    // Scale for the x-axis (total amount of available bikes).
    // This is also used for the red graph.
    var x = d3.scaleTime()
        .domain(d3.extent(totalBikes, function(d) { return d.date; }))
        .range([0, (width-(margin.left*4))]);

    // Scale for the left y-axis (total amount of available bikes).
    // This is also used for the red graph.
    var y = d3.scaleLinear()
        .domain([parseInt(totalBikes.maxTotal), 550])
        .range([margin.top, height-margin.bottom]);

    // Scale for the x-axis (temperature).
    // This is also used for the blue graph.
    var xT = d3.scaleTime()
        .domain(d3.extent(weather, function(d) { return d.date; }))
        .range([0, (width-(margin.left*3))]);

    // Scale for the right y-axis (temperature).
    // This is also used for the blue graph.
    var yT = d3.scaleLinear()
        .domain([parseInt(weather.maxTemperature), 0])
        .range([margin.top, height-margin.bottom]);

    // This is to get the index in the total bikes array when clicking on a specific time
    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    // Line depicting the total amount of bikes at a specific time
    var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(parseInt(d.total_bikes)); })
        .defined(function(d) { return parseInt(d.total_bikes) != 0;});

    // Line depicting the temperature at a specific time
    var templine = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return yT(Math.round(d.temp)); })
        .defined(function(d) { return parseInt(d.temp) != (-273);});

    // Groups the whole time chart
    var svg = d3.select('#time')
        .append("g")
        .attr('class', 'timeChart')
        .attr('width' , '100%')
        .attr('height', '100%');

    // Draws the background of the chart
    svg.append('rect')
        .attr('class', 'graphBackground')
        .attr('width' , '100%')
        .attr('height', '100%');

    // Group for the lines and axes
    var g = svg.append('g')
        .attr('class', 'timeG')
        .attr('width' , '100%')
        .attr('height', '100%');

    // Draws x-axis for time
    g.append("g")
        .attr('width', '100%')
        .attr('class', 'axis')
        .attr("transform", "translate(" + margin.left*2 + "," + (height-margin.bottom) + ")")
        .call(d3.axisBottom(x).ticks(30).tickFormat(d3.timeFormat("%b / %d")));

    // Draws left y-axis for available bikes
    g.append("g")
        .attr('height', '100%')
        .attr('class', 'axis')
        .attr("transform", "translate(" + margin.left*2 + ",0)")
        .call(d3.axisLeft(y).ticks(5));

    // Draws right y-axis for temperature
    g.append("g")
        .attr('height', '100%')
        .attr('class', 'axis')
        .attr("transform", "translate(" + (width-(margin.left*2)) + ",0)")
        .call(d3.axisRight(yT).ticks(5));

    // Draws blue line for temperature
    g.append("path")
        .data([weather])
        .attr("class", "tempLine")
        .attr("transform", "translate(" + margin.left*2 + ",0)")
        .attr("d", templine);

    // Draws red line for available
    g.append("path")
        .data([totalBikes])
        .attr("class", "line")
        .attr("transform", "translate(" + margin.left*2 + ",0)")
        .attr("d", valueline);

    // Group for vertical line for mouse interaction
    var mouseG = g.append("g") // this is the black vertical line to follow mouse
        .attr("class", "mouse-over-effects");

    // Vertical line for mouse interaction
    mouseG.append("path")
        .attr("class", "mouse-line")
        .style("stroke", "white")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    // Static vertical line for after mouse click
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

    // Appends a rect for mouse interactions
    var verticalLine = mouseG.append('rect') // append a rect to catch mouse movements on canvas
        .attr('width', width-margin.right) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .attr('x', margin.left*2);

    var playPushed = false;
    var pausePushed = false;

    x0 = x.invert(globalMouse[0]-(margin.left*2));
    index = bisectDate(totalBikes, x0, 0);

    // All the mouse interactions
    verticalLine.on('mouseout', function() { // on mouse out hide line and tooltip 
        d3.select('.mouse-line')
          .style("opacity", "0");
     
        graphTooltip.transition()
            .duration(500)
            .style('opacity', 0);
    })
    .on('mouseover', function() { // on mouse in show line 
        d3.select('.mouse-line')
            .style("opacity", "1");
        })
    .on('mousemove', function() { // mouse moving over canvas show line and tooltip
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
    .on('click', function(){ // mouse click, get index of total bikes and initiate reload of hexagons
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

    // Key interactions (they simulate mouse clicks to avoid redundant code)
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

    // When play button is pushed start automatic updating
    // When pause is pushed automatic updating but state stays the same
    playPauseButton.on('click', function(){
        if(!playPushed && !pausePushed){
            playPushed = true;
        } else if(pausePushed){
            pausePushed = false;
            playPushed = true;
        } else if(playPushed){
            pausePushed = true;
            playPushed = false;
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

    // Sets the state to starting state and updates hexagons
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

    // Moves one hour forwards and updates hexagons
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

    // Moves one hour backwards and updates hexagons
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