import { Data, ValueTag, Condition, ValueCondition, TypedConditions, RegionItemType, RegionItem } from "./base"
import { Command, ControlCode } from "../utils/controlcode/controlcode";
export class KeyValue {
    constructor(key: string, value: string) {
        this.Key = key;
        this.Value = value;
    }
    public static New(key: string, value: string): KeyValue {
        return new KeyValue(key, value);
    }
    Key: string;
    Value: string;;
    UnescapeKey(): string {
        return HMMFormatter.Unescape(this.Key);
    }
    public UnescapeValue(): string {
        return HMMFormatter.Unescape(this.Value);
    }
    public ToData(): Data {
        return new Data(HMMFormatter.Unescape(this.Key), HMMFormatter.Unescape(this.Value));
    }
    public static FromData(k: Data): KeyValue {
        return new KeyValue(HMMFormatter.Escape(k.Key), HMMFormatter.Escape(k.Value));
    }
    public ToValueTag(): ValueTag {
        return new ValueTag(HMMFormatter.Unescape(this.Key), HMMFormatter.UnescapeInt(this.Value, 1));
    }
    public static FromValueTag(k: ValueTag): KeyValue {
        return new KeyValue(HMMFormatter.Escape(k.Key), k.Value == 1 ? "" : k.Value.toString());
    }

}

export class ToggleValue {
    constructor(value: string, not: boolean) {
        this.Value = value;
        this.Not = not;
    }
    static New(value: string, not: boolean): ToggleValue {
        return new ToggleValue(value, not);
    }
    Not: boolean;
    Value: string;
    UnescapeValue(): string {
        return HMMFormatter.Unescape(this.Value);
    }
    ToCondition(): Condition {
        return new Condition(HMMFormatter.Unescape(this.Value), this.Not);
    }
    static FromCondition(c: Condition): ToggleValue {
        return new ToggleValue(HMMFormatter.Escape(c.Key), c.Not);
    }
}
export class ToggleKeyValue {
    constructor(key: string, value: string, not: boolean) {
        this.Not = not;
        this.Value = value;
        this.Key = key;
    }
    static New(key: string, value: string, not: boolean): ToggleKeyValue {
        return new ToggleKeyValue(key, value, not);
    }
    Not: boolean;
    Key: string;
    Value: string;
    UnescapeKey(): string {
        return HMMFormatter.Unescape(this.Key);
    }
    UnescapeValue(): string {
        return HMMFormatter.Unescape(this.Value);
    }

    ToRegionItem(): RegionItem {
        return new RegionItem(HMMFormatter.Unescape(this.Key) == "Room" ? RegionItemType.Room : RegionItemType.Zone, HMMFormatter.Unescape(this.Value), this.Not);
    }
    static FromRegionItem(i: RegionItem): ToggleKeyValue {
        return new ToggleKeyValue(HMMFormatter.Escape(i.Type == RegionItemType.Room ? "Room" : "Zone"), HMMFormatter.Escape(i.Value), i.Not);
    }
    public ToValueCondition(): ValueCondition {
        return new ValueCondition(HMMFormatter.Unescape(this.Key), HMMFormatter.UnescapeInt(this.Value, 1), this.Not);
    }
    public static FromValueCondition(c: ValueCondition): ToggleKeyValue {
        return new ToggleKeyValue(HMMFormatter.Escape(c.Key), c.Value == 1 ? "" : c.Value.toString(), c.Not);
    }


}
export class ToggleKeyValues {
    constructor(key: string, values: string[], not: boolean) {
        this.Key = key;
        this.Values = values;
        this.Not = not;
    }
    static New(key: string, values: string[], not: boolean): ToggleKeyValues {
        return new ToggleKeyValues(key, values, not);
    }
    Not: boolean;
    Key: string;
    Values: string[];
    ToTypedConditions(): TypedConditions {
        return new TypedConditions(HMMFormatter.Unescape(this.Key), this.Values.map(HMMFormatter.Unescape), this.Not);
    }
    static FromTypedConditions(c: TypedConditions): ToggleKeyValues {
        return new ToggleKeyValues(HMMFormatter.Escape(c.Key), c.Conditions.map(HMMFormatter.Escape), c.Not);
    }
}


