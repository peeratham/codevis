
//testing
  var div,
      diagram,
        // data={name:'root', children:[{name:'child1'}]};
        // data={name:'D3', path:'/D3', children:[{name:'lib', path:'/D3/lib', children:[{name:'modules', path:'/D3/lib/modules', children:[{name:'force.js', path:'/D3/lib/modules/force.js'}]}, {name:'angular.js', path:'/D3/lib/angular.js'}]}]};
        // data={name:'root', children:[{name:'child1'}, {name:'child2'}, {name:'child3'}]};
       data={name:'root', children:[{name:'child1'}, {name:'child2', children:[{name:'child3'}, {name:'child4'},{name:'child5'}]},{name:'child6'},{name:'child'}]};

// d3.json("flare.json", function(data) {
  div = d3.select('body').append('div');
  diagram = TreeDiagram(div);
  diagram.data(data);
  diagram.update();

// });


    function svg() {
        return div.select('svg');
    }

    function diagramBody() {
        return svg().select('g.body');
    }

    function g_nodes() {
        return diagramBody().selectAll('g.node');
    }
    function nodes() {
        return g_nodes().selectAll('circle.node');
    }

/////////


function TreeDiagram(p) {
  var that = {};
  var _parent = p, _diameter=500;
  var _root;
  var duration = 1000;
  

  // a radial layout where 
  // the tree breadth (x) is measured in degrees, and
   // the tree depth (y) is a radius r in pixels, say [360, r].
  var tree = d3.layout.tree()
    .size([360, _diameter / 2 -80 ])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });


  var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI];});

      var svg = _parent.append("svg")
      .attr("width", _diameter)
      .attr("height", _diameter-50);
  var body = svg.append("g")
      .attr("class", 'body')
      .attr("transform", "translate(" + _diameter / 2 + "," + _diameter / 2 + ")");


  that.update = function(){
    _update(_root);
  }

  function _update(source){
    //compute new tree layout
      var _nodes = tree.nodes(_root);

      // Normalize for fixed-depth.
      _nodes.forEach(function(d) { d.y = d.depth * 50; });

      var gnode = body.selectAll("g.node").data(_nodes, function(d){return d.name});

     
      //Enter new node at parent's previous position
   var gnodeEnter = gnode.enter().append("g")
     .attr("class", "node")
     // .attr("transform", function(d) { return "translate("+ source.y0 + ")"; })
     .attr("transform", function(d) { 
      //enter from parent position//
      var parent_el = gnode.filter(function(d0, i){ if(d0 && d.parent){ return d0.name == d.parent.name;}});
      var parent_transform0;
      if(parent_el[0].length){
        parent_transform0 =  parent_el.attr('transform');
        // console.log(parent_transform0); 
      }
       return parent_transform0;
     })
     .on("click", function(d) { 
      toggle(d); 
      _update(d); 
    });


     gnodeEnter.append("circle")
       .attr("r", 1e-6)
       .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    gnodeEnter.append("text")
    .attr("x", 10)
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);


//fix NaN when _nodes <=2
      if(_nodes.length <= 2){ gnode.data().forEach(function(d,i){ d.x = 90;})}
      // if(_nodes.length == 1){ gnode.data().forEach(function(d,i){ d.x = 90;})}

      //Transition nodes to their new position

      var gnodeUpdate = gnode.transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; 
      });

      gnodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { 
        return d._children ? "lightsteelblue" : "#fff"; });

      gnodeUpdate.select("text")
      .style("fill-opacity", 1)
      .attr("transform", function(d) { 
        return d.x < 180 ? "translate(0)" : "rotate(180) translate(-" + (d.name.length + 50)  + ")"; });

      //transform
      var src_element = gnode.filter(function(d){return d.name==source.name});  
      var src_transform = src_element.attr('transform');

     
       // Transition exiting nodes to the parent's new position.
        // console.log(src_element.attr('transform'));
       var gnodeExit = gnode.exit().transition()
       .duration(duration)
       .attr("transform", function(d) { 
            // console.log(d.attr('transform'));

           // return "translate(" + d.parent.x + "," + d.parent.y + ")"; 
           return src_transform;
       }).remove();


       //Link
       _links = tree.links(_nodes);
       var link = body.selectAll("path.link")
            .data(_links, function(d){return d.target.name;});

       link.enter().insert("path", "g")
       .attr("class", "link")
       .attr("d", function(d) {
         var o = {x: source.x0, y: source.y0};
         return diagonal({source: o, target: o});
       });

       // Transition links to their new position.
       link.transition()
       .duration(1000)
       .attr("d", diagonal);

       link.exit().transition()
         .duration(duration)
         .attr("d", function(d) {
           var o = {x: source.x, y: source.y};
           return diagonal({source: o, target: o});
       }).remove();

       gnodeExit.select("circle")
       .attr("r", 1e-6);

       gnodeExit.select("text")
       .style("fill-opacity", 1e-6);




  // Stash the old positions for transition.
 body.selectAll('g.node').each(function(d){
       // console.log(d3.select(this).attr('transform'));
       d.transform0 = d3.select(this).attr('transform');
 });

  _nodes.forEach(function(d) {
    

      
      
      // console.log(src_transform);    

    // d.transform0 = src_transform;
    d.x0 = d.x;
    d.y0 = d.y;
  });


  };

  // Toggle children.
  function toggle(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  }

  that.diameter = function (d) {
      if (!arguments.length) return _diameter;
      _diameter = d;
      return that;
  };

  that.data = function (root) {
    if (!arguments.length) return _root;
    _root = root;
          _root.x0 = _diameter/2;
      _root.y0 = 0;
    return that;
  };


  return that;
}



