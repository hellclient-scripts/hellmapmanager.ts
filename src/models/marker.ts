import { ItemKey } from "./base";
import { HMMFormatter } from "./formatter";

export class Marker {
    Key: string = "";
    Value: string = "";
    Desc: string = "";
    Group: string = "";
    Message: string = "";
    Validated(): boolean {
        return ItemKey.Validate(this.Key) && this.Value != "";
    }
    public Clone(): Marker {
        var result = new Marker();
        result.Key = this.Key
        result.Value = this.Value
        result.Desc = this.Desc
        result.Group = this.Group
        result.Message = this.Message
        return result
    }
    static EncodeKey: string = "Marker";
    public Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, Marker.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Key),//0
                HMMFormatter.Escape(this.Value),//1
                HMMFormatter.Escape(this.Group),//2
                HMMFormatter.Escape(this.Desc),//3
                HMMFormatter.Escape(this.Message),//4

            ])
        );
    }
    public static Decode(val: string): Marker {
        var result = new Marker();
        var kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        var list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Key = HMMFormatter.UnescapeAt(list, 0);
        result.Value = HMMFormatter.UnescapeAt(list, 1);
        result.Group = HMMFormatter.UnescapeAt(list, 2);
        result.Desc = HMMFormatter.UnescapeAt(list, 3);
        result.Message = HMMFormatter.UnescapeAt(list, 4);
        return result;
    }
    public static Sort(list: Marker[]) {
        list.sort((x, y) => x.Group != y.Group ? x.Group.localeCompare(y.Group) : x.Key.localeCompare(y.Key));
    }
    public Filter(val: string): boolean {
        if (this.Key.includes(val) ||
            this.Value.includes(val) ||
            this.Desc.includes(val) ||
            this.Group.includes(val) ||
            this.Message.includes(val)
        ) {
            return true;
        }
        return false;
    }
    public Arrange() { }
    public Equal(model: Marker): boolean {
        return this.Key === model.Key && this.Value === model.Value && this.Desc === model.Desc && this.Group === model.Group && this.Message === model.Message;
    }
}