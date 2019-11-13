// D3 Times
let svgWidth= 960;
let svgHeight = 500;

let margin = { top: 20, right: 40, bottom: 60, left: 100 };

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart
let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let chart = svg.append("g");

// Append a div to the body, assign it a class
d3.select("#scatter")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("../StarterCode/assets/data/data.csv").then(function(Data) {
  Data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Create scale functions
  let yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  let xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([8, d3.max(Data, function(data) {
    return +data.poverty;
  })]);
  yLinearScale.domain([0, d3.max(Data, function(data) {
    return +data.healthcare * 1.2;
  })]);

  let toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var abbrName = data.abbr;
      var povertyRate = +data.poverty;
      var lacksHealthcare = +data.healthcare;
      return (abbrName + "<br> Poverty Rate: " + povertyRate + "<br> Lacks Healthcare: " + lacksHealthcare);
    });

  svg.call(toolTip);

  let elem = chart.append("g").selectAll("g")
    .data(Data)
    
  let elemEnter =elem.enter()
      .append("g")
      .attr("transform", function (data, index) {
        return "translate(" + xLinearScale(data.poverty) + " ," + yLinearScale(data.healthcare) + ")"
      });
      elemEnter.append("circle")
        .attr("r", "15") 
        .attr("fill", "LightBlue")
        .on("click", function(data) {
        toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });
      elemEnter.append("text")
        //.attr("dx", function(data, index){return -12;})
        .attr("dy", function(data, index){return 5;})
        .attr("text-anchor", "middle")
        .text(function(data, index){return data.abbr;})     
        .attr("font-size", 12)  
        .attr('fill', 'white');

  chart.append("g")
    .attr("transform", 'translate(0, ${height})')
    .call(bottomAxis);
  
  chart.append("g")
    .call(leftAxis);

  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2)- 60)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2 - 25) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("In Poverty (%)");
});