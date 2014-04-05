/**
 Created by Shvil Amit on 05/04/2014.
 */
// Simple implantation Observer
function EventDispatcher() {

}
// to preserve scope on
EventDispatcher.prototype.addEventListener = function (type, listener, scope) {

    if (this._listeners === undefined) this._listeners = {};
    var listeners = this._listeners;
    if (listeners[ type ] === undefined) {
        listeners[ type ] = [];
    }
    if (listeners[ type ].indexOf(listener) === -1) {
        listeners[ type ].push({"callBack": listener, "scope": scope});
    }
};
EventDispatcher.prototype.hasEventListener = function (type, listener) {
    if (this._listeners === undefined) return false;
    var listeners = this._listeners;
    if (listeners[ type ] !== undefined && listeners[ type ].indexOf(listener) !== -1) {
        return true;
    }
    return false;

};
EventDispatcher.prototype.removeEventListener = function (type, listener) {
    if (this._listeners === undefined) return;
    var listeners = this._listeners;
    var listenerArray = listeners[ type ];
    if (listenerArray !== undefined) {
        for (var j = 0; j < listenerArray.length; j++) {
            if (listenerArray[j].callBack == listener) {
                listenerArray.splice(j, 1);
            }
        }
    }
};
EventDispatcher.prototype.dispatchEvent = function (event) {
    if (this._listeners === undefined) return;

    var listeners = this._listeners;
    var listenerArray = listeners[ event.type ];

    if (listenerArray !== undefined) {

        event.target = this;
        var array = [];
        var length = listenerArray.length;
        for (var i = 0; i < length; i++) {
            array[ i ] = listenerArray[ i ];
        }
        for (var j = 0; j < length; j++) {
            array[ j ].callBack.call(array[j].scope, event);
        }

    }

};

