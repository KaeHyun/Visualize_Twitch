class SortBar{

    //SVG 요소 설정
    margin = { top: 10, right: 10, bottom: 40, left: 40};

    constructor(svg, data)
    {
        this.svg = svg;
        this.data = data;
        this.width = 700;
        this.height = 700;
       
    }

    initialize()
    {
        this.svg = d3.select("#sortbarchart");
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(topVal, checked)
    {
        console.log(checked);
        //내림차순 정렬
        const sortedData = [...this.data].sort((a, b) => parseInt(b['Average viewers'], 10) - parseInt(a['Average viewers'], 10));

        //top-n 까지 slice
        const slicedData = sortedData.slice(0, topVal);
        console.log(slicedData);
        

        this.xScale.domain(slicedData.map(d => d.Channel)).range([0, this.width]).padding(0.3);
        // this.yScale.domain(slicedData.map(d => d["Average viewers"])).range([this.height, 0]);
        const yMin = d3.min(slicedData, d => parseInt(d["Average viewers"]));
        const yMax = d3.max(slicedData, d => parseInt(d["Average viewers"]));
        this.yScale.domain([yMin-3000, yMax]).range([this.height, 0]);

        this.xAxis
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
        .call(d3.axisBottom(this.xScale))
        .selectAll("text")
        .attr("transform", "rotate(-35)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .style("font-size", "8px")
        .style("font-weight", "bold");

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));

        const bars = this.container.selectAll(".barGroup")
        .data(slicedData, d => d.Channel);
          
        bars.exit().remove();
          
        const newBars = bars.enter().append("g")
            .attr("class", "barGroup")
            .merge(bars)
            .attr("transform", d => `translate(${this.xScale(d.Channel)}, 0)`);
          
        newBars.selectAll("rect.avg.views")
            .data(d => [d])
            .join("rect")
            .attr("class", "avg views")
            .attr("x", 0)
            .attr("y", d => this.yScale(d["Average viewers"]))
            .attr("width", this.xScale.bandwidth() / 2)
            .attr("height", d => this.height - this.yScale(d["Average viewers"]))
            .attr("fill", "pink");
  }


}

