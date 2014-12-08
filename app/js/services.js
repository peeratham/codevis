'use strict';

var codevisServices = angular.module('codevisServices', ['ngResource']);


codevisServices.factory('ProjectTree', ['$resource',
	function($resource){
		return $resource('data/:path.json', {}, {
			query: {method:'GET', params:{path:'d3-structure'}}
		});
	}]);

codevisServices.factory('Functions', ['$resource',
	function($resource){
		return $resource('api/:path', {}, {
			query: {method:'GET', params:{path:'functions'}}
		});
	}]);

codevisServices.factory('Relations', ['$resource',
	function($resource){
		return $resource('api/:path', {}, {
			query: {method:'GET', params:{path:'relations'}}
		});
	}]);

codevisServices.factory('Identifiers', ['$resource',
	function($resource){
		return $resource('api/:path', {}, {
			query: {method:'GET', params:{path:'identifiers'}}
		});
	}]);
	
codevisServices.factory('ProjectEvolutionData', ['$resource',
	function($resource){
		return $resource('data/:path.json', {}, {
			query: {method:'GET', isArray:true, params:{path:'timeline'}}
		});
	}]);


