var fs = require('fs');
var lineReader = require('line-reader');

var repeat;
var date;
var add;
var del;
var DATE = /Date:/;
var CREATE = /create mode/;
var DELETE = /delete mode/;
var reg = / /;

fs.writeFile("./app/data/root/ADdata.txt",'\n','utf8');

lineReader.eachLine('./app/data/root/ADlog.txt',function(line, last){

	if(DATE.test(line)){
		date = line.split(reg);	//date[1]
	}
	else if(CREATE.test(line)){
		add = line.split(reg);	//add[3]
		fs.appendFile("./app/data/root/ADdata.txt", date[1]+' '+'create '+add[4]+'\n','utf8');
	}
	else if(DELETE.test(line)){
		del = line.split(reg);	//del[3]
		fs.appendFile("./app/data/root/ADdata.txt", date[1]+' '+'delete '+del[4]+'\n','utf8');
	}						
});
