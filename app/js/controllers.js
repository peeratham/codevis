'use strict';

var codevisControllers = angular.module('codevisControllers',[]);

codevisControllers.controller('mainCtrl',['$scope','$window','ProjectTree',
	function($scope, $window, ProjectTree) {
		// body...
		$scope.gitURL = '';
		$scope.projectName = 'D3';
		$scope.projectTree = ProjectTree.query();
		

	}]);

codevisControllers.controller('aceCtrl', [ '$scope', function($scope) {

  $scope.aceLoaded = function(_editor) {
    // Options
    _editor.setReadOnly(true);
  };

  $scope.aceChanged = function(e) {
    //
  };

}]);