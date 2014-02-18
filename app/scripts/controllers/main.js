'use strict';

angular.module('claApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

	$scope.data =
	{nodes:
		{
		"nodes":
		[],
		"links":
		[    {"source":0,"target":1,"value":4},
		     {"source":0,"target":2,"value":4},
		     {"source":0,"target":3,"value":4},
		     {"source":0,"target":4,"value":4}],
		update:1
		}
	};

	$scope.list = 
		{
		"nodes":
		[    {"name":"Front Panel Object to JSON.vi","group":2,"hidden":false},
		     {"name":"Array to JSON Object.vi","group":2,"hidden":false},
		     {"name":"Scale to JSON.vi","group":2,"hidden":false},
		     {"name":"Caption to JSON.vi","group":2,"hidden":false},
		     {"name":"Label to JSON.vi","group":2,"hidden":false}],
		"links":
		[    {"source":0,"target":1,"value":4},
		     {"source":0,"target":2,"value":4},
		     {"source":0,"target":3,"value":4},
		     {"source":0,"target":4,"value":4}]
		};

 		$scope.$watch('data.nodes.update', function(newValue, oldValue) {       
            if (newValue !== oldValue) {
                console.log('This is coming from the controller to the directive now = ', newValue);
            }
        });  
  });
