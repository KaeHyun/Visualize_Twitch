class SortBar {
    //SVG 요소 설정
    margin = { top: 10, right: 10, bottom: 40, left: 40 };
  
    constructor(svg, data) {
      this.svg = svg;
      this.data = data;
      this.width = 700;
      this.height = 700;
    }
  
    initialize() {
      this.svg = d3.select("#sortbarchart");
      this.container = this.svg.append("g");
      this.xAxis = this.svg.append("g");
      this.yAxis = this.svg.append("g");
      this.legend = this.svg.append("g");
  
      this.yScale = d3.scaleBand();
      this.xScale = d3.scaleLinear();
  
      this.svg
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
  
      this.container.attr(
        "transform",
        `translate(${this.margin.left}, ${this.margin.top})`
      );
    }
  
    update(topVal, checked) {
      console.log(checked);
      //내림차순 정렬
      const sortedData = [...this.data].sort(
        (a, b) =>
          parseInt(b["Average viewers"], 10) - parseInt(a["Average viewers"], 10)
      );
  
      //top-n 까지 slice
      const slicedData = sortedData.slice(0, topVal);
      console.log(slicedData);
  
      this.yScale
        .domain(slicedData.map((d) => d.Channel))
        .range([0, this.height])
        .padding(0.3);
      const xMin = d3.min(slicedData, (d) => parseInt(d["Average viewers"]));
      const xMax = d3.max(slicedData, (d) => parseInt(d["Average viewers"]));
      this.xScale.domain([xMin - 3000, xMax]).range([0, this.width]);
  
      this.xAxis
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisBottom(this.xScale));
  
      this.yAxis
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft(this.yScale))
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .attr("text-anchor", "end")
        .attr("dx", "0.5em")
        .attr("dy", "0.25em")
        .style("font-size", "6.8px")
        .style("font-weight", "bold");
  
      const bars = this.container
        .selectAll(".barGroup")
        .data(slicedData, (d) => d.Channel);
  
      bars.exit().remove();
  
      const newBars = bars
        .enter()
        .append("g")
        .attr("class", "barGroup")
        .merge(bars)
        .attr("transform", (d) => `translate(0, ${this.yScale(d.Channel)})`);
  
      newBars
        .selectAll("rect.avg.views")
        .data((d) => [d])
        .join("rect")
        .attr("class", "avg views")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", (d) => this.xScale(d["Average viewers"]))
        .attr("height", this.yScale.bandwidth() / 2)
        .attr("fill", "pink");
    }
  }
  