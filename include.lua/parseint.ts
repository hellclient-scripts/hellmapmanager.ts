/// <reference types="lua-types/5.1" />
//LordStar兼容的wrapper
export class ParseInt {
    static Parse(val: string): number | undefined {
        if (val.indexOf(".") != -1) {
            return undefined;
        }
        return tonumber(val);
    }
}