function createDirNode(dirName, path){
  return {name:dirName.trim(), path:formatPath(path), children:[]};
}
function createFileNode(nodeName, path){
  return {name:nodeName.trim(), path:formatPath(path)};
}

function isFileNode(nodeName){
  var parts = nodeName.split('.');
  return parts.length > 1;
}

function createNode(nodeName, path){
  if(isFileNode(nodeName)){
    return createFileNode(nodeName, path);
  }else{
    return createDirNode(nodeName, path);
  }
}

function formatPath(path){
  path = path.trim();

  if(path[0] !='/'){
    path = '/'.concat(path);
  }
  if(path[path.length-1]=='/'){
    path = path.substring(0,path.length-1);
  }
  return path;
}

function addNode(root, nodePath) {
  var nodePath = formatPath(nodePath);
  nodePath = nodePath.substring(1,nodePath.length); //drop front slash
  var parts = nodePath.split('/'); 
  var current = root;

    // loop through the parts and create a nested namespace if necessary
    for (var i = 1; i < parts.length; i++) {  //start from 1 (ignore the root)
        var partname = parts[i];
        //if last part check to see if it's directory of file
        if(i == parts.length-1){
          if(isFileNode(partname)){
            current.children.push({name:partname, path:formatPath(nodePath)}); 
            break;
          }
        }
        //need to check if we have that sub directory or file
        var index = containsChild(current, partname);
        if(index == -1){
          current.children.push({name:partname, path:formatPath(parts.slice(0,i+1).join('/')), children:[]}); 
          index = current.children.length-1;
        }
        // get a reference to the deepest element in the hierarchy so far
        current = current.children[index];
      }
}

function gotoNode(root, path){
  var path = formatPath(path);
  path = path.substring(1,path.length); //drop front slash
  var parts = path.split('/'); 
  var current = root;

  if (parts.length==1 && parts[0]==root.name){
    return root;
  }
  // loop through the parts & go as deep to the target
  for (var i = 1; i < parts.length; i++) {
    var partname = parts[i];

      //need to check if we have that sub directory or file
    var index = containsChild(current, partname);
    if(index == -1){
        return null;    //before final or at final if not found terminate early
      }
    if(i == parts.length-1 && index !=-1){        //only return node found if at last part
      return current.children[index];
    } 
    // get a reference to the deepest element in the hierarchy so far
    current = current.children[index];
  }
}

function removeNode(root, path){
  var path = formatPath(path);
      path = path.substring(1,path.length); //drop front slash
  var parts = path.split('/'); 
  
  var targetNodeName = parts.pop();
  var parentPath = formatPath(parts.join('/'));
  var parentNode = gotoNode(root, parentPath);
  if (parentNode==null){  //no node for deletion found
    return;
  }
   var index = containsChild(parentNode, targetNodeName);

   if(index!=-1){
    parentNode.children.splice(index,1);
  }
}

function containsChild(parentNode, nodeName){ //check if parentNode is a directory before use this
  if (!parentNode.children) {
    return -1;
  }
  for (i = 0; i < parentNode.children.length; i++) { 
    if(parentNode.children[i].name==nodeName){
      return i;
    }
  }
    return -1;  //not found
}



