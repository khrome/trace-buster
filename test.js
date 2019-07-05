var should = require("chai").should();
var request = require('request');
var bustTrace = require('./tracebuster');
var trace = require('fs').readFileSync('./sample-trace.txt').toString();
var retrace = require('fs').readFileSync('./sample-retrace.txt').toString();

var makeServer = function(dirpath, port){
    var express = require('express');
    var app = express();
    var path = require('path');
    app.get('*', function(req, res){
        res.sendFile(path.join(dirpath + req.url))
    });
    return app.listen(port);
}

describe('tracebuster', function(){

    it('decodes a trace', function(complete){
        var server = makeServer(__dirname+'/test-data', 7357);
        var busted = bustTrace(trace, request, function(err, thisTrace){
            busted.should.equal('Stack Trace resolving [986542]')
            thisTrace.should.equal(retrace)
            server.close(function(){
                complete();
            })
        }, '986542')
    });
});
