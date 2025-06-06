/// <reference types="lua-types/5.1" />
export class Timestamp {
    static Now(): number {
        return os.time();
    }
}
