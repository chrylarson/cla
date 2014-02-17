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
        console.log(scope.list);
      	scope.toggle = function (node) {

          var nodesLeft = [];
          scope.nodes.nodes.forEach(function (dnode, index) {
              if (dnode.name !== node.name ) {
                nodesLeft.push(dnode);
              } else {
                node.id = dnode.id;
              }
          });
          scope.nodes.nodes = nodesLeft;
          
          var linksLeft = [];
    			scope.nodes.links.forEach(function (dlink, index) {
  		        if (dlink.source.id !== node.id && dlink.target.id !== node.id) {
  		          linksLeft.push(dlink);
    		      }
    		  });
          scope.nodes.links = linksLeft;

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
