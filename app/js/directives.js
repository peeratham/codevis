'use strict';

var codevisComponents = angular.module('codevisComponents',[]);

codevisComponents.directive('nodelinkChart',['ProjectTree',
	function(ProjectTree) {
		var link = function(scope, element, attrs){
			
			ProjectTree.query(function(data) {
				var tree = Tree(element[0]);		//in js/treelayout.js
				tree.data(data);
				tree.render();

				tree.addClickListener(function(info){
					if(info.focus!=false){
						console.log('focus on'+ info.focus.name);
					}else{
						console.log('unfocus');
					}});

				tree.addMouseoverListener(function(d){console.log(d.name)});
				tree.addNode('root/libs/modules');
				tree.deleteNode('root/libs/d3lib/axis.js');
				tree.update();

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

