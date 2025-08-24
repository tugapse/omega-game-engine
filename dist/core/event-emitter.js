export class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    on(event, callback) {
        var _a;
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.push(callback);
    }
    emit(event, data) {
        var _a;
        if (this.listeners.has(event)) {
            (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.forEach(callback => callback(data));
        }
    }
}
