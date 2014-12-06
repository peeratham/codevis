function Bubble (p) {
	
	 var that = {};
  	 var _parent =  d3.select(p);
  	 var _width = 500;
  	 var _height = 300;
  	 var format = d3.format(",d"),
    	color = d3.scale.category20c();

  	 var bubble = d3.layout.pack()
  	     .sort(null)
  	     .size([_width, _height])
  	     .padding(1.5);

  	 var svg = _parent.append("svg")
      .attr("width", _width)
      .attr("height", _height)
      .attr("class", "bubble");

  	 that.data = function(data){
  	 	_data = data;
  	 	console.log(_data);
  	 }

  	

  	 function _render(){
  	 	var node = svg.selectAll(".node").remove();
  	 	var node = svg.selectAll(".node")
	        .data(bubble.nodes(_data)
	        .filter(function(d) { return !d.children; }));
	        
	      node.enter().append("g")
	        .attr("class", "node")
	        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	      node.exit().remove();

	  node.append("title")
      .text(function(d) { return d.name + ": " + format(d.name.length); });

      node.append("circle")
      .attr("r", function(d) { return d.className.length; })
      .style("fill", function(d) { return color(d.className); })
      .on("click",function(d){
      	console.log(d.name);
      });


      node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name.substring(0, d.r / 3); });

  	 }
  	 
  	 that.render = function(){
  	 	_render();
  	 }
     

	  

    return that;
}

function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({className: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}



