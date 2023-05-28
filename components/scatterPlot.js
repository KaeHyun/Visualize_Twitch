class ScatterPlot{
    
    //SVG 요소 설정
    margin = { top: 20, right: 20, bottom: 100, left: 37};

    constructor(data)
    {
        this.data = data;
        this.width =600;
        this.height = 460;
        this.x = d3.scaleLinear().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);

        this.handler = {};
    }

    //초기화
    initialize(){

        this.svg = d3.select("#scatterchart")
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .style("position", "absolute") 
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g").attr("class", "x-axis")
        .attr("transform", `translate(0, ${this.height})`);
        this.yAxis = this.svg.append("g").attr("class", "y-axis");
        
        //x축 update
        this.svg.selectAll(".x-axis")
        .call(d3.axisBottom(this.x))
        .append("text")
        .attr("class", "axis-label")
        .attr("x", this.width)
        .attr("y", -6)

        //y축 update
        this.svg.selectAll(".y-axis")
        .call(d3.axisLeft(this.y))
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 10)
        .attr("dy", ".71em")

        // Set up x-axis label
        this.svg.append("text").attr("class", "axis-label")
        .attr("x", this.width).attr("y", this.height - 6)

        // Set up y-axis label
        this.svg.append("text").attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0).attr("y", 10).attr("dy", ".71em")

        
        this.xScale = d3.scaleLinear().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);

        this.legend = this.svg.append("g");

        this.color = d3.scaleOrdinal(d3.schemeDark2);

        this.svg.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    //선택된 언어에따라 update
    update(first, second, xAxisVal, yAxisVal)
    {
        var filterdata1 = this.data.filter((d) => d.Language === first);
        var filterdata2 = this.data.filter((d) => d.Language === second);

        this.legend.selectAll(".legend-item").remove();

        // x축과 y축 설정
        this.xAxisVal = xAxisVal;
        this.yAxisVal = yAxisVal;

        console.log(xAxisVal);
        console.log(yAxisVal);

        // x축과 y축 도메인 설정
        this.xScale.domain([
            d3.min([d3.min(filterdata1, (d) => d[xAxisVal]), d3.min(filterdata2, (d) => d[xAxisVal])]),
            d3.max([d3.max(filterdata1, (d) => d[xAxisVal]), d3.max(filterdata2, (d) => d[xAxisVal])])
        ]).range([0, this.width]);

        this.yScale.domain([
            d3.min([d3.min(filterdata1, (d) => d[yAxisVal]), d3.min(filterdata2, (d) => d[yAxisVal])]),
            d3.max([d3.max(filterdata1, (d) => d[yAxisVal]), d3.max(filterdata2, (d) => d[yAxisVal])])
        ]).range([this.height, 0]);

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));


        // 데이터를 기반으로 점 추가
        const dots1 = this.svg.selectAll(".dot1")
        .data(filterdata1);

        dots1.enter()
        .append("circle")
        .attr("class", "dot1")
        .merge(dots1)
        .transition()
        .duration(500)
        .attr("cx", (d) => this.xScale(d[xAxisVal]))
        .attr("cy", (d) => this.yScale(d[yAxisVal]))
        .attr("r", 3)
        .style("fill", "skyblue");

        dots1.exit().remove();
        
        const dots2 = this.svg.selectAll(".dot2")
        .data(filterdata2);

        dots2.enter()
        .append("circle")
        .attr("class", "dot2")
        .merge(dots2)
        .transition()
        .duration(500)
        .attr("cx", (d) => this.xScale(d[xAxisVal]))
        .attr("cy", (d) => this.yScale(d[yAxisVal]))
        .attr("r", 3)
        .style("fill", "hotpink");
        dots2.exit().remove();
        const legendItems = this.legend.selectAll(".legend-item")
        .data([first, second]);

        const legendItemsEnter = legendItems.enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legendItemsEnter.append("circle")
        .attr("cx", this.width + 20)
        .attr("cy", 10)
        .attr("r", 5)
        .style("fill", (d, i) => i === 0 ? "skyblue" : "hotpink");

        legendItemsEnter.append("text")
        .attr("x", this.width + 30)
        .attr("y", 14)
        .text(d => d);

        legendItemsEnter.merge(legendItems);

        legendItems.exit().remove();

    }

}