'use strict';

var codevisComponents = angular.module('codevisComponents',[]);

codevisComponents.directive('nodelinkChart',['ProjectTree','Metadata',
	function(ProjectTree, Metadata) {
		var link = function(scope, element, attrs){
			var metadata = Metadata.query(function(data){
				metadata = data;
				// console.log(metadata[]);
			});
			
			ProjectTree.query(function(data) {
				var tree = Tree(element[0]);		//in js/treelayout.js
				tree.data(data);
				tree.render();
				// tree.simplifyTree(10);
				tree.update();

				tree.addClickListener(function(info){
					if(info.focus!=false){
						// console.log('focus on'+ info.focus.name+'@path:'+info.focus.path);
						scope.focus = info.focus.name;
						
						scope.focusLanguage = info.focus.language;
						scope.focusPath = info.focus.path;
						scope.$apply();

					}else{
						console.log('unfocus');
					}});

				tree.addMouseoverListener(function(d){
					scope.currentMetadata = metadata[d.path.trim()];
					scope.$apply();
					// console.log(d.path);

					// console.log(metadata[d.path.trim()]);
				});
				// tree.addNode('root/libs/modules');
				// tree.deleteNode('root/libs/d3lib/axis.js');
				// tree.update();

			});
		}

		return{
			template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
			replace: true,
			link: link, 
			restrict: 'E' 
		};

	}
]);

