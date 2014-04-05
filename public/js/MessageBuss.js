/**
 * Created by Shvil Amit on 05/04/2014.
 * this single instate class use a linkage between different part of the application
 * for example to over come multiple level of view and sub views
 */
MessageBuss.prototype = new EventDispatcher();
function MessageBuss() {
    if (arguments.callee.instance)
        return arguments.callee.instance;
    arguments.callee.instance = this;
    MessageBuss.apply(this, arguments);
}

MessageBuss.getInstance = function () {
    var buss = new MessageBuss();
    return buss;
};