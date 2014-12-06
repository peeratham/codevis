describe("Tree Creation", function() {
  it('should create a tree', function(){
      var t = Tree();
      expect(t.data()).toBe(undefined);
      t = Tree('root');
      expect(t.data()).toEqual({name: 'root', children:[]});
  });
});

describe("Tree Creation from Existing data", function(){
  it('should create tree from existing data', function(){
      var t = Tree();
      var data = {name:'root', children:[{name:'child'}]};
      var expected = {name:'root', path:'/root', children:[{name:'child', path:'/root/child'}]};
      t.data(data);
      expect(t.data()).toEqual(expected);
      expect(data).toEqual(expected); //affect the data itself
  })
});

describe('Tree should be able to add/remove node', function(){
  it('should add node', function(){
      var t = Tree();
      var data = {name:'root', children:[{name:'child.js'}]};
      var expectedAdd = {name:'root', children:[{name:'child.js', path:'/root/child.js'}, {name:'child2.js', path:'/root/child2.js'}], path:'/root'};
      t.data(data);
      t.addNode('/root/child2.js');
   		expect(data).toEqual(expectedAdd);
   		// console.log(JSON.stringify(data, undefined,4));
   		// console.log(JSON.stringify(expectedAdd, undefined,4));

  });

    it('should remove node', function(){
      var t = Tree();
      var data = {name:'root', children:[{name:'child.js', path:'/root/child.js'}, {name:'child2.js', path:'/root/child2.js'}], path:'/root'};
      var expectedRemove = {name:'root', children:[{name:'child.js', path:'/root/child.js'}], path:'/root'};
      t.data(data);
      t.removeNode('/root/child2.js');
   		expect(data).toEqual(expectedRemove);
   		// console.log(JSON.stringify(data, undefined,4));
   		// console.log(JSON.stringify(expectedAdd, undefined,4));

  });

});

