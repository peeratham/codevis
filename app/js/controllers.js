'use strict';

var codevisControllers = angular.module('codevisControllers',[]);

codevisControllers.controller('mainCtrl',['$scope','$window','ProjectTree',
	function($scope, $window, ProjectTree) {
		// body...
		$scope.gitURL = '';
		$scope.projectName = '';
		$scope.projectTree = ProjectTree.query();
		$scope.focus = '';
		$scope.focusPath = '';
		$scope.currentMetadata = '';

	}]);

codevisControllers.controller('aceCtrl', [ '$scope','$http', 
	function($scope,$http) {

	$scope.method = 'GET';
	$scope.url = 'data/root/assets/lib/bootstrap/dist/css/bootstrap.min.css';
	$scope.fileContent = '';
	$scope.defaultDataPath = 'data';


	$scope.aceOption= {
		// mode: '',
		useWrapMode: true,
		onLoad: function(_ace) {

			var _renderer = _ace.renderer;
			var Range = ace.require('ace/range').Range;

			_ace.setReadOnly(true);

			// _ace.setTheme("ace/theme/vibrant_ink");
			$scope.$watch('focusPath',function(){
				if($scope.focusLanguage){
					$http.get($scope.defaultDataPath+$scope.focusPath).success(function(data) {
					$scope.fileContent = data;
					_ace.insert(data);
					_ace.gotoLine(0);
					});
				}else{
					_ace.setValue('');	
				}
				
				

			});

		
	
			$scope.retrieveContent = function(path){
				$http.get(path).success(function(data) {
					$scope.fileContent = data;
					_ace.insert(data);
					_ace.gotoLine(0);
				});
			}
			// scope.retrieveContent('data'+info.focus.path);
			
			// _ace.session.addMarker(new Range(0, 0, 1, 0), "hightlight", "line");


			$scope.findKeyword = function(keywordVal) {
				_ace.findAll(keywordVal);
			}

		}
	};

}]);