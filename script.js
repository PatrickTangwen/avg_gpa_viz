const assignment4 = () => {
  const quarters = "SP21,FA21,SP22,WI23,SP23".split(",");
  const gpa = "3.52,3.71,3.25,3.22,3.72".split(",");
  const instructors = "Berg-Kirkpatrick,Shang,Dasgupta,Dasgupta,Shang".split(
    ","
  );
  // always display the last five quarters
  const startIndex = Math.max(quarters.length - 5, 0); // Calculate the starting index
  const dataset = Array.from({ length: 5 }, (_, i) => ({
    x: quarters[startIndex + i],
    y: parseFloat(gpa[startIndex + i]), // Parse GPA values as floats
    z: instructors[startIndex + i],
  }));
  console.log(dataset);

  const width = 600;
  const height = 300;
  const padding = 60;

  const svg = d3.select("svg").attr("width", width).attr("height", height);

  let xScale = d3
    .scaleBand()
    .domain(
      dataset.map(function (d) {
        return d.x;
      })
    )
    .range([padding, width - padding])
    .padding(0.5);

  let xAxis = d3.axisBottom().scale(xScale);

  const yScale = d3
    .scaleLinear()
    .domain([0, 4]) // Adjusted domain for GPA
    .range([height - padding, padding]);

  const yAxis = d3.axisLeft().scale(yScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", `translate(0, ${height - padding})`);

  svg.append("g").call(yAxis).attr("transform", `translate(${padding}, 0)`);

  svg.select(".xAxis").transition().call(xAxis);

  const tooltip = d3
    .select("body")
    .append("tooltip") // Change element type to div
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("padding", "10px");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xScale(d.x);
    })
    .attr("y", function (d) {
      return yScale(d.y);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return height - padding - yScale(d.y);
    })
    .attr("fill", "skyblue")
    .attr("stroke", "none")
    .on("mouseover", function (event, d, i) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
      tooltip
        .html(
          `GPA: ${d.y}<br/>
          Quarter: ${d.x}<br/>
          Instructor: ${d.z}<br/>`
        ) // Add GPA value
        .style("opacity", 1)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("stroke", "none");
      tooltip.style("opacity", 0);
    });

  svg
    .selectAll(".gpa-label")
    .data(dataset)
    .enter()
    .append("text")
    .attr("class", "gpa-label")
    .attr("x", function (d) {
      return xScale(d.x) + xScale.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return yScale(d.y) - 5; // Adjust the vertical position as needed
    })
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d.y;
    })
    .attr("fill", "black")
    .style("font-family", "Poppins")
    .style("font-weight", "bold")
    .style("font-size", "13px");

  // Add x-axis label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 25)
    .attr("text-anchor", "middle")
    .text("Quarters")
    .style("fill", "black");

  // Add y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", padding - 35)
    .attr("text-anchor", "middle")
    .text("Avg GPA")
    .style("fill", "black");
};
