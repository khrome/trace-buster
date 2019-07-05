var asynk = require('async');

var files = {};

function cachedRequests(url, request, cb){
    if(files[url]){
        setTimeout(function(){
            cb(undefined, files[url])
        }, 0)
    }else{
        request(url, function(err, res, body){
            if(err) return cb(err);
            try{
                var json = body.toString().split("\n");
                files[url] = json;
                cb(undefined, json);
            }catch(ex){
                return cb(ex);
            }
        })
    }

}

var pointToCharLine = function(pos, length){
    var res = '';
    for(var lcv = 1; lcv <= length; lcv++){
        if(pos === lcv) res += '^';
        else res += ' ';
    }
    return res;
};

module.exports = function(trace, request, fn, name){
    var cb = fn || function(a){ console.log(a) };
    var res = [];
    var lines = trace.split("\n");
    var id = name || Math.floor(Math.random()*1000000)+'';
    asynk.eachOfSeries(lines, function(line, index, done){
        var parts = line.split('(');
        if(!parts[1]){
            res.push('   '+line);
            return done();
        }
        parts = parts[1].split(')');
        parts.pop();
        var charLocation = parts[0];
        var locationParts = charLocation.split(':')
        var url = locationParts.shift()+':'+locationParts.shift()+':'+locationParts.shift();
        var row = parseInt(locationParts.shift())-1; //from 1, not 0
        var col = parseInt(locationParts.shift());
        cachedRequests(url, request, function(err, codeLines){
            res.push('   '+line)
            res.push('   '+codeLines[row])
            res.push('   '+pointToCharLine(col, codeLines[row]?codeLines[row].length:80));
            res.push("\n")
            done();
        })
    }, function(){
        cb(undefined, 'Stack id '+id+' resolved.'+"\n"+res.join("\n   "))
    });
    return 'Stack Trace resolving ['+id+']';
}
