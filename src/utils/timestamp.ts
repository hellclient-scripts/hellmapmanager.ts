
export class Timestamp {
    static Now(): number {
        return Math.floor(Date.now() / 1000);
    }
}
