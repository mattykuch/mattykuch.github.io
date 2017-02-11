//Store width, height and margin in variables
var wLine = 550;
var hLine = 500;
var marginLine = {top: 40, right: 10, bottom: 20, left: 50};

//Set up date formatting and years
var dateFormat = d3.time.format("%Y");

// Scale the width and height
var xScaleLine = d3.time.scale()
                    .range([ marginLine.left, wLine - marginLine.right - marginLine.left ]);

var yScaleLine = d3.scale.linear()
                    .range([ marginLine.top, hLine - marginLine.bottom]);

// Creat Axes i.e. xAxis and yAxis
var xAxisLine = d3.svg.axis()
              .scale(xScaleLine)
              .orient("bottom")
              .ticks(5)
              .tickFormat(function(d) {
                return dateFormat(d);
              });

var yAxisLine = d3.svg.axis()
              .scale(yScaleLine)
              .orient("left");

// Setting x position for line labels
var xLabelLine = wLine - marginLine.right - marginLine.left;

// Configure line generator

var line = d3.svg.line()
    .x(function(d) {
      return xScaleLine(dateFormat.parse(d.year)); // come back here and replace "year"
    })
    .y(function(d) {
      return yScaleLine(+d.amount); // come back here and replace "amount"
    })

//Create an empty svg

var linechart = d3.select("#area1")
                .append("svg")
                .attr("width", wLine)
                .attr("height", hLine);


var dataset; // This is a Global variable

var activeDistrict; // Will be used for linked hovering

// Load in csv data 

d3.csv("data/div9.csv", function(data) {

  // Create new array of all years in timeline for linechart. Will be referenced later
  var years = [ "2011", "2012", "2013", "2014", "2015"];

  //Make dataset an empty array (for now) to hold our restructured dataset
  dataset = [];

  // Loop once for each row in data
  for (var i=0; i < data.length; i++) {

    //Create a new object with the district's name and empty array
    dataset[i] = {
      district: data[i].district,
      rate: []
    };

    //Loop through all the years 
    for (var j = 0; j < years.length; j++) {

      //If value is empty
      if (data[i][years[j]]) {
        //Add a new object to the Div 9 rate data array
        //for that district
        dataset[i].rate.push({
          year: years[j],
          amount: data[i][years[j]]

        }); // end of push( function
      } //end of if(
    } // end of for loop for years
  } // end of for loop for data

  // Set scale domains
  
  xScaleLine.domain([
    d3.min(years, function(d) {
      return dateFormat.parse(d);
    }),
    d3.max(years, function(d) {
      return dateFormat.parse(d);
    })
  ]);

  yScaleLine.domain([
    d3.max(dataset, function(d) {
      return d3.max(d.rate, function(d) {
        return +d.amount;
      });
    }),
    0
    ]);

  // Make a group for each district
  var groups = linechart.selectAll("g")
      .data(dataset)
      .enter()
      .append("g")
      .classed("national", function(d) {
        if (d.district == "UGANDA") return true;
        else return false;
      })
      .on("mouseover", function(d) {

        activeDistrict = d.district;

        // Setting positio for the district label
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

        d3.selectAll("rect")
        .classed("barLight", function(d) {
          if ( d.district == activeDistrict) return true;
          else return false;
        });

      }) // end of .on mouseover

      .on("mouseout", function() {
        d3.select("#hoverLabel").remove();

        d3.selectAll("rect")
        .attr("class", "barBase");

      }) // end of .on mouseout


  // Append a title with the district name (for easy tooltips)
      groups.append("title")
          .text(function(d) {
            return d.district;
          });

      //Within each group, create a new line/path,
      //binding just the div9 rate data to each one
      groups.selectAll("path")
        .data(function(d) {
          return [ d.rate ];
        })
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", line);

      //Axes
      linechart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (hLine - marginLine.bottom) + ")")
        .call(xAxisLine);
      
      linechart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (marginLine.left) + ",0)")
        .call(yAxisLine)
        .append("text")
        .attr("x", 0 - marginLine.left)
        .attr("y", marginLine.top - 10)
        .style ("text-anchor", "start")
        .text("% of candidates who obtained a Division 9 in ");

        //Labels for highlighted lines - probably better to wrap these into the line elements themselves 
        //with some logic for selecting the ones you want to highlight? Use anonymous function to match objects for highlighting?
        //National label
        linechart.append("text")
          .attr("transform", "translate(" + xLabelLine + ", " + yScaleLine(data[20][years[4]]) + ")")
          .attr("dy", ".15em")
          .attr("dx", ".25em")
          .attr("text-anchor", "start")
          .attr("class","labelNation")
          .text( + data[20][years[4]] );



});// end of d3.csv(

