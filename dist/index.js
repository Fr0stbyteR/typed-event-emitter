"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEventEmitter = exports.$AnyEventType = void 0;
exports.$AnyEventType = Symbol("__TypedEventListener_AnyEventType");
class TypedEventEmitter {
    constructor() {
        this._listeners = { [exports.$AnyEventType]: [] };
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
        const listenerWithOff = (arg, emitter) => {
            const returnValue = listener(arg, emitter);
            this.off(eventName, listenerWithOff);
            return returnValue;
        };
        this.on(eventName, listenerWithOff);
    }
    onAny(listener) {
        this._listeners[exports.$AnyEventType].push(listener);
    }
    off(eventName, listener) {
        const i = this.getListeners(eventName).indexOf(listener);
        if (i !== -1)
            this.getListeners(eventName).splice(i, 1);
    }
    offAny(listener) {
        const i = this._listeners[exports.$AnyEventType].indexOf(listener);
        if (i !== -1)
            this._listeners[exports.$AnyEventType].splice(i, 1);
    }
    async emit(eventName, eventData, options) {
        var _a;
        let listeners = this.getListeners(eventName);
        let anyListeners = (options === null || options === void 0 ? void 0 : options.excludeAny) ? [] : this._listeners[exports.$AnyEventType];
        if (!listeners.length && !anyListeners.length)
            return [];
        if ((_a = options === null || options === void 0 ? void 0 : options.exclude) === null || _a === void 0 ? void 0 : _a.length) {
            const { exclude } = options;
            listeners = listeners.filter(l => exclude.indexOf(l) === -1);
            anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
        }
        return Promise.all([...listeners.map(f => f(eventData, this)), ...anyListeners.map(f => f(eventName, eventData, this))]);
    }
    async emitSerial(eventName, eventData, options) {
        var _a;
        let listeners = this.getListeners(eventName);
        let anyListeners = (options === null || options === void 0 ? void 0 : options.excludeAny) ? [] : this._listeners[exports.$AnyEventType];
        if (!listeners.length && !anyListeners.length)
            return [];
        if ((_a = options === null || options === void 0 ? void 0 : options.exclude) === null || _a === void 0 ? void 0 : _a.length) {
            const { exclude } = options;
            listeners = listeners.filter(l => exclude.indexOf(l) === -1);
            anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
        }
        const returnValues = [];
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            returnValues[i] = await listener(eventData, this);
        }
        for (let i = 0; i < anyListeners.length; i++) {
            const listener = anyListeners[i];
            returnValues[listeners.length + i] = await listener(eventName, eventData, this);
        }
        return returnValues;
    }
    emitSync(eventName, eventData, options) {
        var _a;
        let listeners = this.getListeners(eventName);
        let anyListeners = (options === null || options === void 0 ? void 0 : options.excludeAny) ? [] : this._listeners[exports.$AnyEventType];
        if (!listeners.length && !anyListeners.length)
            return [];
        if ((_a = options === null || options === void 0 ? void 0 : options.exclude) === null || _a === void 0 ? void 0 : _a.length) {
            const { exclude } = options;
            listeners = listeners.filter(l => exclude.indexOf(l) === -1);
            anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
        }
        return [...listeners.map(f => f(eventData, this)), ...anyListeners.map(f => f(eventName, eventData, this))];
    }
    offAll(eventName) {
        if (eventName) {
            this._listeners[eventName] = [];
        }
        else {
            this._listeners = { [exports.$AnyEventType]: [] };
        }
    }
    listenerCount(eventName) {
        const anyListenerCount = this._listeners[exports.$AnyEventType].length;
        if (!(eventName in this._listeners))
            return anyListenerCount;
        return this._listeners[eventName].length + anyListenerCount;
    }
}
exports.TypedEventEmitter = TypedEventEmitter;
exports.default = TypedEventEmitter;
//# sourceMappingURL=index.js.map