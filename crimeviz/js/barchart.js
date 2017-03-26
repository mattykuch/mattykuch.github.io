// Dimensions
var barWidth = 800,
	barHeight = 500;

// Create SVG
var svg = d3.select('#barchart').append('svg')
            .attr('height', barHeight)
            .attr('width', barWidth);

// Appending a group element 'g' to svg that will be used to render the axes
var g = svg.append('g')
	.attr("transform", "translate(60, 0)"); // Moving g to the right to make room for y axis

// Append 2 'g' elements for x and y axes

g.append('g')
   .attr('class', 'x axis')
   .attr('transform', 'translate(0, 450)');
g.append('g')
   .attr('class', 'y axis');

// Formats each row by converting 'case' column from string to a number
var parseRow = function(row) {
return {
  year: row.Year,
  case: parseFloat(row.Case)
}
};

// The function 'loadData()' below wraps d3.tsv to reload on a new dropdown selection

var loadData = function() {
	var metric = document.getElementById('metric').selectedOptions[0].value;
  	var dataFile = 'data/' + metric + '.tsv'
	d3.tsv(dataFile, parseRow, function(data) {

		var years = data.map(function(d) { return d.year }) // Extract years from data
		var x = d3.scale.ordinal() // The x dimension consist of categorical variables i.e. 'years', hence its scaled 'ordinally'
				.rangeRoundBands([0, 600], .1) // 0 to 400 so that it stretches the length of the svg width which is '500px'
				.domain(years) // setting the domain

		var cases = data.map(function(d) { return d.case })
	    var y = d3.scale.linear()
	            .range([450, 0])
	            .domain([0, d3.max(cases)])

		var rect = g.selectAll('.bar')
					.data(data);

		        rect.enter()
		           	.append('rect');

		        rect.exit().remove();

		rect.attr('class', 'bar')
		    .attr('width', x.rangeBand())
		    .attr('height', function(d) { return 450 - y(+d.case)})
		    .attr('x', function(d) { return x(d.year) })
		    .attr('y', function(d) { return y(+d.case) }) // Cool tip, if you change y(d.case) to x(d.case) -- it flips the chart! ;-)

		var xAxis = d3.svg.axis()
	                .scale(x)
	                .orient('bottom')
		d3.select('.x.axis').call(xAxis)


		var yAxis = d3.svg.axis()
	                .scale(y)
	                .orient('left')
	                .tickFormat(d3.format('.0'));
		d3.select('.y.axis').call(yAxis)

		//X-axis label
		  svg.append("text")
		  .attr("class", "x label")
		  .attr("text-anchor", "end")
		  .attr("x", barWidth - 120)
		  .attr("y", barHeight - 25)
		  .text("Year");

		  // Y-axis label
		  svg.append("text")
			  .attr("class", "y label")
			  .attr("text-anchor", "end")
			  .attr("x", -barHeight/2.5)
			  .attr("y", 5)
			  .attr("dy", "0.75em")
			  .attr("transform", "rotate(-90)")
			  .text("No. of Cases");

		// Logic to sort and add transitions while sorting

		var yearIndex = function(yearName) {
	    var years = {
	      2004: 1, 2005: 2, 2006: 3, 2007:  4, 2008:  5, 2009:  6,
	      2010: 7, 2011: 8, 2012: 9, 2013: 10, 2014: 11
	    };
	    return years[yearName];
	  }

	  d3.select('input').on('change', function() {
	    var sortByCase = function(a, b) { return b.case - a.case; };
	    var sortByYear = function(a, b) { return d3.ascending(yearIndex(a.year), yearIndex(b.year)); };
	    var sortedYears = data.sort(this.checked ? sortByCase : sortByYear)
	                       .map(function(d) { return d.year; })
	    x.domain(sortedYears)

	    var transition = svg.transition().duration(750); // Set tranisition parameters
	    var delay = function(d, i) { return i * 50; }; // set delay parameters

	    transition.selectAll(".bar") // Transition through animation all rectangles that have class "bar"
	        .delay(delay)
	        .attr("x", function(d) { return x(d.year); }); //position the rects on the x-axis to new position

	    transition.select(".x.axis") // Transition through animation the x-axis that has class 'x.axis'
	        .call(xAxis)
	      .selectAll("g")
	        .delay(delay);
	  })
	})
}
loadData()