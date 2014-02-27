'use strict';

angular.module('claApp')
  .directive('treeDiagram', function ($http) {
    return {
		templateUrl: 'views/templates/treeDiagram.html',
		restrict: 'E',
		scope: {
			list: '=',
			nodes: '='
		},
      link: function postLink(scope, element, attrs) {

			//wait for scope.list ready
			scope.$watch('list', function(newValue, oldValue) {
					if(typeof scope.list !== 'undefined') {
						scope.isCollapsed = true;
						scope.treeOut = {};
						var treeArray = function(array,node,output) {
							
						    if ( typeof node.owner === 'undefined' ) {
						    	//console.log("parent: " + node.name)
						    	node.children = [];
						    	output[node.name] = node;
						        return output; // return default
						    } 
						    else if ( typeof output[node.owner.name] !== 'undefined' ) {
						    	//console.log("child: " + node.name)
						    	output[node.owner.name].children.push(node);
						    	return output;
						    }
						    else {
						        return treeArray(array, node.owner, output); // recur on x, reduce indx, update default
						    }
						}

				    	scope.list.nodes.forEach(function(d, i) {
				    		treeArray(scope.list.nodes,d,scope.treeOut );
				    	});
					}
			});

			scope.toggle = function (node) {
				if( node.hidden === false) {
					scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = true;
					d3.selectAll(".n" + node.id).remove();
					if ( typeof node.children !== 'undefined') {
						node.children.forEach(function(node, index) {
							scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = true;
							d3.selectAll(".n" + node.id).remove();
						});
					}
				} else {
					scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = false;
					if ( typeof node.children !== 'undefined') {
						node.children.forEach(function(node, index) {
							scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = false;
						});
					}
				}
				//notify controllers/directives that list has been updated
				scope.nodes.update = scope.nodes.update + 1;
			}

			scope.collapse = function (node) {
				if( node.collapsed === false) {
					scope.list.nodes[scope.list.nodes.indexOf(node)].collapsed = true;
					d3.selectAll(".n" + node.id).remove();
					if ( typeof node.children !== 'undefined') {
						node.children.forEach(function(node, index) {
							scope.list.nodes[scope.list.nodes.indexOf(node)].collapsed = true;
							scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = true;
							d3.selectAll(".n" + node.id).remove();
						});
					}
				} else {
					scope.list.nodes[scope.list.nodes.indexOf(node)].collapsed = false;
					d3.selectAll(".n" + node.id).remove();
					if ( typeof node.children !== 'undefined') {
						node.children.forEach(function(node, index) {
							scope.list.nodes[scope.list.nodes.indexOf(node)].collapsed = false;
							scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = false;
							d3.selectAll(".n" + node.id).remove();
						});
					}
				}
				//notify controllers/directives that list has been updated
				scope.nodes.update = scope.nodes.update + 1;
			}

			scope.openVI = function (node) {
				var data = {"filename":node.name};
				var url = "/links/openfile";
					$http({
				        url: url,
				        method: "POST",
				        timeout: 10000,
				        data: data
				    }).success(function (data) {
				      	console.log("Opening VI in LabVIEW");
					    }).error(function (response, status) {

					    });
			}

			scope.highlight = function(node) {
				//console.log("#n" + node.id);
				node.highlight = true;
				d3.selectAll(".n" + node.id)
				.style("stroke-width", "4px");
			}

			scope.unhighlight = function(node) {
				//console.log("#n" + node.id);
				node.highlight = false;
				d3.selectAll(".n" + node.id)
				.style("stroke-width", "1px");
			}
      }
    };
  });
