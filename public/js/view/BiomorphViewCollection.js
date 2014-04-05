/**
 * Created by Shvil Amit on 05/04/2014.
 * view that handle the list of sub view that create a visual representative of Biomorph
 */
function BiomorphViewCollection() {
    this.subView = [];
    MessageBuss.getInstance().addEventListener(Events.MODEL_READY, this.onModelReady, this);
    this.init();
}

BiomorphViewCollection.prototype.init = function () {
    for (var i = 0; i < 9; i++) {
        this.subView[i] = new BiomorphView(i);
    }
};
//Will be called from the events Message buss when  model will be ready.
BiomorphViewCollection.prototype.onModelReady = function (event) {
    this.clearAllCanvases();
    var biomorphs = event.data;
    for (var i = 0; i < biomorphs.length; i++) {
        this.subView[i].render(biomorphs[i]);
    }
};


//clear view and binding of prev generation
BiomorphViewCollection.prototype.clearAllCanvases = function () {
    for (var i = 0; i < this.subView.length; i++) {
        this.subView[i].clear();
    }

};