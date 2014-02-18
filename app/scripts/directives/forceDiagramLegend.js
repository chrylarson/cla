'use strict';

angular.module('claApp')
.directive('forceDiagramLegend', function () {
	return {
		templateUrl: 'views/templates/forceDiagramLegend.html',
		restrict: 'E',
		scope: {
			list: '=',
			nodes: '='
		},
		link: function postLink(scope, element, attrs) {
			scope.toggle = function (node) {
				if( node.hidden === false) {
					scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = true;
				} else {
					scope.list.nodes[scope.list.nodes.indexOf(node)].hidden = false;
				}

				console.log(scope.nodes);
				scope.nodes.update = scope.nodes.update + 1;
			}


			scope.$watch('nodes.update', function(newValue, oldValue) {  
				if (newValue !== oldValue) {
					console.log("Legend Update");
				}
			});

		}
	};
});
