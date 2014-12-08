 

var fs = require('fs');
var _ = require('underscore');

function identifierProcessing(callback){

  var result = {};

  fs.readFile('./app/data/d3-identifiers.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var metadata = JSON.parse(data);
    for (var path in metadata) {
      if (metadata.hasOwnProperty(path)) {
         var identifiers = metadata[path];

         var generics = [
         'null','true','false','self','this','in','on','call','""','each','is','apply',
         '<anonymous>','___defineGetter__','callback','require'

         ];
         var genericsDict = {}

          function isNumeric(identifier){
            return !isNaN(identifier)
          }

          function isGeneric(identifier,genericDict){
            if(genericsDict[identifier]||genericsDict[identifier.replace(/"/g,"")]){
              return true;
            }else{
              return false;
            }
          }

          function isMeaningful(identifier) {
            var currentId = JSON.stringify(identifier);
            var length = currentId.length;
            if(isGeneric(currentId)){
              // console.log('bad:', currentId);
              return false;
            }
            if(isNumeric(currentId) && isNumeric(currentId.replace(/"/g,""))){
              // console.log('bad numeric',currentId);
              return false;
            }
            return  length > 3 ;
          }

          //generate genericDict
          for ( i = 0; i < generics.length; i++ ) {
            genericsDict[ generics[i] ] = true;
          }

          var filtered = identifiers.filter(isMeaningful);
          result[path] = filtered;
      }
    }

  return callback(result);
});
}

function relationMatrix(files){
    
    var matrix = {};

    for(var f in files){
      if (files.hasOwnProperty(f)) {
        matrix[f] = {};
        for(var other in files){
          if (files.hasOwnProperty(f) && other != f){
            var intersect = _.intersection(files[f],files[other]);
           
            if(intersect.length>0){
              var res = {};
              res[other] = intersect;
              matrix[f][other] = intersect; 
            }
          }
        }
      }
    }
    return matrix;
}
exports.relationMatrix = relationMatrix;

//input dict = {a:['id1','id2'],b:['id1','id3']}
function frequencyCount(dic){
   var frequency = _.chain(dic)
                      .values()
                      .flatten()
                      .reduce(function(counts, word) {
                        counts[word] = (counts[word] || 0) + 1;
                        return counts;
                      }, {})
                      .value();
    var keys = _.keys(frequency);
    var sortList = keys.sort(compareFrequency);

    function compareFrequency(a, b) {
      return frequency[b] - frequency[a];
    } 
    
    // console.log(sortList);
    var sortedFreqList = {};
    sortList.forEach(function(el){
      sortedFreqList[el] = frequency[el];
    });

    return sortedFreqList;
}

function functionProcessing(callback){
  fs.readFile('./app/data/test-report.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var funcDict = {};
    var metadata = JSON.parse(data);
    for (var path in metadata) {
      if (metadata.hasOwnProperty(path)) {
       var funcList = metadata[path].functions;
       var funcNameList = [];
       funcList.forEach(function(funcObj){
          var temp = _.pick(funcObj, 'name');
          funcNameList.push(_.values(temp)[0]);
       });
           funcDict[path] = funcNameList;
      }
    }

    return callback(funcDict);
  });
 }
exports.functionProcessing = functionProcessing;
  


exports.test_identifierProcessing = function(callback){
  var result = identifierProcessing(function(result){
    // var matrix = relationMatrix(result);
    // console.log(JSON.stringify(result, undefined, 4));
    return callback(result);
  });
}

exports.identifiers = function(req, res){
  var result = identifierProcessing(function(result){

    res.json(result);
    // return callback(result);
  });
}

exports.relations = function (req, res) {
  var result = functionProcessing(function(result){
    var matrix = relationMatrix(result);
    res.json(matrix);  
  });
};

function dependencyProcessing(callback){
  fs.readFile('./app/data/d3-dependencies.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    dependencyDict = {};

    var metadata = JSON.parse(data);
    // dependencyDict = data;
    for (var path in metadata) {
      dependencyDict[path] = [];
      var dependencyList = metadata[path];
      dependencyList.forEach(function(relPath){
        dependencyDict[path].push(relativeToAbsolute(path,relPath));
      });
    }
    return callback(dependencyDict);
  });
}

function relativeToAbsolute(absolute, relative){
    var count = (relative.match(/\.\.\/+/g) || []).length;
    var absolutePathList;
    try{
        absolutePathList = absolute.split('/');
        for(i = 0; i<count+1; i++){
            absolutePathList.pop();
        }    
    }catch(err){console.log(err.message)};
    var result;
    if(count==0){
      result = absolutePathList.join('/')+'/'+relative+'.js';
    }else{
      result = relative.replace(/(\.\.\/)+/g, absolutePathList.join('/')+'/')+'.js';  
    }
    
    return result;
}

exports.test_dependencyProcessing = function(callback){
  var result = dependencyProcessing(function(result){
    console.log(result);
    // console.log(JSON.stringify(result, undefined, 4));
    return callback(result);
  });
}

exports.dependencies = function(req, res){
  var result = dependencyProcessing(function(result){
    res.json(result);
  });
}

exports.functions = function(req, res){
   fs.readFile('./app/data/d3-functions.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    res.json(JSON.parse(data));
  });
}

