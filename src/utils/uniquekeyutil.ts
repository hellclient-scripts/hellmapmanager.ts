export class UniqueKeyUtil {
    static EscapedSep = "\x1B1";
    static EscapeToken = "\x1B";
    static EscapedEscapeToken = "\x1B0";
    static Escape(val: string): string {
        return val.replaceAll(UniqueKeyUtil.EscapeToken, UniqueKeyUtil.EscapedEscapeToken).replaceAll("\n", UniqueKeyUtil.EscapedSep);
    }
    static Join(str: string[]): string {
        let escaped = str.map(s => UniqueKeyUtil.Escape(s));
        return escaped.join("\n");
    }
}