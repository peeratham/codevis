'use strict';

// Declare app level module which depends on views, and components
var codeVis = angular.module('codeVis', [
	'codevisControllers',
	'codevisComponents',
	'codevisServices',
	'ui.bootstrap',
  'ui.ace'
	]);


angular.module('codeVis').controller('AccordionDemoCtrl', function ($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
});


// codeVis.controller('mainCtrl',['$scope','$window','ProjectTree',
// 	function($scope, $window, ProjectTree) {
// 		// body...
// 		$scope.gitURL = '';
// 		$scope.projectName = 'D3';
// 		$scope.projectTree = ProjectTree.query();
		
// 		console.log($scope.projectTree);

// 	}]);


