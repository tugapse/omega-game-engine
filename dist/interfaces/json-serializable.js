export class JsonSerializable {
    toJsonObject() {
        return {
            type: this.constructor.name
        };
    }
    fromJson(jsonObject) { }
}
