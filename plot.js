//var d3 = require("d3");
//const jsdom = require("jsdom");
//const {JSDOM} = jsdom;
//var document = new JSDOM().window.document;

//var svg = d3.select(document.body).append("svg"),
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var spread = d3.forceSimulation()
    //.force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));



d3.json("graph.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return 1; })
      .attr("color", function(d) { return d.isBridge ? d3.color("cyan"):d3.color("gray") });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 10)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  spread
      .nodes(graph.nodes)
      .on("tick", ticked);

  spread
      .force("link", d3.forceLink().id(d=>d.id).distance(1)
      .links(graph.links.filter(d=>!d.isBridge)));

  spread
      .force("link2", d3.forceLink().id(d=>d.id).distance(1000)
      .links(graph.links.filter(d=>d.isBridge)));

  //var cent = [[682, 682], [682, 2048], [682, 3413], [2048, 682], [2048, 3413], [3413, 682], [3413, 2048], [3413, 3413]];
  //for(i=0; i<8; i++) {
  //    d3.forceSimulation()
  //        .force("center", d3.forceCenter(cent[i][0], cent[i][1]))
  //        .nodes(graph.nodes.filter(d=>d.group == i));
  //}

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});

function dragstarted(d) {
  if (!d3.event.active) spread.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) spread.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
