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
				node.attr('transform', function(d) { return 'translate('+d.x+','+d.y+')'; });

				link.attr('x1', function(d) { return d.source.x; })
				.attr('y1', function(d) { return d.source.y; })
				.attr('x2', function(d) { return d.target.x; })
				.attr('y2', function(d) { return d.target.y; });

			});

			var vis = d3.select("#viz")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("pointer-events", "all")
				.append('svg:g')
				.append('svg:g');

			vis.append('rect')
			    .attr('width', "100%")
			    .attr('height', "100%")
			    .call(d3.behavior.zoom().on("zoom", redraw))
			    .attr('fill', 'rgba(1,1,1,0)')

			function redraw() {
				vis.attr("transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"); }	
				
			vis = vis.append("g");

			var link = vis.selectAll(".link"),
			node = vis.selectAll(".node");

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

				node.append("svg:image")
				.attr("class", "square")
				.attr("xlink:href", function(d) { return "images/icons/" + d.icon; })
				.attr("x", -16)
				.attr("y", -16)
				.attr("width", 32)
				.attr("height", 32)
				.append("svg:title")
   				.text(function(d) { return d.name; });
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