export class HMMLevel {
    constructor(keyToken: Command, sepToken: Command) {
        this.KeyToken = keyToken;
        this.SepToken = sepToken;
    }
    public static New(keyToken: Command, sepToken: Command): HMMLevel {
        return new HMMLevel(keyToken, sepToken);
    }
    KeyToken: Command;
    SepToken: Command;
}
//五层简单结构格式化工具
//只支持列表和键值对列表，最多支持5层
export class HMMFormatter {
    static Level1: HMMLevel = new HMMLevel(new Command(">", "1", "\\>"), new Command("|", "6", "\\|"));
    static Level2: HMMLevel = new HMMLevel(new Command(":", "2", "\\:"), new Command(";", "7", "\\;"));
    static Level3: HMMLevel = new HMMLevel(new Command("=", "3", "\\="), new Command(",", "8", "\\,"));
    static Level4: HMMLevel = new HMMLevel(new Command("@", "4", "\\@"), new Command("&", "9", "\\&"));
    static Level5: HMMLevel = new HMMLevel(new Command("^", "5", "\\^"), new Command("`", "10", "\\`"));
    static TokenNot: Command = new Command("!", "11", "\\!");
    static TokenNewline: Command = new Command("\n", "12", "\\n");
    static Escaper: ControlCode = ((new ControlCode())
        .WithCommand(new Command("\\", "0", "\\\\"))
        .WithCommand(HMMFormatter.Level1.KeyToken)
        .WithCommand(HMMFormatter.Level1.SepToken)
        .WithCommand(HMMFormatter.Level2.KeyToken)
        .WithCommand(HMMFormatter.Level2.SepToken)
        .WithCommand(HMMFormatter.Level3.KeyToken)
        .WithCommand(HMMFormatter.Level3.SepToken)
        .WithCommand(HMMFormatter.Level4.KeyToken)
        .WithCommand(HMMFormatter.Level4.SepToken)
        .WithCommand(HMMFormatter.Level5.KeyToken)
        .WithCommand(HMMFormatter.Level5.SepToken)
        .WithCommand(HMMFormatter.TokenNot)
        .WithCommand(HMMFormatter.TokenNewline)
        .WithCommand(new Command("", "99", "\\"))
    );

    static Escape(val: string): string {
        return HMMFormatter.Escaper.Encode(val);
    }
    static Unescape(val: string): string {
        return HMMFormatter.Escaper.Decode(val);
    }
    static EncodeKeyAndValue(level: HMMLevel, key: string, val: string): string {
        return HMMFormatter.EncodeKeyValue(level, new KeyValue(key, val));
    }

    static EncodeKeyValue(level: HMMLevel, kv: KeyValue): string {
        return `${kv.Key}${level.KeyToken.Raw}${kv.Value}`;
    }

    static DecodeKeyValue(level: HMMLevel, val: string): KeyValue {
        let decoded = val.split(level.KeyToken.Raw, 2);
        return new KeyValue(decoded[0], decoded.length > 1 ? decoded[1] : "");
    }
    static EncodeToggleKeyValue(level: HMMLevel, kv: ToggleKeyValue): string {
        return HMMFormatter.EncodeToggleValue(new ToggleValue(HMMFormatter.EncodeKeyAndValue(level, kv.Key, kv.Value), kv.Not));
    }
    static DecodeToggleKeyValue(level: HMMLevel, val: string): ToggleKeyValue {
        let v = HMMFormatter.DecodeToggleValue(val);
        let kv = HMMFormatter.DecodeKeyValue(level, v.Value);
        return new ToggleKeyValue(kv.Key, kv.Value, v.Not);
    }

    static EncodeToggleKeyValues(level: HMMLevel, kv: ToggleKeyValues): string {
        return HMMFormatter.EncodeToggleValue(new ToggleValue(HMMFormatter.EncodeKeyAndValue(level, kv.Key, HMMFormatter.EncodeList(level, kv.Values)), kv.Not));
    }
    static DecodeToggleKeyValues(level: HMMLevel, val: string): ToggleKeyValues {
        let v = HMMFormatter.DecodeToggleValue(val);
        let kv = HMMFormatter.DecodeKeyValue(level, v.Value);
        return new ToggleKeyValues(kv.Key, HMMFormatter.DecodeList(level, kv.Value), v.Not);
    }
    static EncodeList(level: HMMLevel, items: string[]): string {
        return items.join(level.SepToken.Raw);
    }
    static DecodeList(level: HMMLevel, val: string): string[] {
        if (val == "") {
            return [];
        }

        return [...val.split(level.SepToken.Raw)];
    }
    static At(list: string[], index: number): string {
        return index >= 0 && index < list.length ? list[index] : "";
    }
    static UnescapeAt(list: string[], index: number): string {
        return HMMFormatter.Unescape(HMMFormatter.At(list, index));
    }
    static UnescapeInt(val: string, defaultValue: number): number {
        let result = Number.parseInt(HMMFormatter.Unescape(val))
        return isNaN(result) || (val.indexOf(".") != -1) ? defaultValue : result;
    }
    static UnescapeIntAt(list: string[], index: number, defaultValue: number): number {
        return HMMFormatter.UnescapeInt(HMMFormatter.At(list, index), defaultValue);
    }
    static EncodeToggleValue(v: ToggleValue): string {
        return (v.Not ? HMMFormatter.TokenNot.Raw : "") + v.Value;
    }
    static DecodeToggleValue(val: string): ToggleValue {
        let not = val.length > 0 && val.startsWith(HMMFormatter.TokenNot.Raw);
        let key: string = "";
        if (not) {
            key = val.substring(1);
        }
        else {
            key = val;
        }
        return new ToggleValue(key, not);

    }
    public static EscapeList(list: string[]): string[] {
        return list.map(HMMFormatter.Escape);
    }
    public static UnescapeList(list: string[]): string[] {
        return list.map(HMMFormatter.Unescape);
    }
}
