// After position the annotation, run `copy(annotations)` in the browser's
// console and paste over this array:
var annotations = [
  {
    "cx": 791,
    "cy": 244,
    "r": 19,
    "text": "Anne Kansiime is clearly an outlier.",
    "textWidth": 140,
    "textOffset": [
      -226,
      29
    ]
  }
];

var margin = {top: 30, right: 30, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#mainchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var valueFormat = d3.format(",");

// Logic to handle hover event when its firedup
var boxon = function(d) {
/*      console.log('d', d, 'event', event);*/
      var div = document.getElementById('boxtip');
      div.style.left = event.pageX + 'px';
      div.style.top = event.pageY + 'px';

      
      //Fill white to highlight
      d3.select(this)
        .style("fill", "white");

      //Show the boxtip
      d3.select("#boxtip")
        .style("opacity", 1);

      //Populate rank in boxtip
      d3.select("#boxtip .rank")
        .text("No." + d.rank +":" + " " + valueFormat(d.local2017) + " " + "Ugandan Fans");

      //Populate name in boxtip
      d3.select("#boxtip .name")
        .text(d.page);

      //Populate value in boxtip
      d3.select("#boxtip .value")
        .text(d.comment); 
}

var boxout = function(d) {

  //Restore original fill
  d3.select(this)
    .style("fill", function(d) {
          d3.select(this)
              .attr('fill', function(d) { return color(d.category); });
      });

  //Hide the boxtip
  d3.select("#boxtip")
    .style("opacity", 0);

}

// Adding Annotations

var ringNote = d3.ringNote()
  .draggable(false);

d3.csv("data/totalLocal_v1.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.total2017 = +d.total2017;
    d.local2017 = +d.local2017;
  });


  x.domain(d3.extent(data, function(d) { return d.total2017; })).nice();
  y.domain(d3.extent(data, function(d) { return d.local2017; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Total Fans");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Ugandan Fans")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return (d.pctlocal)/5; })
      .attr("cx", function(d) { return x(d.total2017); })
      .attr("cy", function(d) { return y(d.local2017); })
      .style("fill", function(d) { return color(d.category); })
      .on('mouseover', boxon)
      .on('mouseout', boxout)
      ;

  svg.append("g")
   .attr("class", "annotations")
   .call(ringNote, annotations);

   // Circle size legend

/*  var linearSize = d3.scale.linear().domain([0,10]).range([10, 30]);

  svg.append("g")
    .attr("class", "legendSize")
    .attr("transform", "translate(20, 40)");

  var legendSize = d3.legend.size()
    .scale(linearSize)
    .shape('circle')
    .shapePadding(15)
    .labelOffset(20)
    .orient('horizontal');

  svg.select(".legendSize")
    .call(legendSize);*/

  // Normal legend

  var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

