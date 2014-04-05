/**
 * Created by Shvil Amit on 05/04/2014.
 * */
function BiomorphView(index) {
    this.canvas = document.getElementById("cell_" + index);
    this.ctx = this.canvas.getContext("2d");
    this.index = index;

    this.elm = $("#cell_" + index);
    this.shareBtn = $("#share_" + index);

    this.data = null;
};
BiomorphView.prototype.removeEvents = function () {
    this.elm.off('click');
    this.elm.off('click');
};
BiomorphView.prototype.bindEvents = function () {
    this.elm.click($.proxy(this.onSelected, this));
    this.shareBtn.click($.proxy(this.onShare, this));
};
BiomorphView.prototype.onSelected = function () {
    MessageBuss.getInstance().dispatchEvent({"type": Events.PREDECESSOR_SELECTED, "data": this.data});
};

BiomorphView.prototype.onShare = function () {
    alert(window.location + "?id=" + this.data.commitHash);
};

BiomorphView.prototype.clear = function () {
    this.data = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.removeEvents();
};

BiomorphView.prototype.render = function (b) {
    this.data = b;
    this.draw(this.data);
    this.bindEvents();
};
BiomorphView.prototype.draw = function (b) {
    var prevLoc;
    if (b.parent == null) {
        prevLoc = new Point(Biomorph.LOC.MAX_X / 2, 0);
    }
    else {
        prevLoc = b.parent.point;
    }
    this.ctx.beginPath();
    this.ctx.lineWidth = b.thickness;
    this.ctx.strokeStyle = b.color;
    this.ctx.moveTo(prevLoc.x, prevLoc.y);
    this.ctx.lineTo(b.point.x, b.point.y);
    this.ctx.closePath();
    this.ctx.stroke();
    for (var i = 0; i < b.legs.length; i++) {
        this.draw(b.legs[i]);
    }
};
