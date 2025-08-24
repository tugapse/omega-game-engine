export declare class EventEmitter {
    private listeners;
    on(event: string, callback: Function): void;
    emit(event: string, data?: any): void;
}
