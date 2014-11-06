'use strict';

var codevisComponents = angular.module('codevisComponents');

codevisComponents.directive('timelineChart',['ProjectEvolutionData',
	function(ProjectEvolutionData) {
		var link = function(scope, element, attrs){
			ProjectEvolutionData.query(function(data) {
				//data is ready	change data you want in services.js
				console.log(data);
				//use this element[0] to start drawing/appending
				var svg = d3.select(element[0]).append('svg')
				svg.append('circle')
				.attr("cx", 30)
				.attr("cy", 30)
				.attr("r", 20);
			


			});
		};
			return{
			 template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
			 replace: true,
			 link: link, 
			 restrict: 'E' 
		};
	}
]);