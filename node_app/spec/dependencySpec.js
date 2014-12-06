var api = require("../api");
var fs = require('fs');
var _ = require('underscore');

 
describe("identifierProcessing", function () {
  
  it("should give all meaningful identifiers", function () {
    api.test_identifierProcessing(function(result){
    	expect(_.size(result)).toBe(13);
    	expect(result['/root/examples/2048/js/game/tile.js']).toEqual([ 'Tile','position','value','previousPosition',
    'mergedFrom','prototype','savePosition','updatePosition','serialize' ]);
    });
  });

}); 

describe("relationMatrix", function(){
	it("should give adjacency matrix", function(){
		var files = {f1:['a','b'], f2:['b','c'], f3:['a','d']};
		var matrix = api.relationMatrix(files);
		var expected = { f1 : { f2 : [ 'b' ] , f3 : [ 'a' ] } , f2 : { f1 : [ 'b' ] }, f3 :  { f1 : [ 'a' ] } };
		expect(matrix).toEqual(expected);
	})
});

describe("functionProcessing", function(){
	it("should extract functions of each file", function(){
		api.functionProcessing(function(result){
			// console.log(JSON.stringify(result, undefined, 4));
			expect(_.size(result)).toBe(13);
			var expected = ["Tile","<anonymous>.savePosition","<anonymous>.updatePosition","<anonymous>.serialize"];
			expect(result['/root/examples/2048/js/game/tile.js']).toEqual(expected);
		});
	});

	it("should extract functions of each file", function(){
		api.functionProcessing(function(result){
			// console.log(JSON.stringify(result, undefined, 4));
			expect(_.size(result)).toBe(13);
			var matrix = api.relationMatrix(result);
			// console.log(JSON.stringify(matrix, undefined, 4));

		});
	});
});


