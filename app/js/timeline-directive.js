'use strict';

var codevisComponents = angular.module('codevisComponents');

codevisComponents.directive('timelineChart',['ProjectEvolutionData',
	function(ProjectEvolutionData) {
		var link = function(scope, element, attrs){


			ProjectEvolutionData.query(function(data) {
var parseDate = d3.time.format("%Y-%m-%d").parse;
var len = data.length;
var Alljson=[];
var addData = [];
var delData =[];
var addNum=0;
var delNum=0;
for(var j=0;j<len;j++){
 	var json = {};
	for(var i=0;i<j+1;i++){		
		if(data[i].action === 'create'){
			var elements = data[i].path.split('/');
			var current = json;
			elements.forEach(function(element) {
				if (!current[element]) {
	       			current[element] = {};
	      		}
	      		current = current[element];
	    	});
			current.language = 'a';
	    	current.size = 100;
		}
		
	}
    json=getChildren(json)[0];
	json.name = 'root';
	Alljson.push(json);

	if(j<len-1 && data[j+1].action === 'delete'){
		for(var k=0;k<j+1;k++){
			if (data[k].path === data[j+1].path && data[k].action === 'create'){
				data[k].action = 'erase';
			}
		}
	}

	var time=data[j].date;
	if(j===len-1){
		if(time === data[j-1].date){
			if (data[j].action === 'delete') delNum++;
			else addNum++;
			addData.push([parseDate(time),addNum]);
			delData.push([parseDate(time),delNum]);
		}
		else{
			if (data[j].action === 'delete') delData.push([parseDate(time),1]);	
			else addData.push([parseDate(time),1]);
		}
	}
	else if(j<len-1 && time === data[j+1].date){
		if(data[j].action === 'delete') delNum++;
		else addNum++;
	}
	else if(j<len-1 && time !== data[j+1].date){
		if (data[j].action === 'delete') delNum++;
		else addNum++;

		addData.push([parseDate(time),addNum]);
		delData.push([parseDate(time),delNum]);
		addNum=0;
		delNum=0;
	}

}

var xx = d3.time.scale()
    .range([0, 800]);

var yy = d3.scale.linear()
    .range([300, 0]);


xx.domain(d3.extent(addData, function(d){return d[0];}));
yy.domain(d3.extent(addData, function(d){return d[1];}));

var xxAxis = d3.svg.axis()
    .scale(xx)
    //.tickFormat(function(d) { console.log(d);return d; })
    //.tickValues(parseDate([addData[0],addData[5]]))
    //.ticks(5)
    .orient("bottom");

var yyAxis = d3.svg.axis()
    .scale(yy)
    .orient("left");

var chartsvg = d3.select(element[0]).append('svg')
		.style("stroke", "#999")
		.style("fill", "#fff")
		.attr('class','chartsvg')
		.attr('width', 900)
		.attr('height', 400)
		.append('g')
		.attr("transform", "translate(" + 50 + "," + 50 + ")");

var chartFunction = d3.svg.line()
                  .x(function(d) { return xx(d[0]); })
                  .y(function(d) { return yy(d[1]); })
                  .interpolate("linear");
                                 
var Add = chartsvg.append("path")
        .attr("d", chartFunction(addData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

var addpoint = chartsvg.append("g")
		.attr("class", "add-point");

addpoint.selectAll('.addcir')
		.data(addData)
		.enter().append('circle')
		.attr("cx", function(d) { return xx(d[0]) })
		.attr("cy", function(d) { return yy(d[1]) })
		.attr("r", 3)
		.attr('class','addcir')
		.style("fill", "white")
		.style("stroke", "blue");




var Del = chartsvg.append("path")
        .attr("d", chartFunction(delData))
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("fill", "none");

var delpoint = chartsvg.append("g")
		.attr("class", "del-point");

delpoint.selectAll('.celcir')
		.data(delData)
		.enter().append('circle')
		.attr("cx", function(d) { return xx(d[0]) })
		.attr("cy", function(d) { return yy(d[1]) })
		.attr("r", 3)
		.attr('class','delcir')
		.style("fill", "white")
		.style("stroke", "red");


chartsvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0"+"," + 300 + ")")
      .call(xxAxis)
      .selectAll("text")
    //.attr("y", 60)
    //.attr("x", 30)
    	.attr('stroke-width', 1)
    	.attr('stroke', 'black')
      	.attr('fill', 'black');
   		//.style("text-anchor", "start");

chartsvg.append("g")
      .attr("class", "y axis")
      .call(yyAxis)
      .attr('fill', 'black' )
      .attr('stroke','black')
    .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .attr('stroke', 'black')
      .attr('fill', 'black')
      .attr("dy", ".0em")
      .text("ADD/DELETE");

  // chartsvg.append("path")
  //     .datum(data)
  //     .attr("class", "line")
  //     .attr("d", line);





var currentTimeFlower = new TimeFlower(element[0], 600, 500).update(Alljson[0]);

var moving,
	minValue=0,
	maxValue=150,
	currentValue=150,
	targetValue=150,
	brushHeight=60,
	width=600,
	alpha=0.25;

var svg = d3.select(element[0]).append('svg')
			.attr('width', 600)
			.attr('height', 60);

var formatMinute = d3.format(".0f");

var x = d3.scale.linear()
	.domain([0, 150])
    .range([10, width-10])
    .clamp(true);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d) {return d; })
    .tickSize(12,0)
    .ticks(1)
    //.tickValues([0, 100])
    .tickPadding(1);

var gX = svg.append("g")
        .attr("class", "g-x g-axis")
        .attr("transform", "translate(0," + brushHeight/2 + ")")
        .call(xAxis)
          .select(".domain")
          .select(function() { 
            return this.parentNode.insertBefore(this.cloneNode(true), this); })
          .attr("class", "g-halo");

var slider,
    handle;

var brush = d3.svg.brush()
    .x(x)
    .extent([0, 0])
    .on("brush", brushed);

slider = svg.append("g")
    .attr("class", "g-slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", brushHeight);

handle = slider.append("circle")
    .attr("class", "g-handle")
    .attr("transform", "translate(0," + brushHeight/2 + ")")
    .attr("r", 0);

// d3.select(window)
//       .on("keydown", keydowned);

var playButton = d3.select("#g-play-button");

playButton
       .on("click", paused)
       .each(paused);

function paused() {
  if (slider.node().__transition__) {
    slider.interrupt();
    this.textContent = "Play";
  } else {
    if (currentValue === maxValue) slider
        .call(brush.extent([currentValue = minValue, currentValue]))
        .call(brush.event)
        .call(brushBackground);

    targetValue = maxValue;

    slider.transition()
        .duration((targetValue - currentValue) / (targetValue - minValue) * 100000)
        .ease("linear")
        .call(brush.extent([targetValue, targetValue]))
        .call(brush.event)
        .call(brushBackground);

    this.textContent = "Pause";
  }
}

// function keydowned() {
//   if (d3.event.metaKey || d3.event.altKey) return;
//   console.log("switch");
//   switch (d3.event.keyCode) {
//     case 37: targetValue = Math.max(x.domain()[0], currentValue); break;
//     case 39: targetValue = Math.min(x.domain()[1], currentValue); break;
//     default: return;
//   }
//   console.log("play");
//   playButton.text("Play");
//   slider.interrupt();
//   move();
//   d3.event.preventDefault();
// }

var stoptime=0;
var j=0;
var posi;
var posj;
var ix;
var iy;
var res;

function brushed() {
  
  var i = Math.round(currentValue);

  if (d3.event.sourceEvent) { // not a programmatic event
    // console.log(this);
       //console.log(d3.event.sourceEvent.target.parentNode);
    if (d3.event.sourceEvent.target.parentNode === this) { // clicked on the brush
       // console.log(this);
       //console.log(d3.event.sourceEvent.target.parentNode);
      if(i===0) j=0;
      else j=Math.round(currentValue)-1;

      playButton.text("Play");
      targetValue = x.invert(d3.mouse(this)[0]);
      move();
    }
  }
  else {
    currentValue = brush.extent()[0];
    handle.attr("cx", x(currentValue))
    .attr("r", 8);
	if(i===0){
      	j=0;
		currentTimeFlower.update([]);

    }
  	if( j<i && 0===i%4){

  		currentTimeFlower.update(Alljson[i/4]);
		//console.log(j);
		j=i;	
	}
  }
}




  function brushBackground() {
    slider.select(".background")
        .attr("x", -40)
        .attr("width", width + 40);
  }
  
  
  function move() {
    var copyValue = currentValue; // detect interrupt
    if (moving) return false;
    moving = true;
  
    d3.timer(function() {
      if (copyValue !== currentValue) return !(moving = false);
  
      copyValue = currentValue = Math.abs(currentValue - targetValue) < 1e-3 ? targetValue
          : targetValue * alpha + currentValue * (1 - alpha);
  
      slider.call(brush.extent([currentValue, currentValue]))
            .call(brush.event)
            .call(brushBackground);
  
      return !(moving = currentValue !== targetValue);
  
    });
  
  }

function getChildren(json) {
  var children = [];
  if (json.language) return children;
  for (var key in json) {
    var child = { name: key };
    if (json[key].size) {
      // value node
      child.size = json[key].size;
      child.language = json[key].language;
    } else {
      //children node
      var childChildren = getChildren(json[key]);
      if (childChildren) child.children = childChildren;
    }
    children.push(child);
    delete json[key];
  }
  return children;
}





			});


			// ----Begin Code Flower----//			    		
			var TimeFlower = function(selector, w, h) {
			  this.w = w;
			  this.h = h;

			  d3.select(selector).selectAll('.dynasvg').remove();

			  this.svg = d3.select(selector).append("svg:svg")
			  	.attr('class','dynasvg')
			    .attr('width', w)
			    .attr('height', h);

			  this.svg.append("svg:rect")
			    .style("stroke", "#999")
			    .style("fill", "#fff")
			    .attr('width', w)
			    .attr('height', h);

			  this.force = d3.layout.force()
			    .on("tick", this.tick.bind(this))
			    .charge(function(d) { return d._children ? -d.size / 100 : -40; })
			    .linkDistance(function(d) { return d.target._children ? 80 : 25; })
			    .size([h, w])
			    .friction(0.5);

			};

			TimeFlower.prototype.update = function(json) {



			  if (json) this.json = json;

			  this.json.fixed = true;
			  this.json.x = this.w / 2;
			  this.json.y = this.h / 2;

			  var nodes = this.flatten(this.json);
			  //console.log(nodes);
			  var links = d3.layout.tree().links(nodes);
			  //console.log(links);
			  var total = nodes.length || 1;

			  // remove existing text (will readd it afterwards to be sure it's on top)
			  this.svg.selectAll("text").remove();

			  // Restart the force layout
			  this.force
			    .gravity(Math.atan(total / 50) / Math.PI * 0.4)
			    .nodes(nodes)
			    .links(links)
			    .start();

			  // Update the links
			  this.link = this.svg.selectAll("line.link")
			    .data(links, function(d) { return d.target.path; });

			  // Enter any new links
			  this.link.enter().insert("svg:line", ".node")
			    .attr("class", "link")
			    .attr("x1", function(d) { return d.source.x; })
			    .attr("y1", function(d) { return d.source.y; })
			    .attr("x2", function(d) { return d.target.x; })
			    .attr("y2", function(d) { return d.target.y; });

			  // Exit any old links.
			  this.link.exit().remove();

			  // Update the nodes
			  this.node = this.svg.selectAll("circle.node")
			    .data(nodes, function(d) { return d.path; })
			    .classed("collapsed", function(d) { return d._children ? 1 : 0; });

			  this.node.transition()
			    .attr("r", function(d) { return d.children ? 3.5 : Math.pow(d.size, 2/5) || 1; });

			  // Enter any new nodes
			  this.node.enter().append('svg:circle')
			    .attr("class", "node")
			    .classed('directory', function(d) { return (d._children || d.children) ? 1 : 0; })
			    .attr("r", function(d) { return d.children ? 3.5 : Math.pow(d.size, 2/5) || 1; })
			    .style("fill", function color(d) {
			      return "hsl(" + parseInt(360 / total * d.id, 10) + ",90%,70%)";
			    })
			    .call(this.force.drag)
			    .on("click", this.click.bind(this))
			    .on("mouseover", this.mouseover.bind(this))
			    .on("mouseout", this.mouseout.bind(this));

			  // Exit any old nodes
			  this.node.exit().remove();
			  this.text = this.svg.append('svg:text')
			    .attr('class', 'nodetext')
			    .attr('dy', 0)
			    .attr('dx', 0)
			    .attr('text-anchor', 'middle');

			  return this;
			};

			TimeFlower.prototype.flatten = function(root) {
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
			};

			TimeFlower.prototype.click = function(d) {
			  // Toggle children on click.
			  if (d.children) {
			  	console.log(d.children);
			    d._children = d.children;
			    d.children = null;
			  } else {
			    d.children = d._children;
			    d._children = null;
			  }
			  this.update();
			};

			TimeFlower.prototype.mouseover = function(d) {
			  this.text.attr('transform', 'translate(' + d.x + ',' + (d.y - 5 - (d.children ? 3.5 : Math.sqrt(d.size) / 2)) + ')')
			    .text(d.name + ": ")
			    .style('display', null);
			};

			TimeFlower.prototype.mouseout = function(d) {
			  this.text.style('display', 'none');
			};

			TimeFlower.prototype.tick = function() {
			  var h = this.h;
			  var w = this.w;
			  this.link.attr("x1", function(d) { return d.source.x; })
			    .attr("y1", function(d) { return d.source.y; })
			    .attr("x2", function(d) { return d.target.x; })
			    .attr("y2", function(d) { return d.target.y; });

			  this.node.attr("transform", function(d) {
			    return "translate(" + Math.max(5, Math.min(w - 5, d.x)) + "," + Math.max(5, Math.min(h - 5, d.y)) + ")";
			  });
			};

			TimeFlower.prototype.cleanup = function() {
			  this.update([]);
			  this.force.stop();
			};

			// ----End Code Flower----//

		};



		return{
			template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
			replace: true,
			link: link, 
			restrict: 'E' 
		};
		
	}
]);