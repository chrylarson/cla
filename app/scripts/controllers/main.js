'use strict';

angular.module('claApp')
.controller('MainCtrl', function ($scope, $window) {

	$scope.data =
	{nodes:
		{
			"nodes":[],
			"links":[],
			update:1,
			windowHeight:$window.innerHeight
		}
	};

    d3.json("static-linkages.json", function(error, root) {
        console.log("Ctrl Update List");
        $scope.list = root;

    	$scope.list.nodes.forEach(function (node, index) {
    		node.id = index;
    		node.hidden = false;
            node.icon = node.name.split(':',1)[0] + '.png';

    	});
    	$scope.list.links.forEach(function (link, index) {
    		link.hidden = false;
    	});

    	// make links reference nodes directly
    	var hash_lookup = [];
    	// make it so we can lookup nodes in O(1):
    	$scope.list.nodes.forEach(function(d, i) {
    		hash_lookup[d.id] = d;
    	});
    	$scope.list.links.forEach(function(d, i) {
    		d.source = hash_lookup[d.source];
    		d.target = hash_lookup[d.target];
    	});
        $scope.$apply();
    });

    //Pagination Functions
    $scope.noOfPages = function () {
        if ($scope.filteredEvents !== undefined) {
            return Math.ceil($scope.filteredEvents.length / $scope.pageSize);
        } else {
            return 1;
        }
    };

    $scope.showPagination = function () {
        var result;
        if ($scope.noOfPages() > 1) {
            result = true;
        } else {
            result = false;
        }
        return result;
    };

    if ($scope.currentPage > $scope.noOfPages()) {
        $scope.currentPage = $scope.noOfPages();
    }

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

	//listen for updates
	$scope.$watch('data.nodes.update', function(newValue, oldValue) {       
		if (newValue !== oldValue) {
		    //console.log('This is coming from the controller to the directive now = ', newValue);
		}
	});  
});
