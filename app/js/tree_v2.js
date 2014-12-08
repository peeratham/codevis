function TreeDiagram(p) {
  var firstTime = true;
  var that = {};
  var _parent =  d3.select(p);
  var _diameter=400;
  var _root;
  var duration = 1000;
  var _treeSize = _diameter/2-5;

  var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.name; });
  var zoom = d3.behavior.zoom()
    .scaleExtent([0.5, 10])
    .on("zoom", zoomed);
  
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
  svg.call(zoom);

  function zoomed() {
    body.attr("transform", "translate("  + (d3.event.translate[0]+_diameter / 2)+","+ (d3.event.translate[1]+_diameter / 2)+")scale(" + d3.event.scale + ")");
  }
  
    svg.on("click", resetFocus);



  that.render = function(){
    _update(_root);
    _simplifyStructure(8);
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
            )
            .on("contextmenu", rightclick)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", leftclick)
            // .on('mouseover', tip.show)
            // .on('mouseout', tip.hide)
            ;

      gnodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      gnodeEnter.append("text")
      .attr("x", 10)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) {  
        if(d.name.length>8){
          return d.name.substr(0,8)+'...';   
        }else{
          return d.name;
        }
      })
      .style("fill-opacity", 1e-6);

      //fix NaN when _nodes <=2
      if(_nodes.length <= 2){ gnode.data().forEach(function(d,i){ d.x = 90;})}

      //update to new position to form radial layout
      var gnodeUpdate = gnode.transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; 
      });

      var c=d3.rgb("white");

      gnodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { 
          var dependencyNodes = _relations[d.path];
          // if(dependencyNodes){
          //   console.log(dependencyNodes);
          //   return d._children ? "lightsteelblue" : c.brighter(dependencyNodes.length/20).toString();
          // }
          
        return d._children ? "lightsteelblue" : c.toString(); });

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

      // simplify()

  };

  // function simplify(){
  //     var _nodes = tree.nodes(_root);
  //     _nodes.forEach(function(d) {
  //       if(d.children){
  //         if(d.children.length>5 && d.name!='root'){
  //           toggle(d);
  //           _update(d);
  //         } 
  //       }
  //     });

  // }

  // Toggle children.
  function toggle(d) {
    if (d.children) {
      console.log(d);
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

  function selectNodeFromPath(path){  //return dom; if want data .datum()
    var node = 
            svg.selectAll("g.node")
            .filter(function(d){
              return d.path==path});
    return node;
  }

  function selectMultipleNodes(pathList){ //return list of doms
    var nodes = [];
    if(pathList == undefined){
      return [];
    }
    pathList.forEach(

      function(path){
      nodes.push(selectNodeFromPath(path));
    });
    return nodes;
  }



  function rightclick(d) {
    try{ d3.event.preventDefault();} catch(err){};
    toggle(d); 
    _update(d); 
  }
  
  var _meta;
  var _relations;
  var _identifiers;
  

  var focusNode = "";
  var relatedNodes = {};
  var relatedPaths = [];
  var unfocusNodes = [];
  var hover = "";


  function mouseover(d) {
    tip.show(d);
    if(d.path == focusNode){
      return;
    }
     if(_.contains(relatedPaths, d.path)){
      console.log('already focused');
      return; //or make put some glow effect
    }
    try{
      d3.select(this).select("circle").style('fill','green','important');

      //if don't change relatedFiles when there's a focus
      if(focusNode==""){
      //update relatedFiles
      relatedNodes = _relations[d.path];
      relatedPaths = relatedNodes;
      if(relatedPaths.length>0){
        highlightRelatedFromPath(relatedPaths);
      }
    }
      
    }catch(error){
      // d.select("circle").style('fill','green','important'); 
    }
    hover = d.path;
    notifyChanges();

  }

  var isNodeClick = false;
  var lastRelatedPaths = [];
  function leftclick(d){
    // console.log('d.path',d.path);
    // if click on the same node twice -> do nothing
    isNodeClick = true;
    if(d.path == focusNode){
      console.log('twice');
      isNodeClick = true; //signal svg listener that it's nodese click
      return;
    }

    if(_.contains(relatedPaths, d.path)){
      console.log('already focused');
      return; //display some useful info about the primary and this secondary one
    }
    unhighlightNodesFromPath([focusNode]);
    
    //unhighlight last nod
    focusNode = d.path;
    console.log('current', focusNode);
    highlightNodesFromPath([focusNode]);
    
    // console.log('related:',relatedPaths);
    unhighlightNodesFromPath(lastRelatedPaths);

    relatedNodes = _relations[d.path];
    lastRelatedPaths = relatedPaths;  //saved

    if(relatedPaths.length>0){
        highlightRelatedFromPath(relatedNodes);
    }
       // console.log('last',lastFocus);

  }

  function resetFocus(){

    setTimeout(function(){
      // if(focusNode==""){
      //   return;
      // }
      if(focusNode!="" && !isNodeClick){
        // unhighlightNodesFromPath([focusNode]);
             unhighlightNodesFromPath([focusNode]); //unhightlight last focus first
           unhighlightNodesFromPath(lastRelatedPaths);
             focusNode = "";
             relatedPaths = [];
           }
           isNodeClick = false;

           notifyChanges();  
      }, 50);

  }

  function highlightNodesFromPath(paths){   //refactor later to use class #active and d3.selectAll(#active) to unhighlight
      var nodes = selectMultipleNodes(paths);
      nodes.forEach(function(node){
        node.select("circle").style('fill','yellow','important'); 
      });
  }

  function highlightRelatedFromPath(paths){   //refactor later to use class #active and d3.selectAll(#active) to unhighlight
      var nodes = selectMultipleNodes(paths);
      nodes.forEach(function(node){
        node.select("circle").style('fill','orange','important'); 
      });
  }

    function unhighlightNodesFromPath(paths){   //refactor later to use class #active and d3.selectAll(#active) to unhighlight
      var nodes = selectMultipleNodes(paths);
      nodes.forEach(function(node){
        node.select("circle").style('fill','white','important'); 
      });
  }

  function mouseout(d) {
    tip.hide(d);
    if(focusNode!="" && d.path == focusNode){
      hover="";
      notifyChanges();
      return;}
    if(_.contains(relatedPaths, d.path)){ // console.log('already focused');
      return;                             //or make put some glow effect
    }
    d3.select(this).select("circle").style('fill',function(d) { 
        return d._children ? "lightsteelblue" : "#fff"; }, "important");

    
    unhighlightNodesFromPath(relatedPaths); //unhighlight
    //if there's a focusNode don't reset, keep the relatedFiles of the focusNode
    if(focusNode==""){  //only reset when there's no focus
      relatedPaths = [];
    }else{
      highlightRelatedFromPath(relatedPaths);
    }
    

    setTimeout(function(){  //make some delay so don't change it to quick
      hover="";
      notifyChanges();
    },50);

    
  }
  
  that.functions = function(funcs){
    _functions = funcs;
  };

  that.relations = function(relations){
    _relations = relations;
  };

  that.identifiers = function(identifiers){
    _identifiers = identifiers;
  };

  function notifyChanges(){
    var report = {
      focusNode: focusNode,
      relatedPaths: relatedPaths,
      hover: hover
    };
    listener(report);
  }
  var state = {};
  var listener;
  that.listener = function(callback){
    listener = callback;  
  }

  function _simplifyStructure(num){
 //   var nodes = d3.selectAll("g.node");
 //   nodes.forEach(function(d) { 
    
 //    d.forEach(function(el){

 //      });
 //   });
 }

  
  that.test = function(){
    console.log('test');
   
    var focus = selectNodeFromPath('/root/examples').datum();
      // focus[0].datum(function(d){console.log(d);});

    var paths = ['/root/examples/tessel/index.html','/root/assets/js/meta.js', '/root/bower.json'];
    setTimeout(function(){ 
      rightclick(focus);
       
      highlightNodesFromPath(paths);  
    }, 1000);

    setTimeout(function(){ 
      rightclick(focus);
       
      unhighlightNodesFromPath(paths);  
    }, 2000);


  }

  return that;
}

