import { useEffect } from "react";
import * as d3 from "d3";
import "./App.css";
import data from "./data.json";

function App() {
  useEffect(() => {
    runD3();
  }, []);

  function runD3() {
    let svgElement = document.getElementById("svg");
    let dataset = data.data;

    const w = 850;
    const h = 550;
    const padding = 60;
    let years = data.data.map((d) => new Date(d[0]));

    let max = d3.max(years);
    const xScale = d3
      .scaleTime()
      .domain([d3.min(years, (d) => d), max])
      .range([0, w]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.max(dataset, (d) => d[1]), 0])
      .range([padding, h - padding]);

    if (!svgElement) {
      let svg = d3.select("section").append("svg").attr("id", "svg");

      // create a tooltip
      var tooltip = d3
        .select("section")
        .append("div")
        .append("pre")
        .attr("id", "tooltip");

      //
      let mouseover = function () {
        tooltip.style("opacity", 1);
      };
      let mousemove = function (d) {
        let date = d3.select(this).attr("data-date").split("-");
        let gdp = d3.select(this).attr("data-gdp");

        let year = date[0];
        let quarter =
          date[1] < 4 ? "Q1" : date[1] < 7 ? "Q2" : date[1] < 10 ? "Q3" : "Q4";
        tooltip
          .text(year + " " + quarter + "\n" + "$" + gdp + " Billion")
          .attr("data-date", d3.select(this).attr("data-date"))
          .style("left", d.clientX + "px")
          .style("top", d.clientY + "px");
      };

      let mouseleave = function () {
        tooltip.style("opacity", 0);
      };

      svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(years[i]))
        .attr("y", (d) => yScale(d[1]) - 30)
        .attr("width", 2.9)
        .attr("height", (d) => h - padding - yScale(d[1]))
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

      svg
        .append("g")
        .attr("transform", `translate(0, ${h - 90})`)
        .attr("id", "x-axis")
        .call(d3.axisBottom(xScale));

      svg
        .append("g")
        .attr("transform", `translate(0, -30)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale));

      svg
        .append("text")
        .text("United States GDP")
        .attr("x", 320)
        .attr("y", 50)
        .attr("id", "title")
        .style("font-size", "35px")
        .style("z-index", "10");
    }
  }

  return <section className="chart-container"></section>;
}

export default App;
