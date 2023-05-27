class ScatterPlot{
    
    //SVG 요소 설정
    margin = { top: 10, right: 20, bottom: 30, left: 30};

    constructor(data)
    {
        this.data = data;
        this.width = 400;
        this.height = 300;

        this.x = d3.scaleLinear().range([0, this.width]);

        this.y = d3.scaleLinear().range([this.height, 0]);

        this.handler = {};
    }

    //초기화
    initialize(){

        this.svg = d3.select("#chart")
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
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
        .style("text-anchor", "end")
        .text("Average Viewrs");

        //y축 update
        this.svg.selectAll(".y-axis")
        .call(d3.axisLeft(this.y))
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Followers");
        // Set up x-axis label
        this.svg.append("text").attr("class", "axis-label")
        .attr("x", this.width).attr("y", this.height - 6)
        .style("text-anchor", "end").text("Average Viewers");

        // Set up y-axis label
        this.svg.append("text").attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0).attr("y", 10).attr("dy", ".71em")
        .style("text-anchor", "end").text("Followers");
                
        this.legend = this.svg.append("g");

        this.color = d3.scaleOrdinal(d3.schemeDark2);

        this.svg.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    //선택된 언어에따라 update
    update(language)
    {
        var filteredData = this.data;


        console.log(language);
        console.log(filteredData);

        // Filter data if a specific language is selected
        if (language !== "All") {
            filteredData = filteredData.filter((d) => d.Language === language);
        }
        
        //x축 y축 설정
        this.x.domain([0, d3.max(filteredData, d => +d["Followers gained"])]);
        this.y.domain([0, d3.max(filteredData, d => +d["Followers"])]);
        
        // 데이터를 기반으로 점 추가
        const dots = this.svg.selectAll(".dot")
        .data(filteredData);
        
        dots.enter()
        .append("circle")
        .attr("class", "dot")
        .merge(dots)
        .attr("cx", d => this.x(d["Followers gained"]))
        .attr("cy", d => this.y(d["Followers"]))
        .attr("r", 3)
        .style("fill", d => this.color(d.Language));
  
        dots.exit().remove();

    }

}