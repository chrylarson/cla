'use strict';

angular.module('claApp')
  .directive('forceDiagram', function () {
    return {
      template: '<div id="viz"></div>',
      restrict: 'E',
      scope: {
                nodes: '='
            },
      link: function postLink(scope, element, attrs) {


function name(d) { return d.name; }
function group(d) { return d.group; }
var data = scope.nodes;
var color = d3.scale.category10();
function colorByGroup(d) { return color(group(d)); }

var width = 960,
    height = 500;

var svg = d3.select('#viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

var voronoi = d3.geom.voronoi()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .clipExtent([[-10, -10], [width+10, height+10]]);

update();

function update() {

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

var force = d3.layout.force()
    .charge(-2000)
    .friction(0.3)
    .linkDistance(50)
    .size([width, height]);

force.on('tick', function() {
    node.attr('transform', function(d) { return 'translate('+d.x+','+d.y+')'; })
        .attr('clip-path', function(d) { return 'url(#clip-'+d.index+')'; });

    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    var clip = svg.selectAll('.clip')
        .data( recenterVoronoi(node.data()), function(d) { return d.point.index; } );

    clip.enter().append('clipPath')
        .attr('id', function(d) { return 'clip-'+d.point.index; })
        .attr('class', 'clip');
    clip.exit().remove()

    clip.selectAll('path').remove();
    clip.append('path')
        .attr('d', function(d) { return 'M'+d.join(',')+'Z'; });
});


    data.nodes.forEach(function(d, i) {
        d.id = i;
    });

    link = svg.selectAll('.link')
        .data( data.links )
        .enter().append('line')
        .attr('class', 'link')
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    node = svg.selectAll('.node')
        .data( data.nodes )
        .enter().append('g')
        .attr('title', name)
        .attr('class', 'node')
        .call( force.drag );

	node.append("image")
	  .attr("xlink:href", "http://forums.ni.com/ni/attachments/ni/170/527271/1/LV2010.ico")
	  .attr("x", -8)
	  .attr("y", -8)
	  .attr("width", 16)
	  .attr("height", 16);
	//  .on("click", click);

	// node.append("text")
	//   .attr("dx", 12)
	//   .attr("dy", ".35em")
	//   .text(function(d) { return d.name });

    force
        .nodes( data.nodes )
        .links( data.links )
        .start();
}

function recenterVoronoi(nodes) {
    var shapes = [];
    voronoi(nodes).forEach(function(d) {
        if ( !d.length ) return;
        var n = [];
        d.forEach(function(c){
            n.push([ c[0] - d.point.x, c[1] - d.point.y ]);
        });
        n.point = d.point;
        shapes.push(n);
    });
    return shapes;
}

// Toggle children on click.
function click(d) {
	console.log("clicked");
	console.log(d);
  if (!d3.event.defaultPrevented) {
  	data.nodes.splice(d.index, 1);
  	console.log(data);
    update();
  }
}
      }
    };
  });
