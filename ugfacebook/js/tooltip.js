//Number formatting
//
//Create a function that take a number, adds commas for thousands,
//and removes decimal values, e.g. 1234567.89 --> 1,234,567
//
var valueFormat = d3.format(",");

// Logic to handle hover event when its firedup
var toolon = function(d) {
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
      d3.select("#tooltip .local")
        .text(valueFormat(d.local2017));

      //Populate value in tooltip
      d3.select("#tooltip .total")
        .text(valueFormat(d.total2017)); 
}


var toolout = function(d) {
    
    //Restore original fill
      d3.select(this)
        .style("fill", function(d) {
              d3.select(this)
                  .attr('fill', function(d) { return color(d.category); });
          });

      //Hide the tooltip
      d3.select("#tooltip")
        .style("opacity", 0);
}