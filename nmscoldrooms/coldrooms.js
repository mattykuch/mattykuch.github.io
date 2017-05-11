var itemSize = 22,
      cellSize = itemSize - 1,
      margin = {top: 20, right: 20, bottom: 20, left: 20};
      
  var width = 450 - margin.right - margin.left,
      height = 550 - margin.top - margin.bottom;

  var formatDate = d3.time.format("%Y-%m-%d");

  d3.csv('crdata.csv', function ( response ) {

    var data = response.map(function( item ) {
        var newItem = {};
        newItem.room = item.Name;
        newItem.month = item.Month;
        newItem.value = item.MKT;
        newItem.min = item.Min;
        newItem.max = item.Max;

        return newItem;
    })

    var x_elements = d3.set(data.map(function( item ) { return item.month; } )).values(),
        y_elements = d3.set(data.map(function( item ) { return item.room; } )).values();

    var xScale = d3.scale.ordinal()
        .domain(x_elements)
        .rangeBands([0, x_elements.length * itemSize]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("top");

    var yScale = d3.scale.ordinal()
        .domain(y_elements)
        .rangeBands([0, y_elements.length * itemSize]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("left");

    var colorScale = d3.scale.threshold()
        .domain([-100, 2, 3 , 3.5 , 4 , 4.5 , 5 , 5.5, 6.5 , 8, 100 ]) 
        //.domain(d3.extent(data, function(d) { return value; }))
        .range(["#2c7bb6","#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#e76818", "#d7191c", "#d7191c"]); //Blue (Freeze Excursion), Green (Within Range), Red (Heat Excursion)

    // Configuring Tooltip
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

          //Populate Room Name in boxtip
          d3.select("#boxtip .Name")
            .text(d.room);

          //Populate Min temp in boxtip
          d3.select("#boxtip .Min")
            .text("Min:" + " " + d.min);

          //Populate Max temp in boxtip
          d3.select("#boxtip .Max")
            .text("Max:" + " " + d.max);

          //Populate MKT in boxtip
          d3.select("#boxtip .MKT")
            .text("MKT:" + " " + d.value); 
    }

    var boxout = function(d) {

      //Restore original fill
      d3.select(this)
        .style("fill", function(d) {
              d3.select(this)
                  .attr('fill', function(d) { return colorScale(d.value); });
          });

      //Hide the boxtip
      d3.select("#boxtip")
        .style("opacity", 0);

    }    


    var svg = d3.select('#coldmap')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var cells = svg.selectAll('rect')
        .data(data)
        .enter().append('g').append('rect')
        .attr('class', 'cell')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('y', function(d) { return yScale(d.room); })
        .attr('x', function(d) { return xScale(d.month); })
        .attr('fill', function(d) { return colorScale(d.value); })
        .on('mouseover', boxon)
        .on('mouseout', boxout);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal');

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start")
        .attr("dx", ".8em")
        .attr("dy", ".5em")
        .attr("transform", function (d) {
            return "rotate(-65)";
        });

    //Title label
    svg.append("g")
        .append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .style("font-size", 22 + "px")
        .attr("x", 5)
        .attr("y", -100)
        .text("Cold Rooms");

    //Set up Month axis label
    svg.append("g")
        .append("text")
        .attr("class", "x title")
        .attr("text-anchor", "end")
        .attr("x", 200)
        .attr("y", -50)
        .text("Month of the Year");

    // Coldrooms label
    svg.append("text")
      .attr("class", "y title")
      .attr("text-anchor", "end")
      .attr("x", -height/5 )
      .attr("y", -75)
      .attr("dy", "0.75em")
      .attr("transform", "rotate(-90)")
      .text("Cold Rooms");


    //Configuring linear Gradient  

    //Append a defs (for definition) element to your SVG
    var defs = svg.append("defs");

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");

    //Append multiple color stops by using D3's data/enter step
    linearGradient.selectAll("stop") 
        .data([                             
            {offset: "0%", color: "#2c7bb6"}, 
            {offset: "12.5%", color: "#00a6ca"},  
            {offset: "25%", color: "#00ccbc"}, 
            {offset: "37.5%", color: "#90eb9d"}, 
            {offset: "50%", color: "#ffff8c"}, 
            {offset: "62.5%", color: "#f9d057"}, 
            {offset: "75%", color: "#f29e2e"},      
            {offset: "87.5%", color: "#e76818"},        
            {offset: "100%", color: "#d7191c"}    
          ])                  
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })   
        .attr("stop-color", function(d) { return d.color; });

    //Draw the rectangle and fill with gradient
    svg.append("rect")
        .attr('class', 'scaleGradient')
        .attr("width", 300)
        .attr("height", 20)
        .attr("x",0)
        .attr("y", height - 30)
        .style("fill", "url(#linear-gradient)");

    //Low Temperature label - 2C
    svg.append("g")
        .append("text")
        .attr("class", "lowtemp")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", height )
        .text("2C");

    //High Temperature label - 8C
    svg.append("g")
        .append("text")
        .attr("class", "hightemp")
        .attr("text-anchor", "end")
        .attr("x", 318)
        .attr("y", height )
        .text("8C");


  });
