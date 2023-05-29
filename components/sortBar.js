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
        this.svg = d3.select("#sortbarchart")
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    update(topVal)
    {

    }


}