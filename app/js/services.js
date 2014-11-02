'use strict';

var codevisServices = angular.module('codevisServices', ['ngResource']);

codevisServices.factory('ProjectTree', ['$resource',
	function($resource){
		return $resource('data/:path.json', {}, {
			query: {method:'GET', params:{path:'structure'}}
		});
	}]);

	