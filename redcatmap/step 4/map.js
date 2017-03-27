// Define global var

var score16;

// Define a variable holding the current key to visualize on the map.
var currentKey = score16;

// Dimensions for map container

var width  = 900,
    height = 600;

//Create SVG

var svg = d3.select('#map').append('svg')
  .attr('width', width)
  .attr('height', height);

//Define a Georgraphic Projection

var projection = d3.geo.mercator()
  .scale(1);

// Prepare path object to apply projection to

var path = d3.geo.path()
  .projection(projection);

//Object to ease access to data later on
var dataById = d3.map();

//Creating a quantized scale
var quantize = d3.scale.quantize()
    .range(d3.range(9).map(function(i) { return 'q' + i + '-9'; }));


//Load GeoJSON data

d3.json('data/ug_districts2.geojson', function(error, features) {

  //Getting the scale and center parameters from features
  var scaleCenter = calculateScaleCenter(features);

  //Apply and translate parameters
  projection.scale(scaleCenter.scale)
            .center(scaleCenter.center)
            .translate([width/2, height/2]);

  d3.csv('data/coverage16_v4.csv', function(data) {


    //Mapping to easily access data by Id
    dataById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(data);

    // Set the domain of the values (the minimum and maximum values of
    // all values of the current key) to the quantize scale.
    quantize.domain([
      d3.min(data, function(d) { return getValueOfData(d); }),
      d3.max(data, function(d) { return getValueOfData(d); })
    ]);


    // adding a 'g' grouping element to svg for styling later
    svg.append('g')
      .attr('class', 'features YlGnBu')
      .selectAll('path')
      .data(features.features) //Also do a data bind in typical d3 style
      .enter()
      .append('path')
      .attr('class', function(d) {
        return quantize(getValueOfData(dataById[d.properties.idug]));
      })
      .attr('d', path);


console.log(features);

  }); /*end of d3.csv*/

}); /*end of d3.json*/

// function for dynamic scaling and centering of map

function calculateScaleCenter(features) {
  var bbox_path = path.bounds(features),
      scale = 0.95 / Math.max(
        (bbox_path[1][0] - bbox_path[0][0]) / width,
        (bbox_path[1][1] - bbox_path[0][1]) / height
        );

  var bbox_feature = d3.geo.bounds(features),
      center = [
      (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
      (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

  return {
    'scale':scale,
    'center':center
  };
}

// function to access value of data
function getValueOfData(d) {
  return +d[currentKey];
}