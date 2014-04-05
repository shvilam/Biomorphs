/**
 Created by Shvil Amit on 05/04/2014.
 */

// the model Class of the application hold a the current state of the data and do the manipulation if needed
function BiomorphModel() {

    this.serverAPI = new ServerAPI();
    this.biomorphs = [];

    MessageBuss.getInstance().addEventListener(Events.PREDECESSOR_SELECTED, this.onPredecessorSelected, this);
}
// Call from the Messagebus when a Predecessor is selected will clear current generation and create new generation
BiomorphModel.prototype.onPredecessorSelected = function (event) {
    var biomoorph = event.data;
    this.biomorphs = [];
    this.createRandomOfMuation(biomoorph)
};

BiomorphModel.prototype.createRandomOfMuation = function (predecessor) {

    var siblingsNum = rand(Biomorph.SIBLINGS.MIN, Biomorph.SIBLINGS.MAX);
    var callbackCount = 0;
    for (var i = 0; i < siblingsNum; i++) {
        var tmpB = predecessor.clone(); // fist create a clone of the predecessor
        tmpB.mutation(); // do the mutation on the clone object
        this.biomorphs.push(tmpB);
    }
    this.pushToServer(0); // save to the server
};
// Create the fist generation
BiomorphModel.prototype.initGenerationA = function () {
    this.biomorphs[0] = Biomorph.createGenerationA();
    this.pushToServer(0);
};
// Save to the Server
BiomorphModel.prototype.pushToServer = function (i) {

    // Will have to call one by one because of server issue and use of git as the data base
    this.serverAPI.saveToServer(this.biomorphs[i], this, function (result) {
        this.biomorphs[i].commitHash = result;
        i++;
        if (i == this.biomorphs.length) { // all genration has been save to server
            MessageBuss.getInstance().dispatchEvent({"type": Events.MODEL_READY, "data": this.biomorphs}); // dispatch the event Model is ready
        } else {
            this.pushToServer(i);// calling next one
        }
    });
};
// Has a commit hash get data from the server
BiomorphModel.prototype.initWithHash = function (commitHash) {

    this.serverAPI.getByHashCommit(vars["id"], this, function (result) {
        var obj = JSON.parse(result);
        var biomorph = new Biomorphs();
        biomorph.fromJson(obj);
        this.biomorphs[0] = biomorph;
        MessageBuss.getInstance().dispatchEvent({"type": Events.MODEL_READY, "data": this.biomorphs});// Model is ready
    });
};

