var div,diagram;
    //data so name doesn't have to be root anymore you can assign any name as root
    //you can use real data by uncomment d3.json 
    // data={name:'root', children:[{name:'child1'}]};
    // data={name:'root', children:[{name:'child1'}, {name:'child2'}, {name:'child3'}]};
    // data={name:'root', children:[{name:'child1'}, {name:'child2', children:[{name:'child3'}, {name:'child4'},{name:'child5'}]},{name:'child6'},{name:'child'}]};
      data={
          "name": "D3",
          "path": "/D3",
          "children": [
            {
              "name": "lib",
              "path": "/D3/lib",
              "children": [
                {
                  "name": "modules",
                  "path": "/D3/lib/modules",
                  "children": [
                    {
                      "name": "force.js",
                      "path": "/D3/lib/modules/force.js"
                    }
                  ]
                },
                {
                  "name": "angular.js",
                  "path": "/D3/lib/angular.js"
                }
              ]
            },
            {
              "name": "lib2",
              "path": "/D3/lib2",
              "children": [
                {
                  "name": "modules2",
                  "path": "/D3/lib/modules2",
                  "children": [
                    {
                      "name": "force2.js",
                      "path": "/D3/lib/modules2/force2.js"
                    }
                  ]
                },
                {
                  "name": "angular2.js",
                  "path": "/D3/lib2/angular2.js"
                }
              ]
            },
            {
              "name": "lib3",
              "path": "/D3/lib3",
              "children": [
                {
                  "name": "modules3",
                  "path": "/D3/lib3/modules3",
                  "children": [
                    {
                      "name": "force3.js",
                      "path": "/D3/lib3/modules3/force3.js"
                    }
                  ]
                }
              ]
            }
          ]
      };

// d3.json("structure.json", function(data) {   //comment/uncomment this line to use real data
  
  div = d3.select('body').append('div');


  diagram = TreeDiagram(div);  
  flatten(data);   
  diagram.data(data); 
  diagram.render(); 

  setTimeout(function(){
    addNode(data, '/D3/lib/modules/tree.js');
    diagram.update();
  }, 1000); 

  setTimeout(function(){
    removeNode(data, '/D3/lib/angular.js');
    diagram.update();
  }, 2000);

// }); 



function TreeDiagram(p) {
  var firstTime = true;
  var that = {};
  var _parent = p, _diameter=500;
  var _root;
  var duration = 1000;
  var _treeSize = _diameter/2-80;

  var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.name; });

  
  var tree = d3.layout.tree()
    .size([360, _treeSize])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });


  var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI];});

      var svg = _parent.append("svg")
      .attr("width", _diameter)
      .attr("height", _diameter-50);
  var body = svg.append("g")
      .attr("class", 'body')
      .attr("transform", "translate(" + _diameter / 2 + "," + _diameter / 2 + ")");

    body.call(tip);


  that.render = function(){
    _update(_root);
  }
  that.update = function(){
    _update();
  };

  function _update(parent){
     var isToggle = true;
     if (!arguments.length) {
        parent = _root;
        isToggle = false;
     }

     //compute new tree layout

      var _nodes = tree.nodes(_root);
      var _links = tree.links(_nodes);

      // Normalize for fixed-depth.
      _nodes.forEach(function(d) { d.y = d.depth * 50; });

      var gnode = body.selectAll("g.node").data(_nodes, function(d){return d.path});

     
      //Enter new node at parent's previous position
      var gnodeEnter = gnode.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { //enter from parent position//
                var parent_el = gnode.filter(function(d0, i){ if(d0 && d.parent){ return d0.name == d.parent.name;}});
                var parent_transform0;
                if(parent_el[0].length){ 
                    parent_transform0 =  parent_el.attr('transform');}
                    return parent_transform0;
                }
            ).on("click", function(d) { 
              toggle(d); 
              _update(d); 
            })
             .on('mouseover', tip.show)
             .on('mouseout', tip.hide)
            ;

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

      //update to new position to form radial layout
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
        return d.x < 180 ? "translate(0)" : "rotate(180) translate(-" + (d.name.length + 50)  + ")"; 
      });

       // Transition exiting nodes to the parent's new position.
       var gnodeExit = gnode.exit().transition()
       .duration(duration)
       .attr("transform", function(d) { 
           if(isToggle){
              return "rotate(" + (parent.x - 90) + ")translate(" + parent.y + ")"; 
           }else{
              return "rotate(" + (d.parent.x - 90) + ")translate(" + d.parent.y + ")"; 
           }
       }).remove();

       //Link
      //enter links 
       var link = body.selectAll("path.link")
            .data(_links, function(d){return d.target.path;});

       link.enter().insert("path", "g")
       .attr("class", "link")
       .attr("d", function(d) {


        if(isToggle){
          var o = {x: parent.x0, y: parent.y0};
          return diagonal({source: o, target: o});
        }else{
          var o = {x: d.source.x, y: d.source.y};
          return diagonal({source: o, target: o});
        }
       });

       // Transition links to their new position.
       link.transition()
       .duration(duration)
       .attr("d", diagonal);

       link.exit().transition()
         .duration(duration)
         .attr("d", function(d) {

          if(isToggle){
            var o = {x: parent.x, y: parent.y};
            return diagonal({source: o, target: o});
          }else{
            var o = {x: d.source.x, y: d.source.y};
            return diagonal({source: o, target: o});
          }

       }).remove();

         //Link Exits
       gnodeExit.select("circle")
       .attr("r", 1e-6);

       gnodeExit.select("text")
       .style("fill-opacity", 1e-6);


      // Stash the old positions for transition.
      _nodes.forEach(function(d) {
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

///////////////////////TreeUtilityFunction//////////////////////

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

  if(root.name != parts[0]){
    throw "root name is not the same: "+root.name +", "+parts[0];
    return
  }
    
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
    // parentNode.children[index] = null;
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


function flatten(root) {
  var nodes = [], i = 0;
  // var path ='';
  function recurse(node,path) {
    
    if (node.children) {
      //generate node.path that has children
      node.path = path+'/'+node.name;
      // path = path+'/'+node.name;

      node.size = node.children.reduce(function(p, v) {             
        return p + recurse(v,node.path);
      }, 0);
    }
    else{
      //generat node.path with no children
      node.path = path+'/'+node.name;
    }
    nodes.push(node);
    return node.size;
  }
  root.size = recurse(root,'');

  return nodes;
}
