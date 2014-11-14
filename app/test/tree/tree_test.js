// describe("D3 Tree Layout", function(){
// 	var div,
//         diagram,
//        data={name:'root', children:[{name:'child1'}]};

//     beforeEach(function () {
//         div = d3.select('body').append('div');
//         diagram = TreeDiagram(div);
//     });

//     afterEach(function () {
//         div.remove();
//     });

//     describe('.data', function () {
//         it('should allow setting and retrieve root', function () {
//             expect(diagram.data(data).data()).toBe(data);
//         });
        
//     });

//     describe('.update', function () {
//         describe('svg', function () {
//         	it('should generate svg', function () {
//                 diagram.update();
//                 expect(svg()).not.toBeEmpty();
//             });

//             it('should set default svg height and width', function () {
//                 diagram.update();
//                 expect(svg().attr('width')).toBe('500');
//                 expect(svg().attr('height')).toBe('450');
//             });
//             it('should allow changing svg height and width', function () {
//                 diagram.diameter(600).update();
//                 expect(svg().attr('width')).toBe('600');
//                 expect(svg().attr('height')).toBe('550');
//             });

//         });

//         describe('diagram body', function () {
//             it('should create body g', function () {
//                 diagram.update();
//                 expect(diagramBody()).not.toBeEmpty();
//             });

//             it('should translate to (left, top)', function () {
//                 diagram.update();
//                 var default_diameter = 500;
//                 expect(diagramBody().attr('transform')).toBe("translate(" + default_diameter / 2 + "," + default_diameter / 2 + ")");
//             });
//         });

//         describe('nodes', function () {
//             beforeEach(function () {
//                 diagram.data(data).update();
//             });
//             it('should create a root node', function () {
//             	console.log(diagram.data());
//                 expect(g_nodes().size()).toBe(1);
//                 expect(nodes().size()).toBe(0);
//             });
//              // data = {name:'root', children:[{name:'child1'}, {name:'child2'}]}


//         });

//     });


    // function svg() {
    //     return div.select('svg');
    // }

    // function diagramBody() {
    //     return svg().select('g.body');
    // }

    // function g_nodes() {
    //     return diagramBody().selectAll('g.node');
    // }
    // function nodes() {
    //     return g_nodes().selectAll('circle.node');
    // }



// });

describe("flatten", function(){
  var data={name:'root', children:[{name:'child1'}]};
  it("should add compute path", function(){
    flatten(data);
    // expect(flatten(data)).toEqual({name:'root', path:'/root', children:[{name:'child1', path:'/root/child1'}]});
    console.log(JSON.stringify(data,undefined,4));
  });
  

});

