'use strict';

angular.module('claApp')
.directive('forceDiagram', function () {
	return {
		template: '<div id="viz" ></div>',
		restrict: 'E',
		scope: {
			nodes: '=',
			list: '='
		},
		link: function postLink(scope, element, attrs) {

	        var color = d3.scale.category10();
	        function colorByGroup(d) {
	            return color(d.value); 
	        }

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
			.gravity(0.05)
			.alpha(0.05)
			.charge(-600)
			.linkDistance(100)
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
				.attr("pointer-events", "all");

			//the pan and zoom events happen on this rectangle
			vis.append('rect')
			    .attr('width', "100%")
			    .attr('height', "100%")
			    .call(d3.behavior.zoom().on("zoom", redraw))
			    .attr('fill', 'rgba(1,1,1,0)')

			function redraw() {
				vis.attr("transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"); }	
				
			vis = vis.append("g");

			//added to prevent links overlapping nodes
			var linkG = vis.append("g").attr("id","linkg"),
			    nodeG = vis.append("g").attr("id","nodeg");

			var node = d3.select("#nodeg").selectAll(".node"),
			    link = d3.select("#linkg").selectAll(".link");

			//wait for scope.list ready
			scope.$watch('list', function(newValue, oldValue) {  	     
				if (newValue !== oldValue) {
					console.log("List updated");
					update();
				}
			});
			
			function update() {
				//select all current nodes and links before updating
				node = d3.select("#nodeg").selectAll(".node");
			    link = d3.select("#linkg").selectAll(".link");

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
	
				scope.list.links.forEach(function (dlink, index) {
					if( dlink.source.hidden === true || dlink.target.hidden === true ) {
						if (scope.nodes.links.indexOf(dlink) !== -1 ) {
							scope.nodes.links.splice(scope.nodes.links.indexOf(dlink), 1);
						}
					} else {
						if (scope.nodes.links.indexOf(dlink) === -1 ) {
							scope.nodes.links.push(dlink);
						} 						
					}
				});

				link = link.data( scope.nodes.links );

				link.exit().remove();

				link.enter()
				.append('line')
				.style('stroke', function(d) { return d.source.color; })
				.style("stroke-width", "1px")
				.attr('class', function(d) { return "link n" + (d.source.id) + " n" +(d.target.id)});

				node = node.data( scope.nodes.nodes );

				node.exit().remove();

				node.enter().append('g')
				.attr('title', name)
				.attr('class', function(d) { return "node n" + (d.id); })
				.call( force.drag );

				//icon border color
				node
				.append("svg:rect")
				.attr("x", -16)
				.attr("y", -16)
				.attr("width", 32)
				.attr("height", 32)
				.style("stroke", function(d) { return d.color; } )
				.style("stroke-width", 1)
				.attr("class", function(d) { return "n" + (d.id); })
				.style("stroke-linejoin","round")
				.attr('fill', 'none');

				//icon
				node
				.append("svg:image")
				.attr("class", function(d) { return "square n" + (d.id); })
				.attr("xlink:href", function(d) { return "images/" + d.icon; })
				.attr("x", -16)
				.attr("y", -16)
				.attr("width", 32)
				.attr("height", 32)
				.attr("id", function(d) { return "n" + (d.id); })
				.attr("class", function(d) { return "n" + (d.id); })
				.append("svg:title")
   				.text(function(d) { return d.name; });

				// On node hover, examine the links to see if their
				// source or target properties match the hovered node.
				node.on('mouseover', function(d) {
					d.highlight = true;
					d3.selectAll(".n" + d.id)
					.style("stroke-width", "4px");
					scope.$apply();
				});

				// Set the stroke width back to normal when mouse leaves the node.
				node.on('mouseout', function(d) {
					d.highlight = false;
					d3.selectAll(".n" + d.id)
					.style("stroke-width", "1px");
					scope.$apply();
				});

   				force
				.nodes( scope.nodes.nodes )
				.links( scope.nodes.links )
				.start();
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
