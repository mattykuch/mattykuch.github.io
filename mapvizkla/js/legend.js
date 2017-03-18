var legendWidth = 250,
    legendHeight = 200,
    boxmargin = 4,
    lineheight = 14,
    keyheight = 10,
    keywidth = 70,
    boxwidth = 2 * keywidth,
    formatPercent = d3.format(",.0f");
    
var margin = { "left": 20, "top": 10 };

var nineshadesofgold = [ '#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58' ];

var title = ['Color-Key'],
    titleheight = title.length*lineheight + boxmargin;
    
var x = d3.scale.linear()
    .domain([200, 63200]);
    
var quantize = d3.scale.quantize()
    .domain([200, 63200])
    .range(nineshadesofgold);
    
var ranges = quantize.range().length;

// return quantize thresholds for the key    
var qrange = function(max, num) {
    var a = [];
    for (var i=0; i<num; i++) {
        a.push(i*max/num);
    }
    return a;
}
   
var svg2 = d3.select("#legend").append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight);
    
// make legend 
var legend = svg2.append("g")
    .attr("transform", "translate ("+margin.left+","+margin.top+")")
    .attr("class", "legend");
    
legend.selectAll("text")
    .data(title)
    .enter().append("text")
    .attr("class", "legend-title")
    .attr("y", function(d, i) { return (i+1)*lineheight-2; })
    .text(function(d) { return d; })

// make legend box 
var lb = legend.append("rect")
    .attr("transform", "translate (0,"+titleheight+")")
    .attr("class", "legend-box")
    .attr("width", boxwidth)
    .attr("height", ranges*lineheight+2*boxmargin+lineheight-keyheight);

// make quantized key legend items
var li = legend.append("g")
    .attr("transform", "translate (8,"+(titleheight+boxmargin)+")")
    .attr("class", "legend-items");

li.selectAll("rect")
    .data(quantize.range().map(function(color) {
      var d = quantize.invertExtent(color);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
    .enter().append("rect")
    .attr("y", function(d, i) { return i*lineheight+lineheight-keyheight; })
    .attr("width", keywidth)
    .attr("height", keyheight)
    .style("fill", function(d) { return quantize(d[0]); });
    
li.selectAll("text")
    .data(qrange(quantize.domain()[1], ranges))
    .enter().append("text")
    .attr("x", 72)
    .attr("y", function(d, i) { return (i+1)*lineheight-2; })
    .text(function(d) { return ">" +" "+ formatPercent(d); });