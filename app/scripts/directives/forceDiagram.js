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
		var color = d3.scale.category10();
		function colorByGroup(d) { return color(group(d)); }

		var width = 500,
		    height = 500;

		var force = d3.layout.force()
		    .charge(-2000)
		    .friction(0.3)
		    .linkDistance(50)
		    .size([width, height])
		    .on('tick', function() {
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

		var svg = d3.select('#viz')
		    .append('svg')
		    .attr('width', width)
		    .attr('height', height);

		var link = svg.selectAll(".link"),
		    node = svg.selectAll(".node");

		var voronoi = d3.geom.voronoi()
		    .x(function(d) { return d.x; })
		    .y(function(d) { return d.y; })
		    .clipExtent([[-10, -10], [width+10, height+10]]);

		update();

		function update() {
		    force
		        .nodes( scope.nodes.nodes )
		        .links( scope.nodes.links )
		        .start();

		    scope.nodes.nodes.forEach(function(d, i) {
		        d.id = i;
		    });

		    link = link.data( scope.nodes.links );
		    link.exit().remove();
		    link.enter().append('line')
		        .attr('class', 'link')
		        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

		    node = node.data( scope.nodes.nodes );
		    node.exit().remove();
		    node.enter().append('g')
		        .attr('title', name)
		        .attr('class', 'node')
		        .call( force.drag );

			node.append("image")
			  .attr("xlink:href", "http://forums.ni.com/ni/attachments/ni/170/527271/1/LV2010.ico")
			  .attr("x", -8)
			  .attr("y", -8)
			  .attr("width", 16)
			  .attr("height", 16)
			  .on("click", click);
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
		  if (!d3.event.defaultPrevented) {	
		  	scope.nodes.links.forEach(function (dlink, index) {
		  		console.log(dlink.source.id + " : " + dlink.target.id + " : " + d.id);
		            if (dlink.source.id === d.id || dlink.target.id === d.id) {
		            	console.log("true");
		                scope.nodes.links.splice(index, 1);
		            }
		        });
		  	scope.nodes.nodes.splice(d.index, 1);
		    update();
		  }
		}

		scope.$watch('nodes.update', function(newValue, oldValue) {  	     
            if (newValue !== oldValue) {
                console.log("Diagram Update"); 
                update();
            }
        }); 

      }
    };
  });
