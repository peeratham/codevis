// var body = d3.select("body").select("div");
// d3.json('data.json', function(error, data) {
//   var tree = Tree(body);
//   tree.data(data);
//   tree.render();

//   tree.addClickListener(function(info){
//     if(info.focus!=false){
//       console.log('focus on'+ info.focus.name);  
//     }else{
//       console.log('unfocus');
//     }});

    
//   tree.addMouseoverListener(function(d){});
//   tree.addNode('root/libs/modules');
//   tree.deleteNode('root/libs/d3lib/axis.js');

//   tree.update();

// });

function Tree(element){
  var that = {};
  var root;
  var i = 0;
  var focus=false;
  var nodes = [], links = [];
  var diameter = 600;
  var duration = 1000;
  var width = diameter, height = diameter;
  var tree =  d3.layout.tree()
  .size([360, diameter / 2 - 80])
  .separation(function(a, b) {
    return (a.parent == b.parent ? 1 : 2) / a.depth;
  });

  var diagonal = d3.svg.diagonal.radial()
  .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  var svg = d3.select(element).append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .append("g")
  .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


that.data = function(data){
  root = data;
}

that.root = function(){
  return root;
}

that.render = function (){
  flatten(root); //add path information
  root.x0 = height / 2;
  root.y0 = 0;
  _update(root);
  return that;
};

that.addNode = function (path){
  createTree(root, path);
  return that;
};

that.deleteNode = function (path){
  _deleteNode(root, path);
  return that;
};

that.update = function(){
  _update(root);
}

that.selectNode = function(path){
  return selectNodeByPath(path);
}

function _update(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(root),
  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 80; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
  .data(nodes, function(d) { return d.path.substring(1); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
  .attr("class", "node")
  .on("click", click)
  .on("mouseover", mouseover)
  .on("mouseout", mouseout)
  .on("contextmenu", rightclick);

  nodeEnter.append("circle")
  .attr("r", function(d){return 1e-6})
  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
  .attr("x", 10)
  .attr("dy", ".35em")
  .attr("text-anchor", "start")
  .text(function(d) { return d.name; })
  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
  .duration(duration)
  .attr("transform", function(d) { 
    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  nodeUpdate.select("circle")
  .attr("r", function(d){ return d.size*10/root.size > 4 ? d.size*10/root.size : 3;})
  .style("fill", function(d) { 
    return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
  .style("fill-opacity", 1)
  .attr("transform", function(d) { 
    return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length + 50)  + ")"; });

  // TODO: appropriate transform
  var nodeExit = node.exit().transition()
  .duration(duration)
  .remove();

  nodeExit.select("circle")
  .attr("r", 1e-6);

  nodeExit.select("text")
  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
  .data(links, function(d) { return d.target.path; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
    });

      // Transition links to their new position.
      link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
  .duration(duration)
  .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
  })
  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function highlightNodes(nodes,color){
  nodes.forEach(function(d){
    var node = selectNodeByPath(d.path);
    node.select("circle").style('fill',color,'important');
  });
}

// Toggle children on click.
var compareNodes = [];
function click(d) {
  if (focus === d){ //unclick
    //undo highlighting
    d3.select(this).select("circle").style('fill','white','important');
    highlightNodes(compareNodes,'white');
    compareNodes = [];
    //then
    focus = false;
  } else{
    //otherwise
    if(focus){
      if(compareNodes.indexOf(d)==-1){
        compareNodes.push(d);
        d3.select(this).select("circle").style('fill','yellow','important');
      }
      console.log(compareNodes);
      return;
    }
    focus = d;
    d3.select(this).select("circle").style('fill','red','important');  
    
  }
  
  //notify listener
  clickListener({"focus": focus, "compare": compareNodes});
}


var treeListener;


that.addClickListener = function(listener){
  clickListener = listener;
}


function isDirectory(d){
  return d.children? true : false;
}

function currentDirectory(d){
  
  return d.parent.path;
}

function formatPath(path){
  var result = path.trim();
  if(path[path.length-1]=='/'){
    return path.substring(0, path.length-1);
  }else{
    return result;
  }
}

function getAbsolutePath(currentDirectory, relativePath){
  var current_parts = currentDirectory.split('/');
  var relative_parts = relativePath.split('/');
  while(relative_parts.length>0){
    if(relative_parts[0]=='.'){
      //concat
      relative_parts.shift();
      return formatPath(current_parts.concat(relative_parts).join('/'));
    }
    if(relative_parts[0]=='..'){
       current_parts.pop();
       relative_parts.shift();
       if(relative_parts[0]!='..'){
          return formatPath(current_parts.concat(relative_parts).join('/'));     
       }
    }
  }
}


// console.log(getAbsolutePath('/root/libs', './'));
// console.log(getAbsolutePath('/root/libs/angularjs', '../d3lib')); //==/root/d3lib/axis.js


function selectNodeByPath(path){
  var node = svg.selectAll("g.node")
          .filter(function(d){return d.path==path});
  return node;
}

function mouseover(d){

  d3.select(this).select("circle")
    .style('fill', colors.nodes.hover);
  mouseOverListener(d);
  // console.log(this);
  //  console.log(d);
}

var mouseOverListener;
that.addMouseoverListener = function(listener){
  mouseOverListener = listener;
}

function mouseout(d){
  d3.select(this).select("circle")
    .style('fill', colors.nodes.normal);
}

function rightclick(d){
  d3.event.preventDefault();
   if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }

  _update(d);

}

var colors = {
      links: 'FAFAFA'
    , text: {
        subtitle: 'FAFAFA'
    }
    , nodes: {
        method: function(d) {
            return 'lightsteelblue';
        }
        , click: 'black'
        , hover: 'lightsteelblue'
        , dep: '252929'
        , normal: 'white'
    }
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
  // console.log(nodes);
}

function contains(nodeName, parentNode){ //check if parentNode is a directory before use this
 for (i = 0; i < parentNode.children.length; i++) { 
  if(parentNode.children[i].name==nodeName){
    return i;
  }
}
    return -1;  //not found
  }

//test should return -1 if parentNode is not a directory

//work with d3 tree format {name:'bar', children:[{name:'foo'}]}
// input path need to include root
function createTree(root, path) {
  var parts = path.split("/");
  var current = root;
    // we want to be able to include or exclude the root namespace so we strip
    // it if it's in the namespace
    if (parts[0] === "root") {
      parts = parts.slice(1);
    }
    // loop through the parts and create a nested namespace if necessary
    for (var i = 0; i < parts.length; i++) {
      var partname = parts[i];
        //if last part check to see if it's directory of file
        if(i == parts.length-1){
          var last_parts = partname.split('.');
          if(last_parts.length>1){
            current.children.push({name:partname, path:'/'+path}); 
            break;
          }
        }
        //need to check if we have that sub directory or file
        var index = contains(partname, current);
        if(index == -1){
          current.children.push({name:partname, path:'/'+path, children:[]}); 
          index = current.children.length-1;
        }
        // get a reference to the deepest element in the hierarchy so far
        current = current.children[index];
      }
      return current;
    }


  //test create root/lib
  //test create root/index.html
  //test create node with the same name should fail

  function goto_node(root, path){
    var parts = path.split("/");
    var current = root;

    if (parts[0]==="root" && parts.length== 1){
      return root;
    }
    if (parts[0] === "root") {
      parts = parts.slice(1);
    }

    // loop through the parts & go as deep to the target
    for (var i = 0; i < parts.length; i++) {
      var partname = parts[i];

        //need to check if we have that sub directory or file
        var index = contains(partname, current);
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

    function _deleteNode(root, path){
     var parts = path.split("/");
     var targetNodeName = parts.pop();
     var parentPath = parts.join('/');
     var parentNode = goto_node(root, parentPath);
     var index = contains(targetNodeName, parentNode);

     if(index!=-1){
      parentNode.children.splice(index,1);
    }
  }

  return that;

}