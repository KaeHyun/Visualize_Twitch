class SortBar {
    //SVG 요소 설정
    margin = { top: 10, right: 10, bottom: 40, left: 40 };
  
    constructor(svg, tooltip, data) {
      this.svg = svg;
      this.data = data;
      this.width = 700;
      this.height = 700;
      this.tooltip = tooltip;
    }
  
    initialize() {
      this.svg = d3.select("#sortbarchart");
      this.container = this.svg.append("g");
      this.xAxis = this.svg.append("g");
      this.yAxis = this.svg.append("g");
      this.legend = this.svg.append("g");
  
      this.yScale = d3.scaleBand();
      this.xScale = d3.scaleLinear();

      this.tooltip = d3.select(this.tooltip);
  
      this.svg
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
  
      this.container.attr(
        "transform",
        `translate(${this.margin.left}, ${this.margin.top})`
      );

      // 범례 생성
    const legendData = [
        { label: "Partnered", color: "#D8CEF6" },
        { label: "Not Partnered", color: "pink" }
      ];
    
    const legendGroup = this.legend
      .selectAll(".legend")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);
    
    legendGroup
      .append("rect")
      .attr("x", this.width-70)
      .attr("y", this.height-5)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => d.color);

    legendGroup
      .append("text")
      .attr("x", this.width+50)
      .attr("y", this.height)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text((d) => d.label);
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
        .transition() // 트랜지션 시작
        .duration(500) // 애니메이션 지속 시간 설정
        .call(d3.axisBottom(this.xScale));
  
      this.yAxis
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
        .transition() // 트랜지션 시작
        .duration(500) // 애니메이션 지속 시간 설정
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
        .transition() // 트랜지션 시작
        .duration(500) // 애니메이션 지속 시간 설정
        .attr("fill", (d) => (checked && d.Partnered === "True" ? "#D8CEF6" : "pink"));
    
        this.bars = this.svg.selectAll("rect.avg.views")
        .data(slicedData)
        .join("circle")
        .on("mouseover", (e,d) => {
            this.tooltip.style("display", "block");
            this.tooltip.select(".tooltip-inner")
            .html(`Channel: ${d.Channel}<br /> Average Viewers: ${d["Average viewers"]}`);
            Popper.createPopper(e.target, this.tooltip.node(), {
                placement: 'top',
                modifiers: [
                    {
                        name: 'arrow',
                        options: {
                            element: this.tooltip.select(".tooltip-arrow").node(),
                        },
                    },
                ],
            });
        })
        .on("mouseout", (d) => {
            this.tooltip.style("display", "none");
        }); 
    
    }
  }
  