
(function (global, localScope) {
    var PubSub = function () {
        this.topics = {};
    }
    
    PubSub.prototype = {
        register: function (obj) {
            if (!obj) {
                return false;
            } else {
                for (var type in obj) {
                    if (obj[type] && Object.prototype.toString().call(obj[type]) === "[object Function]") {
                        this.subscribe(type, obj[type]);
                    }
                }
            }
        },
        subscribe: function (type, fn) {
            if (!this.topics[type]) {
                this.topics[type] = [];
            }
            this.topics[type].push(fn);
        },
        publish: function (type, args) {
            var type = Array.prototype.shift.call(arguments);
            var fns = this.topics[type];
            if (!fns || !fns.length) {
                return;
            } else {
                for (var i = 0; i < fns.length; i++) {
                    fns[i].apply(localScope, arguments);
                }
            }
        },
        publishSync: function (type, args) {
            var type = Array.prototype.shift.call(arguments);
            var fns = this.topics[type];
            if (!fns || !fns.length) {
                return;
            } else {
                for (var i = 0; i < fns.length; i++) {
                    setTimeout(function () {
                        fns[i].apply(localScope, arguments);
                    }).bind(this);
                }
            }
        },
        unsubscribe: function (type, fn) {
            var fns = this.topics[type];
            if (!fns) {
                return false;
            }
            if (!fn) {
                fns && (fns.length = 0);
            } else {
                for (var i = 0; i < fns.length; i++) {
                    if (fns[i] === fn) {
                        fns.splice(i,1);
                    }
                }
            }

        }
    }
    if (typeof module !== 'undefined' && typeof exports === 'object' && define.cmd) {
        module.exports = PubSub;
    } else if (typeof define === 'function' && define.amd) {
        define (function () {
            return PubSub;
        })
    } else {
        global.PubSub = PubSub;
    }
}) (window, this);
