'use strict';

angular.module('claApp')
.directive('forceDiagram', function () {
	return {
		template: '<div id="viz"></div>',
		restrict: 'E',
		scope: {
			nodes: '=',
			list: '='
		},
		link: function postLink(scope, element, attrs) {
			function name(d) { return d.name; }
			function group(d) { return d.group; }
			var color = d3.scale.category10();
			function colorByGroup(d) { return color(group(d)); }

			var width = 500,
			height = 500;

			//adjust height/width to fill parent div
            if (typeof element[0].parentNode.clientWidth !== "undefined") {
                width =  element[0].parentNode.clientWidth;
            }
            if (typeof scope.nodes.windowHeight !== "undefined") {
                height = scope.nodes.windowHeight-100;
            }

			var force = d3.layout.force()
			.charge(-1000)
			.linkDistance(30)
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
			.attr('height', height)
			.attr("viewBox", "0 0 " + width + " " + height )
    		.attr("preserveAspectRatio", "xMidYMid meet")
    		.attr("pointer-events", "all")
    		.call(d3.behavior.zoom().on("zoom", redraw));

			var vis = svg
			    .append('svg:g');

			function redraw() {
			  vis.attr("transform",
			      "translate(" + d3.event.translate + ")"
			      + " scale(" + d3.event.scale + ")");
			}

			var link = vis.selectAll(".link"),
			node = vis.selectAll(".node");

			var voronoi = d3.geom.voronoi()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })
			.clipExtent([[-10, -10], [width+10, height+10]]);


			//wait for scope.list ready
			scope.$watch('list', function(newValue, oldValue) {  	     
				if (newValue !== oldValue) {
					console.log("List updated");
					update();
				}
			});
			
			function update() {

				scope.list.nodes.forEach(function (dnode, index) {
					if ( dnode.hidden === true ) {
						if (scope.nodes.nodes.indexOf(dnode) !== -1 ) {
							scope.nodes.nodes.splice(scope.nodes.nodes.indexOf(dnode), 1);
						}
					} else {
						if (scope.nodes.nodes.indexOf(dnode) === -1 ) {
							scope.nodes.nodes.push(dnode);
						}         	
					}
				});

				var nodelinks = [];
				scope.list.links.forEach(function (dlink, index) {
					if( dlink.source.hidden === false && dlink.target.hidden === false) {
						nodelinks.push(dlink);
					}
				});
				scope.nodes.links = nodelinks;

				force
				.nodes( scope.nodes.nodes )
				.links( scope.nodes.links )
				.start();


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
				.attr("xlink:href", function(d) { return "images/icons/" + d.icon; })
				.attr("x", -16)
				.attr("y", -16)
				.attr("width", 32)
				.attr("height", 32)
				.append("svg:title")
   				.text(function(d) { return d.name; });
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

			//listen for updates
			scope.$watch('nodes.update', function(newValue, oldValue) {  	     
				if (newValue !== oldValue) {
	                update();
            	}
            }); 

		}
	};
});
