function makeResponsive() {

  var svgWidth = 1000;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // Retrieve data from the CSV file and execute everything below
  d3.csv("assets/data/data.csv").then(function (statesData, err) {
    console.log(statesData);
    // parse data
    statesData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // xLinearScale 
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(statesData, d => d.poverty) + 1])
      .range([0, width]);

    // yLinearScale
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(statesData, d => d.healthcare)])
      .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(statesData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 15)
      .attr("fill", "blue")
      .attr("opacity", ".5")
      .attr("stroke", "grey")
      .attr("stroke-width", "1.5");

    // append text inside circles
    var text = chartGroup.select("g").selectAll("circle")
      .data(statesData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("dy", -396)
      .attr("fill", "grey")
      .attr("font-weight", "bold")
      .attr("font-size", "12px")

    // x axis label 
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .classed("axis-text", true)
      .text("In Poverty (%)")
      .attr("font-weight", "bold")

    // y axis label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2) - 50)
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Lacks Healthcare (%)")
      .attr("font-weight", "bold")

  }).catch(function (error) {
    console.log(error);
  });

}

makeResponsive();
