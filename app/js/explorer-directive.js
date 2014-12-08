'use strict';

var codevisComponents = angular.module('codevisComponents',[]);

codevisComponents.directive('projectExplorer',['ProjectTree','Functions', 'Relations', 'Identifiers',
	function(ProjectTree, Functions, Relations, Identifiers) {
		var link = function(scope, element, attrs){
			var functions = Functions.query(function(data){
				functions = data;
				// console.log(metadata[]);
			});

			var relations = Relations.query(function(data){
				relations = data;
			});

			var identifiers = Identifiers.query(function(data){
				identifiers = data;
			});

			
ProjectTree.query(function(data) {

	var tree = TreeDiagram(element[0]);		//in js/treelayout.js
	flatten(data);
	tree.data(data);
	console.log('relations', relations);
	console.log('identifiers', identifiers);
	tree.functions(functions);
	tree.relations(relations);
	tree.identifiers(identifiers);
	tree.render();
	tree.update();

	// tree.test();


	tree.listener(function(state){
		// console.log('from outside', state);
		scope.state = state;
		scope.$apply();

	});

	// tree.addMouseoverListener(function(d){
	// 	scope.currentMetadata = metadata[d.path.trim()];
		// scope.$apply();
	// 	// console.log(d.path);

	// 	// console.log(metadata[d.path.trim()]);
	// });
	// tree.addNode('root/libs/modules');
	// tree.deleteNode('root/libs/d3lib/axis.js');
	// tree.update();

	// -----extra----------
		// tree.simplifyTree(10);

});
}

		return{
			template: '<div class="chart col-md-5"></div>',
			replace: true,
			link: link, 
			restrict: 'E' 
		};

	}
]);

