/**
 Created by Shvil Amit on 05/04/2014.
 */

// the model Class of the application hold a the current state of the data and do the manipulation if needed
function BiomorphModel() {

    this.serverAPI = new ServerAPI();
    this.biomorphs = [];

    MessageBuss.getInstance().addEventListener(Events.PREDECESSOR_SELECTED, this.onPredecessorSelected, this);
    MessageBuss.getInstance().addEventListener(Events.STATE_CHANGE, this.onStateChange, this);
}
// Call from the Messagebus when a Predecessor is selected will clear current generation and create new generation
BiomorphModel.prototype.onPredecessorSelected = function (event) {
    var biomoorph = event.data;
    this.biomorphs = [];
    this.createRandomOfMuation(biomoorph)
};
BiomorphModel.prototype.onStateChange = function (event) {
    this.biomorphs = [];

    for (var i = 0; i < event.data.length; i++) {
        var biomorph = new Biomorph();
        biomorph.fromJson(event.data[i]);
        this.biomorphs.push(biomorph);
    }
    MessageBuss.getInstance().dispatchEvent({"type": Events.MODEL_READY, "data": this.biomorphs}); // dispatch the event Model is ready


};

BiomorphModel.prototype.createRandomOfMuation = function (predecessor) {

    var siblingsNum = rand(Biomorph.SIBLINGS.MIN, Biomorph.SIBLINGS.MAX);
    var callbackCount = 0;
    for (var i = 0; i < siblingsNum; i++) {
        var tmpB = predecessor.clone(); // fist create a clone of the predecessor
        tmpB.predecessor = predecessor.commitHash;
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
            var commitHash = this.biomorphs[0].predecessor;
            if (this.biomorphs[0].predecessor == null) {
                commitHash = "--Root--" + this.biomorphs[0].commitHash;
            }

            MessageBuss.getInstance().removeEventListener(Events.STATE_CHANGE, this.onStateChange);
            //TODO: write a function that remove cycle reference
            var str = JSON.stringify(this.biomorphs, Biomorph.censor);//remove cycle reference and save as string
            var obj = JSON.parse(str); // take the string and create json from that
            History.pushState(obj, "Commit hash: " + commitHash, "?commitHash=" + commitHash);
            MessageBuss.getInstance().dispatchEvent({"type": Events.MODEL_READY, "data": this.biomorphs}); // dispatch the event Model is ready
            MessageBuss.getInstance().addEventListener(Events.STATE_CHANGE, this.onStateChange, this);

        } else {
            this.pushToServer(i);// calling next one
        }
    });
};
// Has a commit hash get data from the server
BiomorphModel.prototype.initWithHash = function (commitHash) {

    this.serverAPI.getByHashCommit(commitHash, this, function (result) {
        var obj = JSON.parse(result);
        var biomorph = new Biomorphs();
        biomorph.fromJson(obj);
        this.biomorphs[0] = biomorph;
        var commitHash = this.biomorphs[0].predecessor;
        if (this.biomorphs[0].predecessor == null) {
            commitHash = "--Root--" + this.biomorphs[0].commitHash;
        }

        MessageBuss.getInstance().removeEventListener(Events.STATE_CHANGE, this.onStateChange);

        History.pushState(obj, "Commit hash: " + commitHash, "?commitHash=" + commitHash);
        MessageBuss.getInstance().dispatchEvent({"type": Events.MODEL_READY, "data": this.biomorphs}); // dispatch the event Model is ready
        MessageBuss.getInstance().addEventListener(Events.STATE_CHANGE, this.onStateChange, this);
    });
};

