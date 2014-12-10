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
		$scope.state = {};
		$scope.identifier ='';

	}]);

codevisControllers.controller('aceCtrl', [ '$scope','$http', 
	function($scope,$http) {

	$scope.method = 'GET';
	$scope.url = 'data/root/assets/lib/bootstrap/dist/css/bootstrap.min.css';
	$scope.fileContent = '';
	$scope.defaultDataPath = 'data';


	$scope.aceOption= {
		// mode: '',
		require: ['ace/ext/language_tools'],
		useWrapMode: true,
		advanced:{

		},

		onLoad: function(_ace) {

			var _renderer = _ace.renderer;
			var Range = ace.require('ace/range').Range;
			// var Folding = ace.require('ace/edit_session/folding').Folding;
			_ace.session.setMode("ace/mode/" + 'javascript')
			_ace.setReadOnly(true);
			_ace.session.setFoldStyle('markbeginend');
			// _ace.setTheme("ace/theme/vibrant_ink");
			$scope.$watch('state.focusNode',function(){
					// var target_path = $scope.defaultDataPath+$scope.state.hover;

					if($scope.state.focusNode !=""){
						var target_path = $scope.defaultDataPath+$scope.state.focusNode;
						// console.log($scope.defaultDataPath+$scope.state.hover);

							$http.get(target_path).success(function(data){
								if(typeof data =='object'){
									data = JSON.stringify(data, undefined, 4);
								}
								_ace.setValue('');
								_ace.insert(data);
								
								_ace.session.foldAll(1,999,1);
								// var folds = _ace.session.getAllFolds();
								// _ace.session.expandFolds(folds);
								// folds = _ace.session.getAllFolds();
								// _ace.session.expandFolds(folds);
								_ace.gotoLine(0);

							});	
					}
					if($scope.state.focusNode==""){
						_ace.setValue('');	
					}
			});
			var last="";
			$scope.$watch('identifier',function(){
				var selected = $scope.identifier.name;
					if(selected){
						var key = selected.replace(/<anonymous>\.(.+)/g, "$1");
						_ace.find(key.trim());	
					}
					
				
// text.replace(/<anonymous>\.(.+)/g, "$1");
				// _ace.session.addMarker(new Range(0, 0, 1, 0), "hightlight", "line");
			});

			// $scope.$watch('identifer',function(){
			// 	console.log($scope.identifer);
			// });

			// $scope.retrieveContent = function(path){
			// 	$http.get(path).success(function(data) {
			// 		$scope.fileContent = data;
			// 		_ace.insert(data);
			// 		_ace.gotoLine(0);
			// 	});
			// }
			// $scope.retrieveContent($scope.url);
			// _ace.session.addMarker(new Range(0, 0, 1, 0), "hightlight", "line");

			$scope.findKeyword = function(keywordVal) {
				_ace.findAll(keywordVal);
			}

		}
	};

}]);