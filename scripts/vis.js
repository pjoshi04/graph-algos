var w = 900;
var h = 400;

var nodeCount=9

var graph = d3.select("#vis").append("svg").attr("width", w).attr("height", h).style("border-style", "solid")
.style("padding", "20 20 20 20");

function drawGraph() {
    var path = graph.append("g") 

    path.append("svg:defs").append("svg:marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr('refX', -20)//so that it comes towards the center.
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

    links = path.selectAll( "line.link" )
    .data( network.edges() )
    .enter().append( "path" )//append path
    .attr( "class", "link" )
    .style( "stroke", "#000" )
    .attr('marker-start', "url(#arrow)")//attach the arrow from defs
    .style( "stroke-width", 2 );
    
    links
    .attr( "d", function(d) {
        return "M" + network.node(d.v).x + "," + network.node(d.v).y + ", " +
        network.node(d.w).x + "," + network.node(d.w).y
    })

    // path.selectAll("line")
    // .data(network.edges())
    // .enter()
    // .append("line")
    // .attr("x1", function(d) {return network.node(d.v).x})
    // .attr("y1", function(d) {return network.node(d.v).y})
    // .attr("x2", function(d) {return network.node(d.w).x})
    // .attr("y2", function(d) {return network.node(d.w).y})
    // .style("stroke-width", "4px")
    // .style("stroke", "blue");

    path.selectAll('text')
    .data(network.edges())
    .enter()
    .append('text')
             .attr('class', 'barsEndlineText')
             .attr('text-anchor', 'right')
              .attr("x", function(d) {return network.node(d.v).x + (network.node(d.w).x - network.node(d.v).x)/2})
             .attr("y", function(d) {return  network.node(d.v).y - 5 + (network.node(d.w).y - network.node(d.v).y)/2})
             .text(function(d) {
                 return distance(
                     network.node(d.v).x, 
                     network.node(d.v).y, 
                     network.node(d.w).x,
                     network.node(d.w).y)
                    }
            )

    graph.selectAll("circle").data(network.nodes()).enter().append("circle").attr("class", "nodes")
    .attr("cx", function(d) {return network.node(d).x;})
    .attr("cy", function(d) {return network.node(d).y;})
    .attr("r", "5px")
    .attr("stroke-width", "2px") 
    .attr("fill", "white")
    .attr("stroke", "black")
    .on("mouseover", highlightNode)
    .on("mouseout", unHighlightNode)
    .on("click", linkNodes)
}

function highlightNode(){
    d3.select(this).attr("r", 10).style("fill", "red");
}

function unHighlightNode(){
    d3.select(this).attr("r", 5).style("fill", "white");
    d3.event.stopPropagation();
}

var currentEdge = []

function linkNodes(d,i) {
    d3.select(this).attr("fill", "green");
    if (currentEdge.length == 0) {
        d3.select(this).style("fill", "green");
        currentEdge.push(d)
        console.log(d)
    } else {
        currentEdge.push(d)
        network.setEdge(currentEdge[0],currentEdge[1])
        drawGraph();
        currentEdge.length = 0;
    }
    d3.event.stopPropagation();
}

function bfs() {
    var queue = [];
    var start = 0;
    var end = 3;
    queue.push(start)
    bfsLoop(queue, end)
}

function bfsLoop(queue, end) {
    setTimeout(function () {
        graph.selectAll(".redline").style("stroke-width", "4px").style("stroke", "orange")

        next = queue.shift()
        if (next == end) {
            console.log("success")
            return
        }
        var currNodes = graph.selectAll("line2").data(network.outEdges(next))
        
        currNodes.enter().append("line")  
        .attr('class','redline')
        .attr("x1", function(d) {return network.node(d.v).x})
        .attr("y1", function(d) {return network.node(d.v).y})
        .attr("x2", function(d) {return network.node(d.w).x})
        .attr("y2", function(d) {return network.node(d.w).y})
        .style("stroke-width", "5px")
        .style("stroke", "red")
        .transition()
        .delay(100);

        network.outEdges(next).forEach(edge => {
            if (queue.indexOf(edge.w) === -1){queue.push(edge.w)}
        })

        bfsLoop(queue, end)
    }, 1000) 
}

function distance(x1, y1, x2, y2) {
   return  Math.round(Math.sqrt((x2 - x1)**2 + (y2 - y1)**2))
}

drawGraph(); 


graph.on("click", function() {
    var coords = d3.mouse(this);
    network.setNode(nodeCount, {x: Math.round(coords[0]), y: Math.round(coords[1])})
    nodeCount++
    drawGraph();
    currentEdge.length = 0;
})
