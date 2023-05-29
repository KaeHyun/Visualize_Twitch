class ScatterPlot{
    
    //SVG 요소 설정
    margin = { top: 30, right: 20, bottom: 100, left: 37};

    constructor(svg, tooltip, data)
    {
        this.svg = svg;
        this.tooltip = tooltip;
        this.data = data;
        this.width =650 ;
        this.height = 460;
        this.x = d3.scaleLinear();
        this.y = d3.scaleLinear();
        this.handler = {};
    }

    //초기화
    initialize(){


        this.width = 650 - this.margin.left - this.margin.right;
        this.height= 460 -this.margin.top - this.margin.bottom; 
        this.svg = d3.select("#scatterchart")
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .style("position", "absolute") 
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        
        this.tooltip = d3.select(this.tooltip);

        this.container = this.svg.append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.xAxis = this.svg.append("g").attr("class", "x-axis")
        .attr("transform", `translate(${-this.width}, ${this.width})`);
        this.yAxis = this.svg.append("g").attr("class", "y-axis")
        .attr("transform", `translate(${-this.height}, ${this.height})`);
        
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

        
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10);

        this.svg
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
    }

    //선택된 언어에따라 update
    update(first, second, xAxisVal, yAxisVal)
    {
        this.width = 650 - this.margin.left - this.margin.right;
        this.height = 460 - this.margin.top - this.margin.bottom;
        var filterdata1 = this.data.filter((d) => d.Language === first);
        var filterdata2 = this.data.filter((d) => d.Language === second);
        var filterTotal = filterdata1.concat(filterdata2);

        // x축과 y축 설정
        this.xAxisVal = xAxisVal;
        this.yAxisVal = yAxisVal;

        // x축과 y축 도메인 설정
        this.xScale.domain(d3.extent(filterTotal, (d) => d[xAxisVal])).range([0, this.width]);
        console.log("xAxisScaling");
        console.log(d3.extent(filterTotal, (d) => d[xAxisVal]));

        this.yScale.domain(d3.extent(filterTotal, (d) => d[yAxisVal])).range([this.height, 0]);
        console.log("yAxis Scaling");
        console.log(d3.extent(filterTotal, (d) => d[yAxisVal]));

        
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

        // SVG 요소의 크기를 다시 설정합니다.
        const svgWidth = this.width + this.margin.left + this.margin.right;
        const svgHeight = this.height + this.margin.top + this.margin.bottom;
        this.svg.attr("width", svgWidth).attr("height", svgHeight);

        
        // 데이터를 기반으로 점 추가
        const dots = this.container.selectAll(".dot")
        .data(filterTotal);

        dots.enter()
        .append("circle")
        .attr("class", "dot")
        .merge(dots)
        .transition()
        .duration(500)
        .attr("cx", (d) => this.xScale(d[xAxisVal]))
        .attr("cy", (d) => this.yScale(d[yAxisVal]))
        .attr("r", 3)
        .style("fill", (d) => this.zScale(d.Language));
        

        dots.exit().remove();
        
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