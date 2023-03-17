// set the dimensions and margins of the graph
var margin = {top: 30, right: 0, bottom: 50, left: 50},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//Read the data
d3.csv("cleaned_data.csv", function(data) {

//   group the data: I want to draw one line per group
  var nested = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.city;})
    .entries(data);

  allKeys = nested.map(function(d){return d.key})

  var svg = d3.select("#my_dataviz")
    .selectAll("uniqueChart")
    .data(nested)
    .enter()
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

//   Add X axis 
  var x = d3.scaleLinear()
    .domain([1, 12.5])
    .range([ 0, width ]);
  svg
    .append("g")
    .attr("transform", "translate(0," + (height / 2) + ")")
    .call(d3.axisBottom(x).ticks(12));

//   Add Y axis
  var y = d3.scaleLinear()
    .domain([-12, 12])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5));

  // color palette
  var color = d3.scaleOrdinal()
    .domain(allKeys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#a89932','#a65628','#f781bf','#999999','#080808'])

  svg // drawing each plot line
    .append("path")
      .attr("fill", "none")
      .attr('class', 'lines')
      .attr("stroke", function(d){ return color(d.key) })
      .attr("stroke-width", 1.9)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(d.month_num); })
          .y(function(d) { return y(+d.variation); })
          (d.values)
      })

  svg // grapgh title with city name and unique color
    .append("text")
    .attr('class', 'graph-title')
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text(function(d){ return(d.key)})
    .style("fill", function(d){ return color(d.key) })

  svg // x-axis label
    .append('text')
    .attr('class', 'x-label')
    .text('Months of the Year')
    .attr('x', width / 2)
    .attr('y', height)
    .attr('text-anchor', 'middle')

  svg // y-axis label
    .append('text')
    .attr('class', 'y-label')
    .text('Degrees From Past Average')
    .attr('y', height / 2)
    .attr('x', 50)
    .attr('text-anchor', 'middle')
    .attr("transform", "translate(75,60)rotate(90)")
})

