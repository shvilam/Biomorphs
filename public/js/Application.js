/**
 * Created by Shvil Amit on 05/04/2014.
 * This is the entry point for the Application
 * it can be initialize in 2 different ways
 * 1. with a commit Hash in the query string example http://localhost:3000/index.html?id=00529cb41531e911dc217c8234ebd3a2d88a6796
 * 2. with out an entry point the first Biomorph will be generated randomly
 */
function Application() {
    this.model = new BiomorphModel();
    this.view = new BiomorphViewCollection();
}
// init with a random
Application.prototype.initWithRandom = function () {
    this.model.initGenerationA();
};
Application.prototype.initWithHash = function (hashCommit) {
    this.model.initWithHash(hashCommit);

};

$(function () {
    // Handler for .ready() called.
    var app = new Application();
    var vars = getUrlVars();
    if (vars.hasOwnProperty("id")) {
        app.initWithHash(vars["id"]);
    } else {
        app.initWithRandom();
    }


});





