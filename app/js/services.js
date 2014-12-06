'use strict';

var codevisServices = angular.module('codevisServices', ['ngResource']);


codevisServices.factory('ProjectTree', ['$resource',
	function($resource){
		return $resource('data/:path.json', {}, {
			query: {method:'GET', params:{path:'test-structure'}}
		});
	}]);

codevisServices.factory('Metadata', ['$resource',
	function($resource){
		return $resource('data/:path.json', {}, {
			query: {method:'GET', params:{path:'test-report'}}
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


