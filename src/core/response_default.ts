export default class BodyRespone {
    public message: string;
    public payload: object | undefined;

    public constructor(message: string, payload: object) {
        this.message = message;
        this.payload = payload;
    }
}