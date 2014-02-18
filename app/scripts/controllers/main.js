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
			[    {"source":0,"target":1,"value":4,"hidden":false},
			{"source":0,"target":2,"value":4,"hidden":false},
			{"source":0,"target":3,"value":4,"hidden":false},
			{"source":0,"target":4,"value":4,"hidden":false}],
			update:1
		}
	};

	$scope.list = 
	{
		"nodes":
		[    {"id":0,"name":"Front Panel Object to JSON.vi","group":2,"hidden":false},
		{"id":1,"name":"Array to JSON Object.vi","group":2,"hidden":false},
		{"id":2,"name":"Scale to JSON.vi","group":2,"hidden":false},
		{"id":3,"name":"Caption to JSON.vi","group":2,"hidden":false},
		{"id":4,"name":"Label to JSON.vi","group":2,"hidden":false}],
		"links":
		[    {"source":0,"target":1,"value":4,"hidden":false},
		{"source":0,"target":2,"value":4,"hidden":false},
		{"source":0,"target":3,"value":4,"hidden":false},
		{"source":0,"target":4,"value":4,"hidden":false}]
	};

	// make links reference nodes directly for this particular data format:
	var hash_lookup = [];
	// make it so we can lookup nodes in O(1):
	$scope.list.nodes.forEach(function(d, i) {
		hash_lookup[d.id] = d;
	});
	$scope.list.links.forEach(function(d, i) {
		d.source = hash_lookup[d.source];
		d.target = hash_lookup[d.target];
	});

	$scope.$watch('data.nodes.update', function(newValue, oldValue) {       
		if (newValue !== oldValue) {
		    //console.log('This is coming from the controller to the directive now = ', newValue);
		}
	});  
});
