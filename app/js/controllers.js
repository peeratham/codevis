'use strict';

var codevisControllers = angular.module('codevisControllers',[]);

codevisControllers.controller('mainCtrl',['$scope','$window','ProjectTree',
	function($scope, $window, ProjectTree) {
		// body...
		$scope.gitURL = '';
		$scope.projectName = 'D3';
		$scope.projectTree = ProjectTree.query();
		
		console.log($scope.projectTree);

	}]);