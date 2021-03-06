/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');


var git = require('nodegit'),
    fs = require('fs'),
    async = require('async');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.logger('dev'));
app.use(rawBody);
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

function rawBody(req, res, next) {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function (chunk) {
        req.rawBody += chunk;
    });
    req.on('end', function () {
        next();
    });
}
app.get('/api/init', function (req, res) {
    git.Repo.open(path.resolve(__dirname, 'data/.git'), function (openReporError, repo) {
        if (openReporError)
            throw openReporError;
        repo.getBranch();
        res.send("asdfasdf");
    });
});
function open(callback) {
    //console.log("in open commitHash"+commitHash);
    git.Repo.open(path.resolve(__dirname, '../data/.git'), function (openReporError, repo) {
        if (openReporError)
            throw openReporError;
        callback(null, repo);
    });
}

function getCommit(repo,commitHash, callback) {
    repo.getCommit(commitHash, function (error, commit) {
        if (error)callback(error, null);
        callback(null, commit);
    });
}
function getEntry(commit, callback) {
    commit.getEntry('data.json', function (error, entry) {
        if (error)callback(error,entry);;
        callback(null,entry);

    });
}
function getBlob(entry, callback) {
    entry.getBlob(function (error, blob) {
        if (error) callback(error)
        callback(null,blob);
    });
}
app.post('/api/get', function (req, res) {
    var getCommmitAction = async.compose(getBlob,getEntry,function(repo,callback){getCommit(repo,req.rawBody,callback)} ,open);

    getCommmitAction(function (error, result) {
        if (error) throw error;
        //console.log(entry.name(), entry.sha(), blob.size() + 'b');
        console.log('=============With Compose ASYNC===========================================\n\n');

        console.log(JSON.stringify(JSON.parse(result.toString())));
        res.send(JSON.stringify(JSON.parse(result.toString())));
    });
});

app.post('/api/put', function (req, res) {
    console.log('-------------API ' + req.rawBody);
    var getCommmitAction = async.compose([
                                        function(repo,callBack){
                                            git.Reference.oidForName(repo, 'HEAD', function (oidForName, head) {
                                                if (oidForName) throw oidForName;

                                            });
                                        },
                                        function(repo,callBack){
                                            index.writeTree(function(writeTreeError, oid) {
                                                if (writeTreeError) callBack(writeTreeError,null);
                                                callBack(null, repo);

                                            });
                                        },
                                        function(repo,index,callBack){
                                                index.write(function(writeError) {
                                                if (writeError) callBack(writeError,null);
                                                callBack()

                                            });


                                        },
                                        function(repo,index,callBack){
                                            index.addByPath("data.json", function (addByPathError) {
                                                    if (addByPathError) callBack(addByPathError,null);
                                                    callBack(null, repo,index);
                                                });
                                        },
                                        function(repo,index,callBack){
                                            index.read(function (readError) {
                                                if (readError) callBack(readError, null);
                                                callBack(null, repo,index);
                                            });
                                        },
                                        function(repo,callBack){
                                            repo.openIndex(function (openIndexError, index) {
                                                    if (openIndexError) callBack(openIndexError,null);
                                                    callBack(null,repo,index);
                                                });
                                        },
                                        function(repo,callBack){
                                            fs.writeFile(path.join(repo.workdir(), "data.json"), req.rawBody, function (writeError) {
                                                    if (writeError)
                                                        callBack(writeError,null);
                                                    callBack(null,repo);
                                            });
                                        },
                                        open])

});


app.post('/api/put', function (req, res) {
    console.log('-------------API ' + req.rawBody);
    var data = JSON.stringify(req.rawBody);
    git.Repo.open(path.resolve(__dirname, '../data/.git'), function (openReporError, repo) {
        console.log("has repo");
        if (openReporError)
            throw openReporError;
        //create the file in the repo's workdir
        fs.writeFile(path.join(repo.workdir(), "data.json"), req.rawBody, function (writeError) {
            if (writeError) throw writeError;

            //add the file to the index...
            repo.openIndex(function (openIndexError, index) {
                if (openIndexError) throw openIndexError;

                index.read(function (readError) {
                    if (readError) throw readError;

                    index.addByPath("data.json", function (addByPathError) {
                        if (addByPathError) throw addByPathError;

                        index.write(function (writeError) {
                            if (writeError) throw writeError;

                            index.writeTree(function (writeTreeError, oid) {
                                if (writeTreeError) throw writeTreeError;

                                //get HEAD
                                git.Reference.oidForName(repo, 'HEAD', function (oidForName, head) {
                                    if (oidForName) throw oidForName;

                                    //get latest commit (will be the parent commit)
                                    repo.getCommit(head, function (getCommitError, parent) {
                                        if (getCommitError) throw getCommitError;
                                        var author = git.Signature.create("Amit Shvil", "shvilam@gmail.com", 123456789, 60);
                                        var committer = git.Signature.create("Amit Shvil", "shvilam@github.com", 987654321, 90);

                                        //commit
                                        repo.createCommit('HEAD', author, committer, 'message', oid, [parent], function (error, commitId) {
                                            console.log("New Commit:", commitId.sha());
                                            res.send(commitId.sha());
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    // Clone a given repository into a specific folder.

});
