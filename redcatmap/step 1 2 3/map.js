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

//Load GeoJSON data

d3.json('data/ug_districts2.geojson', function(error, features) {

  //Getting the scale and center parameters from features
  var scaleCenter = calculateScaleCenter(features);

  //Apply and translate parameters
  projection.scale(scaleCenter.scale)
            .center(scaleCenter.center)
            .translate([width/2, height/2]);


  // adding a 'g' grouping element to svg for styling later
  svg.append('g')
    .attr('class', features)
    .selectAll('path')
    .data(features.features) //Also do a data bind in typical d3 style
    .enter()
    .append('path')
    .attr('d', path);
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