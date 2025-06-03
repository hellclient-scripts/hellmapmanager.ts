import { ItemKey } from "./base";
import { HMMFormatter } from "./formatter";

export class Route {
    Key: string = "";
    Desc: string = "";
    Group: string = "";
    Message: string = "";
    Rooms: string[] = [];
    Validated(): boolean {
        return ItemKey.Validate(this.Key);
    }
    static EncodeKey = "Route";

    public Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, Route.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Key),//0
                HMMFormatter.Escape(this.Group),//1
                HMMFormatter.Escape(this.Desc),//2
                HMMFormatter.EncodeList(HMMFormatter.Level2, this.Rooms.map(d => HMMFormatter.Escape(d))),//3
                HMMFormatter.Escape(this.Message),//4
            ])
        );
    }
    public static Decode(val: string): Route {
        let result = new Route();
        let kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        let list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Key = HMMFormatter.UnescapeAt(list, 0);
        result.Group = HMMFormatter.UnescapeAt(list, 1);
        result.Desc = HMMFormatter.UnescapeAt(list, 2);
        result.Rooms = HMMFormatter.DecodeList(HMMFormatter.Level2, HMMFormatter.At(list, 3)).map(d => HMMFormatter.Unescape(d));
        result.Message = HMMFormatter.UnescapeAt(list, 4);
        return result;
    }
    public Clone(): Route {
        let result = new Route();
        result.Key = this.Key
        result.Rooms = [...this.Rooms]
        result.Group = this.Group
        result.Desc = this.Desc
        result.Message = this.Message
        return result;
    }
    public Arrange() {

    }
    public static Sort(list: Route[]) {
        list.sort((x, y) => x.Group != y.Group ? (x.Group < y.Group ? -1 : 1) : (x.Key < y.Key ? -1 : 1));
    }
    public Filter(val: string): boolean {
        if (this.Key.includes(val) ||
            this.Desc.includes(val) ||
            this.Group.includes(val) ||
            this.Message.includes(val)) {
            return true;
        }
        for (let room of this.Rooms) {
            if (room.includes(val)) {
                return true;
            }
        }
        return false;
    }
    public Equal(model: Route): boolean {
        if (this.Key !== model.Key || this.Desc !== model.Desc || this.Group !== model.Group || this.Message !== model.Message) {
            return false;
        }
        if (this.Rooms.length != model.Rooms.length) {
            return false;
        }
        for (let i = 0; i < this.Rooms.length; i++) {
            if (this.Rooms[i] !== model.Rooms[i]) {
                return false;
            }
        }
        return true;
    }
}