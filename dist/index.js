(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TypedEventEmitter {
        constructor() {
            this._listeners = {};
        }
        get listeners() {
            return this._listeners;
        }
        getListeners(eventName) {
            if (!(eventName in this._listeners))
                this._listeners[eventName] = [];
            return this._listeners[eventName];
        }
        on(eventName, listener) {
            if (this.getListeners(eventName).indexOf(listener) === -1)
                this.getListeners(eventName).push(listener);
        }
        once(eventName, listener) {
            const listenerWithOff = (arg) => {
                const returnValue = listener(arg);
                this.off(eventName, listenerWithOff);
                return returnValue;
            };
            this.on(eventName, listenerWithOff);
        }
        off(eventName, listener) {
            const i = this.getListeners(eventName).indexOf(listener);
            if (i !== -1)
                this.getListeners(eventName).splice(i, 1);
        }
        async emit(eventName, eventData) {
            const listeners = this.getListeners(eventName);
            if (!listeners.length)
                return [];
            return Promise.all(listeners.map(f => f(eventData)));
        }
        async emitSerial(eventName, eventData) {
            const listeners = this.getListeners(eventName);
            if (!listeners.length)
                return [];
            const returnValues = [];
            for (let i = 0; i < listeners.length; i++) {
                const listener = listeners[i];
                returnValues[i] = await listener(eventData);
            }
            return returnValues;
        }
        emitSync(eventName, eventData) {
            const listeners = this.getListeners(eventName);
            if (!listeners.length)
                return [];
            return listeners.map(f => f(eventData));
        }
        removeAllListeners(eventName) {
            if (eventName) {
                this._listeners[eventName] = [];
            }
            else {
                this._listeners = {};
            }
        }
        listenerCount(eventName) {
            if (!(eventName in this._listeners))
                return 0;
            return this._listeners[eventName].length;
        }
    }
    exports.default = TypedEventEmitter;
});
//# sourceMappingURL=index.js.map