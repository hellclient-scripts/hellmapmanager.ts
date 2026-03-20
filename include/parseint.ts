
export class ParseInt {
    static Parse(val: string): number | undefined {
        if (val.indexOf(".") != -1) {
            return undefined;
        }
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? undefined : parsed;
    }
}
