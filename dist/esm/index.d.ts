export declare const $AnyEventType: unique symbol;
export interface ITypedEventEmitter<M> extends Omit<TypedEventEmitter<M>, "_listeners" | "getListeners"> {
}
export interface IEmitOptions {
    excludeAny?: boolean;
    exclude?: ((...args: any[]) => any)[];
}
export declare class TypedEventEmitter<M> {
    private _listeners;
    get listeners(): {
        [eventName: string]: ((e?: any, emitter?: any) => any)[];
        [$AnyEventType]: ((eventName: string, eventData?: any, emitter?: any) => any)[];
    };
    private getListeners;
    on<K extends keyof M & string>(eventName: K, listener: (e: M[K], emitter?: this) => any): void;
    once<K extends keyof M & string>(eventName: K, listener: (e: M[K], emitter?: this) => any): void;
    onAny<K extends keyof M & string>(listener: <KK extends K>(eventName: KK, eventData?: M[KK], emitter?: this) => any): void;
    off<K extends keyof M & string>(eventName: K, listener: (e: M[K], emitter?: this) => any): void;
    offAny<K extends keyof M & string>(listener: <KK extends K>(eventName: KK, eventData?: M[KK], emitter?: this) => any): void;
    emit<K extends keyof M & string>(eventName: K, eventData?: M[K], options?: IEmitOptions): Promise<any[]>;
    emitSerial<K extends keyof M & string>(eventName: K, eventData?: M[K], options?: IEmitOptions): Promise<any[]>;
    emitSync<K extends keyof M & string>(eventName: K, eventData?: M[K], options?: IEmitOptions): any[];
    offAll(eventName?: keyof M & string): void;
    listenerCount(eventName: keyof M & string): number;
}
export default TypedEventEmitter;
