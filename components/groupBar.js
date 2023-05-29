class GB
{
    margin = {
        top: 10, right: 10, bottom: 40, left: 40
    }

    constructor(svg, width = 250, height = 250) {
        this.svg = svg;
        this.width = width;
        this.height = height;
    }

    initialize() {
        this.svg = d3.select(this.svg);
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
        this.update([]);
    }

    update(data){

        this.container.selectAll(".barGroup").remove();
        
        const filterdata = data.map(d => ({
            Channel: d.Channel,
            "Watch time(Minutes)": parseInt(d["Watch time(Minutes)"]/432000),
            "Stream time(minutes)": parseInt(d["Stream time(minutes)"]/60),
            Language: d.Language
          }));

        console.log(filterdata);

        const watchTimeMin = d3.min(filterdata, d => d["Watch time(Minutes)"]);
        const watchTimeMax = d3.max(filterdata, d=> d["Watch time(Minutes)"]);
        const streamTimeMin = d3.min(filterdata, d => d["Stream time(minutes)"]);
        const streamTimeMax = d3.max(filterdata, d => d["Stream time(minutes)"]);

        const theSmallest = Math.min(watchTimeMin, streamTimeMin);
        const theBiggest = Math.max(watchTimeMax, streamTimeMax);
                    
        this.xScale.domain(filterdata.map(d => d.Channel)).range([0, this.width]).padding(0.3);

        this.yScale.domain([theSmallest, theBiggest]).range([this.height, 0]);


        this.xAxis
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
        .call(d3.axisBottom(this.xScale))
        .selectAll("text")
        .attr("transform", "rotate(-55)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .style("font-size", "8px")
        .style("font-weight", "bold");

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));

        const bars = this.container
        .selectAll(".barGroup")
        .data(filterdata)
        .join("g")
        .attr("class", "barGroup")
        .attr("transform", d => `translate(${this.xScale(d.Channel)}, 0)`);

        bars
        .append("rect")
        .attr("class", "watchTime")
        .attr("x", 0)
        .attr("y", d => this.yScale(d["Watch time(Minutes)"]))
        .attr("width", this.xScale.bandwidth())
        .attr("height", d => this.height - this.yScale(d["Watch time(Minutes)"]))
        .attr("fill", "skyblue");

        bars
        .append("rect")
        .attr("class", "streamTime")
        .attr("x", 0)
        .attr("y", d => this.yScale(d["Stream time(minutes)"]))
        .attr("width", this.xScale.bandwidth())
        .attr("height", d => this.height - this.yScale(d["Stream time(minutes)"]))
        .attr("fill", "hotpink");

    }

}