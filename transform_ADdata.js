var fs = require('fs');
var lineReader = require('line-reader');

var date;
var add;
var del;
var DATE = /Date:/;
var CREATE = /create mode/;
var DELETE = /delete mode/;
var reg = / /;

var result = [];
var element;

lineReader.eachLine('./app/data/root/ADlog.txt',function(line, last){

	if(DATE.test(line)){
		date = line.split(reg);	//date[1]
	}
	else if(CREATE.test(line)){
		add = line.split(reg);	//add[3]
		element = {date: date[1], action: 'create', path: '/root/'+add[4]};
		result.unshift(element);
	}
	else if(DELETE.test(line)){
		del = line.split(reg);
		element = {date: date[1], action: 'delete', path: '/root/'+del[4]};
		result.unshift(element);
	}	
	if(last){
		var RES = JSON.stringify(result);
		fs.writeFile("./app/data/timeline.json", RES,'utf8');
	}
});





