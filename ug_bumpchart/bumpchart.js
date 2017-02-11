


var margin = {top: 20, right: 250, bottom: 50, left: 30},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var speed = 2000;
var valueFormat = d3.format("");

var x = d3.scale.linear()
    .range([0,width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .1);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .ticks(13)
    .orient("bottom")
    .tickFormat(valueFormat)
    ;

var xAxis1 = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .ticks(13)
    .orient("top")
    .tickFormat(valueFormat)
    ;


var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(-width)
    .tickPadding(10)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.position) + y.rangeBand()/2; });

var svg = d3.select('#area1').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var clip = svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", 0)
    .attr("height", height);

var year; // As a Global 

d3.json("data/ugo.txt", function(error, data) { 
  
  y.domain(d3.range(1,d3.max(data.standing, function(school) { return d3.max(school.rank, function(d) { return d.position; }); }) + 1 ).reverse());
  //xAxis.tickValues(data.standing[0].rank.map(function(d) { return d.year; }));
  x.domain(d3.extent(data.standing[0].rank.map(function(d) { return d.year; })));

  //x.domain([2000, 2015]);
  
  //set y axis
  svg.append("g")
  .attr("class", "y axis")
    .call(yAxis);

  //set bottom axis position
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(" + 0 + "," + 526  + ")")
    .call(xAxis);

  //set top axis
  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis1);

  var school = svg.selectAll(".school")
      .data(data.standing)
      .enter().append("g")
      .attr("class", "school");

  var path = school.append("path")
      .attr("class", "line")
      .style("stroke", function(d) { return d.color; })
      .style("stroke-width", 2)
      .style("fill","none")
      .attr("clip-path", function(d) { return "url(#clip)"; })
      .attr("d", function(d) { return line(d.rank); })
      .on("mouseover", function (d) {
        school.style("opacity",0.2);
        school.filter(function(path) {return path.schoolName === d.schoolName; }).style("opacity",1);
      })
      .on("mouseout", function (d) { school.style("opacity",1); })
;

  var circleStart = school.append("circle")
      .attr("cx", function(d) { return x(d.rank[0].year); })
      .attr("cy", function(d) { return y(d.rank[0].position) + y.rangeBand()/2; })
  //    .style("fill", function(d) { return d.color; })
      .attr("r", 6)
      .style("stroke", function(d) { return d.color; })
      .style("stroke-width", 4)
      .style("fill", "white")
      .on("mouseover", function (d) {
        school.style("opacity",0.2);
        school.filter(function(path) {return path.schoolName === d.schoolName; }).style("opacity",1);
      })
      .on("mouseout", function (d) { school.style("opacity",1); })

  
  var circleEnd = school.append("circle")
      .attr("cx", function(d) { return x(d.rank[0].year); })
      .attr("cy", function(d) { return y(d.rank[0].position) + y.rangeBand()/2; })
     // .style("fill", function(d) { return d.color; })
      .attr("r", 6)
      .style("stroke", function(d) { return d.color; })
      .style("stroke-width", 4)
      .style("fill", "white")
      .on("mouseover", function (d) {
        school.style("opacity",0.2);
        school.filter(function(path) {return path.schoolName === d.schoolName; }).style("opacity",1);
      })
      .on("mouseout", function (d) { school.style("opacity",1); })
      

  // text label for the x axis
  svg.append("text")      
        .attr("x", width / 2 )
        .attr("y",  height + (margin.bottom/1.5))
        .attr("style","font-size:16px;") // to bold title
        .style("text-anchor", "middle")
        .text("Year");
    


  var label = school.append("text")

      .attr("transform", function(d) { return "translate(" + x(d.rank[0].year) + "," + (y(d.rank[0].position) + y.rangeBand()/2) + ")"; })
      .attr("x", 8)
      .attr("dy", ".31em")
      .on("mouseover", function (d) {
        school.style("opacity",0.2);
        school.filter(function(path) {return path.schoolName === d.schoolName; }).style("opacity",1);
      })
      .on("mouseout", function (d) { school.style("opacity",1); })
      .style("cursor","pointer")
      .style("fill", function(d) { return d.color; })
      .style("font-weight", "bold")
      .text(function(d) { return ""+ d.rank[0].position + " " + d.schoolName; });
//   .text(function(d) { return ""+ d.rank[0].position + " " + d.schoolName; });

   
  var year = 1;


  var transition = d3.transition()
    .duration(speed)
    .each("start", function start() {

      label.transition()
        .duration(speed)
        .ease('linear')
        .attr("transform", function(d) { return "translate(" + x(d.rank[year].year) + "," + (y(d.rank[year].position) + y.rangeBand()/2) + ")"; })
        .text(function(d) { return  " " +  " " + d.schoolName; });
  
      circleEnd.transition()
        .duration(speed)
        .ease('linear')
        .attr("cx", function(d) { return x(d.rank[year].year); })
        .attr("cy", function(d) { return y(d.rank[year].position) + y.rangeBand()/2; });

      clip.transition()
        .duration(speed)
        .ease('linear')
        .attr("width", x((year*2000)+1))
        .attr("height", height);
      
      year+=1;

      if (year !== data.standing[0].rank.length) transition = transition.transition().each("start", start);
     
    });

});