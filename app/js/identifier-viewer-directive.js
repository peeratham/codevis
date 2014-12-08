'use strict';

var codevisComponents = angular.module('codevisComponents');

codevisComponents.directive('identifierViewer', ['Identifiers','Functions',
	function(Identifiers, Functions) {
		var link = function(scope, element, attrs){
			var identifiers = Identifiers.query(function(data){
				identifiers = data;
			});

			var functions = Functions.query(function(data){
				functions = data;
			});

			// var forceBub = ForceBubble(element[0]);
			var plot = ForceBubble();
// 			[{count:5,name:'a'},{count:2,name:'b'},{count:3,name:'c',word:'c'},
// {count:3,name:'d',word:'d'},{count:3,name:'e',word:'e'},{count:3,name:'f',word:'f'}
			// ];
			var display = function(theData) {
				return plotData(element[0], theData, plot);
			};

			// var bubble = Bubble(element[0]);
			scope.$watch('state.focusNode',function(){
				// if(scope.state.focusNode!=undefined||scope.state.focusNode!=""){
				var currentIdentifiers = identifiers[scope.state.focusNode];
				var identifierObjs;

				var functionList = functions[scope.state.focusNode];
				var functionObjs;
				
					if(functionList!=undefined){
						functionObjs = functionList.map(function(el){
							console.log(el);
							return {name:el.name, count:4, className:'function', line : el.line};
						});		
					}
					

				if(currentIdentifiers!=undefined){
					identifierObjs = currentIdentifiers.map(function(el){
						return {name:el, count:1.5, className:'identifier'};
					});	

					for (var attrname in functionObjs) {
							identifierObjs.push(functionObjs[attrname]);
							console.log('push',functionObjs[attrname]);
					}

					// bubble.data({children:identifierObjs});
					// bubble.render();
					var listener = function(result){
						scope.identifier = result;
						scope.$digest();
					};
					plot = ForceBubble(listener);
					display(identifierObjs);
					// forceBub.data(identifierObjs);
					// forceBub.render();
				}

				if(scope.state.focusNode==""){
					console.log(scope.state.focusNode);
					display([]);
				}

			});
		};

		return{
			template: '<div class=bubbleChart col-md-12><div>',
			replace: true,
			link : link,
			restrict: 'E'
		};
	}
	]
);
	