'use strict';

angular.module('claApp')
  .directive('forceDiagramLegend', function () {
    return {
      templateUrl: 'views/templates/forceDiagramLegend.html',
      restrict: 'E',
      scope: {
                nodes: '='
            },
      link: function postLink(scope, element, attrs) {
      	scope.toggle = function (node) {

			scope.nodes.links.forEach(function (dlink, index) {
		  		console.log(dlink.source.id + " : " + dlink.target.id + " : " + node.id);
		            if (dlink.source.id === node.id || dlink.target.id === node.id) {
		            	console.log("true");
		                scope.nodes.links.splice(index, 1);
		            }
		        });
      		scope.nodes.nodes.splice(node.index, 1);
      	}
		scope.$watch('nodes', function(newValue, oldValue) {  
            if (newValue !== oldValue) {
                console.log("Legend Update");
            }
        },true);      	

      }
    };
  });
