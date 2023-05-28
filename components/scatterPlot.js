class ScatterPlot{
    
    //SVG 요소 설정
    margin = { top: 30, right: 20, bottom: 100, left: 37};

    constructor(svg, tooltip, data)
    {
        this.svg = svg;
        this.tooltip = tooltip;
        this.data = data;
        this.width =650;
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
        
        this.tooltip = d3.select(this.tooltip);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g").attr("class", "x-axis")
        .attr("transform", `translate(0, ${this.height})`);
        this.yAxis = this.svg.append("g").attr("class", "y-axis");
        
        this.legend = this.svg.append("g");
        
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
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10)

        this.svg
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
    }

    //선택된 언어에따라 update
    update(first, second, xAxisVal, yAxisVal)
    {
        var filterdata1 = this.data.filter((d) => d.Language === first);
        var filterdata2 = this.data.filter((d) => d.Language === second);

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
        this.zScale.domain([first, second]).range(["hotpink", "skyblue"]); 

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));
        
        this.legend
        .style("display", "inline")
        .style("font-size", ".8em")
        .attr("transform", `translate(${this.width + this.margin.left + 10}, ${this.height / 2})`)
        .call(d3.legendColor().scale(this.zScale));


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
        .style("fill", "skyblue")
        

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
        .style("fill", "hotpink")


        dots2.exit().remove();

        var filterTotal = filterdata1.concat(filterdata2);

        this.circles = this.svg.selectAll("circle")
        .data(filterTotal)
        .join("circle")
        .on("mouseover", (e,d) => {
            this.tooltip.style("display", "block");
            this.tooltip.select(".tooltip-inner")
            .html(`${this.xAxisVal}: ${d[this.xAxisVal]}<br />${this.yAxisVal}: ${d[this.yAxisVal]}`);
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
        
        this.legend
        .style("display", "inline")
        .style("font-size", ".8em")
        .attr("transform", `translate(${this.width -80}, ${this.height / 2})`)
        .call(d3.legendColor().scale(this.zScale));
 

    }

}