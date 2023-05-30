class Histogram{

    margin = {
        top: 10, right: 10, bottom: 40, left: 40
    };

    constructor(svg, tooltip) {
        this.svg = svg;
        this.width = 200;
        this.height = 200;
        this.tooltip = tooltip;
    }

    initialize(){
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();

        this.tooltip = d3.select(this.tooltip);

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        //초기화면 보여주기
        this.update([], '');


    }

    update(data, xVar){

        // console.log(xVar);
        const categories = [...new Set(data.map(d => d[xVar]))]
        const counts = {}

        categories.forEach(c => {
            counts[c] = data.filter(d => d[xVar] === c).length;
        })
        console.log(counts);
        this.xScale.domain(categories).range([0, this.width]).padding(0.3);
        this.yScale.domain([0, d3.max(Object.values(counts))]).range([this.height, 0]);

        this.container.selectAll("rect")
            .data(categories)
            .join("rect")
            .attr("x", d => this.xScale(d))
            .attr("y", d => this.yScale(counts[d]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => this.height - this.yScale(counts[d]))
            .attr("fill", (d, i) => d3.schemeDark2[i % 10]);


        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .attr("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .style("font-size", "8px")
            .style("font-weight", "bold");

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));

        this.circles = this.svg.selectAll("rect")
            .data(data)
            .join("rect")
            .on("mouseover", (e,d) => {
                this.tooltip.style("display", "block");
                this.tooltip.select(".tooltip-inner")
                .html(`Language: ${d.Language} <br/> Counts: ${counts[String(d.Language)]}`);
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