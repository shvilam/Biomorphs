/**
 * Created by amit on 4/5/14.
 */
function HistoryKeeper() {
    this.state = [];
}

HistoryKeeper.prototype.init()
{
    this.state = [];
}
;
HistoryKeeper.prototype.push = function (state) {
    this.state.push(state);
};

HistoryKeeper.prototype.pop = function () {
    this.state.pop(state);
};

