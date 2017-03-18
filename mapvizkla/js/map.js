//Specify Dimensions
var mapWidth = 500,
    mapHeight = 500;

// currentKey refernce to csv column to add color
var currentKey = "pop_13"

//Number formatting
//
//Create a function that take a number, adds commas for thousands,
//and removes decimal values, e.g. 1234567.89 --> 1,234,567
//
var valueFormat = d3.format(",");

// Logic to handle hover event when its firedup
var hoveron = function(d) {
/*      console.log('d', d, 'event', event);*/
      var div = document.getElementById('tooltip');
      div.style.left = event.pageX + 'px';
      div.style.top = event.pageY + 'px';

      
      //Fill yellow to highlight
      d3.select(this)
        .style("fill", "white");

      //Show the tooltip
      d3.select("#tooltip")
        .style("opacity", 1);

      //Populate name in tooltip
      d3.select("#tooltip .name")
        .text(d.properties.UBOS_PN_13);

      //Populate value in tooltip
      d3.select("#tooltip .value")
        .text(valueFormat(d.properties.currentKey) + " " +"peeps"); 
}

var hoverout = function(d) {

  //Restore original choropleth fill
  d3.select(this)
    .style("fill", function(d) {
      var value = d.properties.currentKey;
      if (value) {
        return color(value);
      } else {
        return "#ccc";
      }
    });

  //Hide the tooltip
  d3.select("#tooltip")
    .style("opacity", 0);

}


// Create a SVG element in the map container and give it some
// dimensions.
var svg = d3.select('#map').append('svg')
  .attr('width', mapWidth)
  .attr('height', mapHeight);

var mapFeatures = svg.append('g') // add a <g> element to the SVG element and give it a class to style later
    .attr('class', 'features');


// Define the zoom and attach it to the map
var zoom = d3.behavior.zoom()
  .scaleExtent([1, 10])
  .on('zoom', doZoom);
svg.call(zoom);

// Define a geographical projection and scale the map 
var projection = d3.geo.mercator()
  .scale(1)

// Prepare a path object and apply the projection to it.
var path = d3.geo.path()
  .projection(projection);

// We prepare an object to later have easier access to the data.
var dataById = d3.map();



//Define quantize scale to sort data values into buckets of color
//Colors by Cynthia Brewer (colorbrewer2.org), 9-class YlGnBu

var color = d3.scale.quantize()
          //.range(d3.range(9),map(function(i) { return 'q' + i + '-9';}));
        .range(['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']);


// Load in coverage score data
d3.csv("data/Kampala-v3.csv", function(data) {

  //Set input domain for color scale
  color.domain([
    d3.min(data, function(d) { return +d[currentKey]; }),
    d3.max(data, function(d) { return +d[currentKey]; })

    ]);
  // This maps the data of the CSV so it can be easily accessed by
  // the ID of the parish, for example: dataById[2196]
  dataById = d3.nest()
    .key(function(d) { return d.id; })
    .rollup(function(d) { return d[0]; })
    .map(data);

  // Load the features from the GeoJSON.
  d3.json('data/kla_parishes-v2.geojson', function(error, json) {



    // Get the scale and center parameters from the features.
    var scaleCenter = calculateScaleCenter(json);
    //console.log(features)

    // Apply scale, center and translate parameters.
    projection.scale(scaleCenter.scale)
      .center(scaleCenter.center)
      .translate([mapWidth/2, mapHeight/2]);

    // Merge the coverage data amd GeoJSON into a single array
    // Also loop through once for each coverage score data value

    for (var i=0; i < data.length ; i++ ) {

      // Grab parish name
      var dataparish = data[i].parish;

      //Grab data value, and convert from string to float
      var dataValue = +data[i][currentKey];

      //Find the corresponding parish inside GeoJSON
      for (var j=0; j < json.features.length ; j++ ) {

        // Check the parish reference in json
        var jsonparish = json.features[j].properties.UBOS_PN_13;

        if (dataparish == jsonparish) {

          //Copy the data value into the GeoJSON
          json.features[j].properties.currentKey = dataValue;

          //Stop looking through JSON
          break;
        }
      }
    }
      



    mapFeatures.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .on("mouseover", hoveron)
        .on("mouseout", hoverout)
        .style("cursor", "pointer")
        .style("stroke", "#777")        
        .style("fill", function(d) {
       
          // Get data value
          
          var value = d.properties.currentKey;

/*          console.log(value);*/

          if (value) {
            // If value exists ...
            return color(value);
          } else {
            // If value is undefines ...
            return "#ccc";
          }
        
        });


  }); //End of d3.json

}); //End of d3.csv



 /* 
 A way to Dynamically scale and position the map
 Thanks to: http://stackoverflow.com/a/17067379/841644
 
 */
function calculateScaleCenter(features) {
  // Get the bounding box of the paths (in pixels!) and calculate a
  // scale factor based on the size of the bounding box and the map
  // size.
  var bbox_path = path.bounds(features),
      scale = 0.95 / Math.max(
        (bbox_path[1][0] - bbox_path[0][0]) / mapWidth,
        (bbox_path[1][1] - bbox_path[0][1]) / mapHeight
      );

  // Get the bounding box of the features (in map units!) and use it
  // to calculate the center of the features.
  var bbox_feature = d3.geo.bounds(features),
      center = [
        (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
        (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

  return {
    'scale': scale,
    'center': center
  };
}

// Function for zooming
function doZoom() {
  mapFeatures.attr("transform",
    "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")")
  // Keep the stroke width proportional. The initial stroke width
  // (0.5) must match the one set in the CSS.
  .style("stroke-width", 0.5 / d3.event.scale + "px");
}

// Function to get id of feature 

function getIdOfFeature(f) {
  return f.properties.idp;
}



