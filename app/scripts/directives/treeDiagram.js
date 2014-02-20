'use strict';

angular.module('claApp')
  .directive('treeDiagram', function () {
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
							console.log(node.owner);
						    if ( typeof node.owner === 'undefined' ) {
						    	console.log("parent: " + node.name)
						    	output[node.name] = {"parent":node, "children":[]};
						        return output; // return default
						    } 
						    else if ( typeof output[node.owner.name] !== 'undefined' ) {
						    	console.log("child: " + node.name)
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


						scope.toggle = function (node) {
							if( node.hidden === false) {
								scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = true;
							} else {
								scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = false;
							}
							//notify controllers/directives that list has been updated
							scope.nodes.update = scope.nodes.update + 1;
						}
					}
			});

			//listen for updates
			scope.$watch('nodes.update', function(newValue, oldValue) {  
				if (newValue !== oldValue) {
					//console.log("Legend Update");
				}
			});
      }
    };
  });
