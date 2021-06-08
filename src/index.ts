export default class TypedEventEmitter<M> {
    private _listeners: { [eventName: string]: ((...e: any[]) => any | Promise<any>)[] } = {};
    get listeners() {
        return this._listeners;
    }
    private getListeners<K extends Extract<keyof M, string>>(eventName: K) {
        if (!(eventName in this._listeners)) this._listeners[eventName] = [];
        return this._listeners[eventName];
    }
    on<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => any) {
        if (this.getListeners(eventName).indexOf(listener) === -1) this.getListeners(eventName).push(listener);
    }
    once<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => any) {
        const listenerWithOff = (arg: M[K]) => {
            const returnValue = listener(arg);
            this.off(eventName, listenerWithOff);
            return returnValue;
        };
        this.on(eventName, listenerWithOff);
    }
    off<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => any) {
        const i = this.getListeners(eventName).indexOf(listener);
        if (i !== -1) this.getListeners(eventName).splice(i, 1);
    }
    async emit<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        if (!listeners.length) return [];
        return Promise.all(listeners.map(f => f(eventData)));
    }
    async emitSerial<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        if (!listeners.length) return [];
        const returnValues = [];
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            returnValues[i] = await listener(eventData);
        }
        return returnValues;
    }
    emitSync<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        if (!listeners.length) return [];
        return listeners.map(f => f(eventData));
    }
    removeAllListeners(eventName?: Extract<keyof M, string>) {
        if (eventName) {
            this._listeners[eventName] = [];
        } else {
            this._listeners = {};
        }
    }
    listenerCount(eventName: Extract<keyof M, string>) {
        if (!(eventName in this._listeners)) return 0;
        return this._listeners[eventName].length;
    }
}
