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
