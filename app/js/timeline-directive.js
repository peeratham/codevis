'use strict';

var codevisComponents = angular.module('codevisComponents');

codevisComponents.directive('timelineChart',['ProjectEvolutionData',
	function(ProjectEvolutionData) {
		var link = function(scope, element, attrs){


			ProjectEvolutionData.query(function(data) {

//data processing
var parseDate = d3.time.format("%Y-%m-%d").parse;
var len = data.length;
console.log(len);
var beginTime = parseDate(data[0].date).getTime();
var endTime = parseDate(data[len-1].date).getTime();
var interTime = (endTime-beginTime)/100;

var addData = [];
var delData =[];
var addNum=0;
var delNum=0;

for(var j=0;j<len;j++){

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

for(var i=0; i<len; i++){
  data[i].date = parseDate(data[i].date).getTime();
}


var json = {name:'root', path:'/root',children:[]};

var tree = TreeDiagramTimeLine(element[0]);
tree.data(json);
addNode(json, '/root/lib');
tree.update();

//curve graph
var xx = d3.time.scale()
    .range([0, 800]);

var yy = d3.scale.linear()
    .range([100, 0]);


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
    .ticks(5)
    .orient("left");

var chartsvg = d3.select(element[0]).append('svg')
		.style("stroke", "#999")
		.style("fill", "#fff")
		.attr('class','chartsvg')
		.attr('width', 900)
		.attr('height', 220)
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

// var addpoint = chartsvg.append("g")
// 		.attr("class", "add-point");

// addpoint.selectAll('.addcir')
// 		.data(addData)
// 		.enter().append('circle')
// 		.attr("cx", function(d) { return xx(d[0]) })
// 		.attr("cy", function(d) { return yy(d[1]) })
// 		.attr("r", 3)
// 		.attr('class','addcir')
// 		.style("fill", "white")
// 		.style("stroke", "blue");

var Del = chartsvg.append("path")
        .attr("d", chartFunction(delData))
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("fill", "none");

// var delpoint = chartsvg.append("g")
// 		.attr("class", "del-point");

// delpoint.selectAll('.celcir')
// 		.data(delData)
// 		.enter().append('circle')
// 		.attr("cx", function(d) { return xx(d[0]) })
// 		.attr("cy", function(d) { return yy(d[1]) })
// 		.attr("r", 3)
// 		.attr('class','delcir')
// 		.style("fill", "white")
// 		.style("stroke", "red");


chartsvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0"+"," + 100 + ")")
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


//animation

var moving,
	minValue=0,
	maxValue=100,
	currentValue=100,
	targetValue=100,
	brushHeight=60,
	width=600,
	alpha=0.25;

// var svg = d3.select(element[0]).append('svg')
// 			.attr('width', 600)
// 			.attr('height', 60);

var formatMinute = d3.format(".0f");

var x = d3.scale.linear()
    .domain([0, 100])
    .range([0, 800])
    .clamp(true);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d) {return d; })
    .tickSize(12,0)
    .ticks(0)
    //.tickValues([0, 100])
    .tickPadding(1);

var gX = chartsvg.append("g")
        .attr("class", "g-x g-axis")
        .attr("transform", "translate(0," + 140 + ")")
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

slider = chartsvg.append("g")
    .attr("class", "g-slider")
    .attr("transform", "translate(0," + 140 + ")")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", brushHeight);

handle = slider.append("circle")
    .attr("class", "g-handle")
    // .attr("transform", "translate(0," + 300 + ")")
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
        .duration((targetValue - currentValue) / (targetValue - minValue) * 50000)
        .ease("linear")
        .call(brush.extent([targetValue, targetValue]))
        .call(brush.event)
        .call(brushBackground);

    this.textContent = "Pause";
  }
}


var stoptime=0;
var j=0;
var posi;
var posj;
var ix;
var iy;
var res;
var kk;

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
      // console.log(j);

      json = {name:'root', path:'/root',children:[]};
      tree.data(json);
      addNode(json, data[0].path);
      tree.update();

      // for(var k=1;k<Math.floor(len/100*i);k++){

      //   if(data[k].action === "create"){
      //     addNode(json,data[k].path);
      //   }
      //   else{
      //    removeNode(json,data[k].path);
      //   }
       
      // } 
      kk=1;
      while(kk<len && data[kk].date<=beginTime+interTime*i){
        if(data[kk].action === "create"){
          addNode(json,data[kk].path);
        }
        else{
          removeNode(json,data[kk].path);
        }
        kk++;
      }

      tree.update(); 
      
      
    }
  }
  else {
    currentValue = brush.extent()[0];
    handle.attr("cx", x(currentValue))
    .attr("r", 8);
	  
    if(i===0){
      j=0;kk=1;
		  json = {name:'root', path:'/root',children:[]};
      tree.data(json);
      addNode(json, data[0].path);
      tree.update();
    }
  	if( j<i ){
      // console.log(i);
    // for(var k=Math.floor(len/100*(i-1));k<Math.floor(len/100*i);k++){

    //   if(data[k].action === "create"){
    //     addNode(json,data[k].path);
    //   }
    //   else{
    //     removeNode(json,data[k].path);
    //   }
    // }
    // for(kk=1;data[kk].date<=beginTime+interTime*(i-1)-1;kk++){}

    while(kk<len && data[kk].date<=beginTime+interTime*i){
      if(data[kk].action === "create"){
        addNode(json,data[kk].path);
      }
      else{
        removeNode(json,data[kk].path);
      }
      // console.log(kk);
      kk++;
    }

    tree.update();

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




			});



		};



		return{
			template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
			replace: true,
			link: link, 
			restrict: 'E' 
		};
		
	}
]);