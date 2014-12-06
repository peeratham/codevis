'use strict';

var codevisComponents = angular.module('codevisComponents');

codevisComponents.directive('identifierViewer', ['Identifiers',
	function(Identifiers) {
		var link = function(scope, element, attrs){
			var identifiers = Identifiers.query(function(data){
				identifiers = data;
				console.log(identifiers);
			});

			var bubble = Bubble(element[0]);
				var data = {children:[{name:'a',value:5,className:'A'},{name:'b',value:10,className:'B'}]};
				
				bubble.data(data);
				bubble.render();
			scope.$watch('state.focusNode',function(){
				// if(scope.state.focusNode!=undefined||scope.state.focusNode!=""){
				var currentIdentifiers = identifiers[scope.state.focusNode];
				console.log(currentIdentifiers);
				if(currentIdentifiers!=undefined){
					var identifierObjs = currentIdentifiers.map(function(el){
						return {name:el, value:1, className:'identifiers'};
					});	

					bubble.data({children:identifierObjs});
					bubble.render();
				}
				
				// }
		
			});
		};

		return{
			template: '<div class=bubbleChart col-md-3><div>',
			replace: true,
			link : link,
			restrict: 'E'
		};
	}
	

	]
);
	