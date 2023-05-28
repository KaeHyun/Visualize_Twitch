class zoomCircle{

    //SVG 요소 설정
    margin = { top: 30, right: 20, bottom: 100, left: 37};

    constructor(data)
    {
        this.data = data;
        this.width =650;
        this.height = 460;
        this.x = d3.scaleLinear().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);

        this.handler = {};
    }

    initialize()
    {
        this.svg = d3.select("#zoomCircle")
    }


}