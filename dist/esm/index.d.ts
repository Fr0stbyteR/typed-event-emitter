export default class TypedEventEmitter<M> {
    private _listeners;
    get listeners(): {
        [eventName: string]: ((...e: any[]) => any)[];
    };
    private getListeners;
    on<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => any): void;
    once<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => any): void;
    off<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => any): void;
    emit<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]): Promise<any[]>;
    emitSerial<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]): Promise<any[]>;
    emitSync<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]): any[];
    removeAllListeners(eventName?: Extract<keyof M, string>): void;
    listenerCount(eventName: Extract<keyof M, string>): number;
}
