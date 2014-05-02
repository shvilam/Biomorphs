/**
 * Created by Shvil Amit on 05/04/2014.
 * This is the entry point for the Application
 * it can be initialize in 2 different ways
 * 1. with a commit Hash in the query string example http://localhost:3000/index.html?id=00529cb41531e911dc217c8234ebd3a2d88a6796
 * 2. with out an entry point the first Biomorph will be generated randomly
 */
require(["vendor/jquery-1.11.0.min",
        "vendor/history.js/scripts/bundled/html4+html5/jquery.history",
        "utils/Util",
        "view/BiomorphViewCollection",
        "MessageBuss",
        "model/Events",
        "model/BiomorphModel"], function($,history,Util,BiomorphViewCollection,MessageBuss,Events,BiomorphModel) {
    function Application() {
        this.model = new BiomorphModel();
        this.view = new BiomorphViewCollection();

        History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate
            /*
             var pageTracker = _gat._getTracker('UA-49309184-2');
             pageTracker.push([ '_trackPageview', "/"+State.title]);
             if (History.getState().internal) {
             return;
             }*/
            var State = History.getState(); // Note: We are using History.getState() instead of event.state
            History.log('statechange:', State.data, State.title, State.url);
            console.log(State.data.toString());
            MessageBuss.getInstance().dispatchEvent({"type": Events.STATE_CHANGE, "data": State.data})
        });
    }

// init with a random
    Application.prototype.initWithRandom = function () {
        this.model.initGenerationA();
    };
    Application.prototype.initWithHash = function (hashCommit) {
        this.model.initWithHash(hashCommit);

    };


        // Handler for .ready() called.

        var app = new Application();
        var vars = getUrlVars();
        if (vars.hasOwnProperty("id")) {
            app.initWithHash(vars["id"]);
        } else {
            app.initWithRandom();
        }



});