describe("Tree Creation", function() {
  
  beforeEach(function() {
    this.root = createDirNode('D3', ' /D3 ');
  });

  
  it("should create a directory node inside a given directory", function() {
  	addNode(this.root, '/D3/lib');
  	expect(this.root).toEqual({name:'D3', path:'/D3', children:[{name:'lib', path:'/D3/lib', children:[]}]});
  });

  
  it("should create a file node inside a given directory", function() {
  	addNode(this.root, '/D3/index.js');
  	expect(this.root).toEqual({name:'D3', path:'/D3', children:[{name:'index.js', path:'/D3/index.js'}]});
  });

  
  it("should create nodes correctly inside a given directory", function() {
  	addNode(this.root, '/D3/index.js');
  	addNode(this.root, '/D3/d3.js');
  	addNode(this.root, '/D3/lib');
  	addNode(this.root, '/D3/lib/angular.js');
  	expect(this.root).toEqual({name:'D3', path:'/D3', children:[{name:'index.js', path:'/D3/index.js'},{name:'d3.js', path:'/D3/d3.js'}, {name:'lib', path:'/D3/lib', children:[{name:'angular.js', path:'/D3/lib/angular.js'}]}]});
  });

  it("should create non existing directory automatically", function(){

  	addNode(this.root, '/D3/lib/modules/force.js');
  	addNode(this.root, '/D3/lib/angular.js')
  	var tree = {name:'D3', path:'/D3', children:[{name:'lib', path:'/D3/lib', children:[{name:'modules', path:'/D3/lib/modules', children:[{name:'force.js', path:'/D3/lib/modules/force.js'}]}, {name:'angular.js', path:'/D3/lib/angular.js'}]}]};
  	expect(this.root).toEqual(tree);

  	// console.log(JSON.stringify(tree, undefined, 4));
  	// console.log(JSON.stringify(this.root));
  });

	describe("gotoNode", function() {
	 	beforeEach(function(){
			this.root = {name:'D3', path:'/D3', children:[{name:'lib', path:'/D3/lib', children:[{name:'modules', path:'/D3/lib/modules', children:[{name:'force.js', path:'/D3/lib/modules/force.js'}]}, {name:'angular.js', path:'/D3/lib/angular.js'}]}]};
 		});
	 	it("should return root", function(){
	 		expect(gotoNode(this.root, '/D3')).toEqual(this.root);
	 	});
	 	it("should traverse to a given node and return a reference of that node", function(){
	 		expect(gotoNode(this.root, '/D3/lib/modules/force.js')).toEqual({name:'force.js', path:'/D3/lib/modules/force.js'});
	 	});
	 	it("should traverse to a given node and return a reference of that node", function(){
	 		expect(gotoNode(this.root, '/D3/lib/modules')).toEqual({name:'modules', path:'/D3/lib/modules', children:[{name:'force.js', path:'/D3/lib/modules/force.js'}]});
	 	});
	 	it("should return null if not found", function(){
	 		expect(gotoNode(this.root, '/D3/d3.js')).toEqual(null);
	 	});

	 });

	 describe("removeNode", function() {
	 	beforeEach(function(){
	 		this.root = {name:'D3', path:'/D3', children:[{name:'lib', path:'/D3/lib', children:[{name:'modules', path:'/D3/lib/modules', children:[{name:'force.js', path:'/D3/lib/modules/force.js'}]}, {name:'angular.js', path:'/D3/lib/angular.js'}]}]};
	 	});
	 	it("should remove a given node from the tree", function(){
	 		removeNode(this.root,'/D3/lib');
	 		expect(this.root).toEqual({name:'D3', path:'/D3', children:[]});
	 	});

	 	it("should remove a given node from the tree", function(){
	 		removeNode(this.root,'/D3/lib/angular.js');
	 		removeNode(this.root,'/D3/lib/modules/force.js');
	 		expect(this.root).toEqual({name:'D3', path:'/D3', children:[{name:'lib', path:'/D3/lib', children:[{name:'modules', path:'/D3/lib/modules', children:[]}]}]});
	 	});

	 	it("should be no changes", function(){
	 		removeNode(this.root,'/D3/d3.js');
	 		expect(this.root).toEqual(this.root);
	 	});
	 });


});



describe("Tree Helper Function", function() {
	var dir = createDirNode('D3', ' /D3 ');

	it("should create a directory node with a given name and path", function() {
		expect(dir).toEqual({name:'D3', path:'/D3', children:[]});
	});

	var file = createFileNode(' index.js ', ' /lib/index.js ');
	it("should create a file node with name", function() {
		expect(file).toEqual({name:'index.js', path:'/lib/index.js'});
	});

	it("should recognize file node if file has extension", function() {
		expect(isFileNode('index.js')).toBe(true);
		expect(isFileNode('.bin')).toBe(true);
		expect(isFileNode('bin')).toBe(false);
	});

	it("should format path so that each path has / at the beginning and no / at the end", function(){
		expect(formatPath('/lib/d3/d3.js')).toEqual('/lib/d3/d3.js');
		expect(formatPath('lib/d3/d3.js ')).toEqual('/lib/d3/d3.js');
		expect(formatPath('/lib/d3/')).toEqual('/lib/d3');
		expect(formatPath(' /lib/d3/ ')).toEqual('/lib/d3');
	});

	it("should create a file node with name", function() {
  	expect(createNode('index.js','/index.js ')).toEqual({name:'index.js', path:'/index.js'});
  	expect(createNode('lib', ' /lib')).toEqual({name:'lib', path:'/lib', children:[]});
  	});


	var parentNode1 = {name:'parent', path:'/parent', children:[]};
	var parentNode2 = {name:'parent', path:'/parent', children:[{name:'d3'}]};
	var parentNode3 = {name:'parent', path:'/parent', children:[{name:'d3'}, {name:'angular.js'}, {name:'html'}]};
	var parentNode4 = {name:'parent', path:'/parent'};
	it("containsChild should report index of a node with a given name if it is an immediate children of this parent node", function(){
		expect(containsChild(parentNode1, 'd3')).toBe(-1);
		expect(containsChild(parentNode2, 'd3')).toBe(0);
		expect(containsChild(parentNode3, 'html')).toBe(2);
		expect(containsChild(parentNode4, 'html')).toBe(-1);
	});

});
