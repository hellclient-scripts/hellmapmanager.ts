import { ItemKey } from "./base";
import { HMMFormatter } from "./formatter";

export class Trace {
    Key: string = ""
    Group: string = ""
    Desc: string = ""
    Message: string = ""
    Locations: string[] = []
    static New(): Trace { return new Trace() }
    Clone(): Trace {
        let result = new Trace()
        result.Key = this.Key
        result.Locations = [...this.Locations]
        result.Desc = this.Desc
        result.Group = this.Group
        result.Message = this.Message
        return result
    }
    public Validated(): boolean {
        return ItemKey.Validate(this.Key);
    }
    static EncodeKey: string = "Trace";

    public Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, Trace.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Key),//0
                HMMFormatter.Escape(this.Group),//1
                HMMFormatter.Escape(this.Desc),//2
                HMMFormatter.EncodeList(HMMFormatter.Level2, this.Locations.map(HMMFormatter.Escape)),//3
                HMMFormatter.Escape(this.Message),//4
            ])
        );
    }
    public static Decode(val: string): Trace {
        let result = new Trace();
        let kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        let list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Key = HMMFormatter.UnescapeAt(list, 0);
        result.Group = HMMFormatter.UnescapeAt(list, 1);
        result.Desc = HMMFormatter.UnescapeAt(list, 2);
        result.Locations = HMMFormatter.DecodeList(HMMFormatter.Level2, HMMFormatter.At(list, 3)).map(HMMFormatter.Unescape);
        result.Message = HMMFormatter.UnescapeAt(list, 4);
        return result;
    }
    static Sort(list: Trace[]) {
        list.sort((x, y) => x.Group != y.Group ? (x.Group < y.Group ? -1 : 1) : (x.Key < y.Key ? -1 : 1));
    }

    Arrange() {
        this.Locations.sort((x, y) => x < y ? -1 : 1);
    }
    RemoveLocations(loctions: string[]) {
        for (let l of loctions) {
            this.Locations = this.Locations.filter(d => d !== l);
        }
    }
    AddLocations(loctions: string[]) {
        for (let l of loctions) {
            if (l != "") {
                this.Locations = this.Locations.filter(d => d !== l);
                this.Locations.push(l);
            }
        }
        this.Arrange();
    }
    public Equal(model: Trace): boolean {
        if (this.Key !== model.Key ||
            this.Desc !== model.Desc ||
            this.Group !== model.Group ||
            this.Message !== model.Message) {
            return false;
        }
        if (this.Locations.length != model.Locations.length) {
            return false;
        }
        for (let i = 0; i < this.Locations.length; i++) {
            if (this.Locations[i] != model.Locations[i]) {
                return false;
            }
        }
        return true;
    }
}