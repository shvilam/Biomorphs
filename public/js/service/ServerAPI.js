/**
 Created by Shvil Amit on 05/04/2014.
 */
function ServerAPI() {
    ServerAPI.URL = "http://localhost:3000/";
}

// Save data to server
ServerAPI.prototype.saveToServer = function (biomorph, scope, callBack) {
    var str = biomorph.toString();
    console.log(str);
    $.post(ServerAPI.URL + "api/put", str, function (res) {
        callBack.call(scope, res, biomorph);
    });

};
ServerAPI.prototype.getByHashCommit = function (commitHash, scope, callBack) {
    $.post(ServerAPI.URL + "api/get", commitHash, function (result) {
        callBack.call(scope, result);

    });
};

