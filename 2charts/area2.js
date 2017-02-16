//Store width, height and margin in variables
var w = 600;
var h = 500;
var margin = {top: 40, right: 10, bottom: 20, left: 50};

// Scale the width and height
var xScale = d3.scale.linear()
                .range([0,w - margin.right - margin.left]);

var yScale = d3.scale.ordinal()
                .rangeRoundBands([margin.top, h - margin.bottom],0.2);

// Creat Axes i.e. xAxis and yAxis
var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

// Create SVG 
var barchart = d3.select("#area2")
			.append("svg")
			.attr("width", w)
			.attr("height", h);



// Entering data

d3.csv("data/div9_v2.csv", function(data) {

	data.sort(function(a, b) {
		return d3.descending(+a.avg, +b.avg)
	});
  //Setting a dynamic domain for the xScale based on Data
  xScale.domain([5
/*  	 d3.min(data, function(d) {
    return +d.avg; })*/, 

  	d3.max(data, function(d) {
    return +d.avg;
  }) ]);

  //Setting a dynamic domain for the yScale based on Data
  yScale.domain(data.map(function(d) { return d.district; } ));

  //Rendering the xAxis
  barchart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + (margin.left + 65) + "," + (h - margin.top + 20) + ")")
      .call(xAxis);

  //Rendering the yAxis
  barchart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (margin.left + 65)  +  ",0)") // Moving the axis to fit in district names
      .call(yAxis)
      .append("text")
	  .attr("x", margin.left - 65)
       .attr("y", margin.top - 5)
	  .style("font-size", "14")
	  .style("text-anchor", "start")
	  .text("Average failure rate (in %) over the last 5 years by district");


  // Rendering the rectangles
	var rects = barchart.selectAll("rect")
					.data(data)
					.enter()
					.append("rect");

    rects.attr("x", margin.left + 70) // Moving the x so district name can fit
	    .attr("y", function(d, i) {
	        return yScale(d.district);
	      })
	    .attr("width", function(d) {
	        return xScale(d.avg); 
	      })
	    .attr("height",yScale.rangeBand)
	    .attr("class", "barBase")
	    .append("title")
		.text(function(d) {
			return d.district + "'s failure rate over the last 5 years is " + d.avg + "%";

		});
	//rollover functionality
	barchart.selectAll("rect")
		
			.on("mouseover", function(d) {
		
			activeDistrict = d.district;
																					
			linechart.selectAll("g")
			.each(function(d) {
				if(d){
					if ( d.district == activeDistrict ){
// 									console.log(d3.select(this).select("path"));
						d3.select(this).select("path").classed("pathLight", true);
						
						var xPosition = wLine/2 + 35;
				        var yPosition = marginLine.top - 10;

				        linechart.append("text")
				        .attr("id", "hoverLabel")
				        .attr("x", xPosition)
				        .attr("y", yPosition)
				        .attr("text-anchor", "start")
				        .attr("font-family", "ff-nuvo-sc-web-pro-1,ff-nuvo-sc-web-pro-2, sans-serif") 
				        .attr("font-size", "20px")
				        .text( activeDistrict); 	
						
						return true;
														
					}
					else{
						return false;
				}
			}
		})
		})
		
		.on("mouseout", function() {
			
			d3.selectAll("path")
			.attr("class", "pathBase");
			
			d3.select("#hoverLabel").remove();
			 
	});




}); // end of d3.csv
  

