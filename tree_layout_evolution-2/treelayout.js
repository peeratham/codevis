function flatten(root) {
  var nodes = [],
    i = 0;
 var path ='';

  function recurse(node) {
    if (node.children) { //sum the size of each children of current node
      //generate node.path that has children
      node.path = path+'/'+node.name;
      path = path+'/'+node.name;
      node.size = node.children.reduce(function(p, v) { //assign size of cuurent node
        return p + recurse(v);
      }, 0);
    }
    else{
      //generat node.path with no children
      node.path = path+'/'+node.name;
    }
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
  return nodes;
}

var root;
var i = 0;
var nodes = [];
var links = [];
var diameter = 960;
var duration = 1000;
var width = diameter,
    height = diameter;
var tree = d3.layout.tree()
    .size([360, diameter / 2 - 80])
    .separation(function(a, b) {
      return (a.parent == b.parent ? 1 : 2) / a.depth;
    });
    
var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

function contains(nodeName, parentNode){ //check if parentNode is a directory before use this
   for (i = 0; i < parentNode.children.length; i++) { 
        if(parentNode.children[i].name==nodeName){
            return i;
        }
    }

    return -1;  //not found
}

//d3 tree format
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
    // the parent is now constructed with empty namespaces and can be used.
    // we return the outermost namespace
    return current;
}

function goto_node(root, path){
    var parts = path.split("/");
    var current = root;
 
    // we want to be able to include or exclude the root namespace so we strip
    // it if it's in the namespace
    if (parts[0]==="root" &&parts.length==1){
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

function deleteNode(root, path){
    console.log('hello');
    
     var parts = path.split("/");
     var targetNodeName = parts.pop();
     var parentPath = parts.join('/');
     console.log('parent of target:'+JSON.stringify(parentPath));
     var parentNode = goto_node(root, parentPath);
     var index = contains(targetNodeName, parentNode);
    
     if(index!=-1){
        parentNode.children.splice(index,1);
     }
}

d3.json('data.json', function(error, data) {
   
  root=data;
  flatten(root); //add path information
  root.x0 = height / 2;
  root.y0 = 0;
   

  update(root);
  console.log('before:'+i);
  setTimeout(function(){
    createTree(root,'root/libs/d3lib/diagonal.js');
    update(root);

  }, 1000);
  setTimeout(function(){
    createTree(root,'root/libs/d3lib/barchart.js');
    update(root);

  }, 2000);


  setTimeout(function(){
    deleteNode(root,'root/libs/d3lib/diagonal.js');
    update(root);

  }, 3000);

  setTimeout(function(){
  deleteNode(root,'root/libs/angularjs/directives.js');
  update(root);

  }, 4000);


});



 function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root),
      links = tree.links(nodes);
  console.log(nodes);
  console.log(links);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 80; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.path.substring(1); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      //.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
      .attr("x", 10)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      //.attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length * 8.5)  + ")"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1)
      .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length + 50)  + ")"; });

  // TODO: appropriate transform
  var nodeExit = node.exit().transition()
      .duration(duration)
      //.attr("transform", function(d) { return "diagonal(" + source.y + "," + source.x + ")"; })
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

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  
  update(d);
}



