import { ItemKey } from "./base";
import { HMMFormatter } from "./formatter";
import { UniqueKeyUtil } from "../utils/uniquekeyutil";
export class LandmarkKey {
    constructor(key: string, type: string) {
        this.Key = key;
        this.Type = type;
    }
    static New(key: string, type: string): LandmarkKey {
        return new LandmarkKey(key, type);
    }
    Key: string = "";
    Type: string = "";

    ToString(): string {
        return UniqueKeyUtil.Join([this.Key, this.Type]);
    }
    Equal(obj: LandmarkKey): boolean {
        return this.Key === obj.Key && this.Type === obj.Type;
    }
}
export class Landmark {
    Key: string = "";
    Type: string = "";
    Value: string = "";
    Group: string = "";
    Desc: string = "";
    static New(): Landmark { return new Landmark() }
    Validated(): boolean {
        return ItemKey.Validate(this.Key);
    }
    static EncodeKey: string = "Landmark";
    Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, Landmark.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Key),//0
                HMMFormatter.Escape(this.Type),//1
                HMMFormatter.Escape(this.Value),//2
                HMMFormatter.Escape(this.Group),//3
                HMMFormatter.Escape(this.Desc),//4
            ])
        );
    }
    public static Decode(val: string): Landmark {
        let result = new Landmark();
        let kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        let list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Key = HMMFormatter.UnescapeAt(list, 0);
        result.Type = HMMFormatter.UnescapeAt(list, 1);
        result.Value = HMMFormatter.UnescapeAt(list, 2);
        result.Group = HMMFormatter.UnescapeAt(list, 3);
        result.Desc = HMMFormatter.UnescapeAt(list, 4);
        return result;
    }
    Arrange() {

    }
    Clone(): Landmark {
        let result = new Landmark();

        result.Key = this.Key
        result.Type = this.Type
        result.Value = this.Value
        result.Group = this.Group
        result.Desc = this.Desc
        return result;
    }
    static Sort(list: Landmark[]) {
        list.sort((x, y) => x.Group != y.Group ? (x.Group < y.Group ? -1 : 1) : (x.Key != y.Key ? (x.Key < y.Key ? -1 : 1) : (x.Type < y.Type ? -1 : 1)));
    }
    public Equal(model: Landmark): boolean {
        if (this.Key === model.Key && this.Type === model.Type && this.Value === model.Value && this.Group === model.Group && this.Desc === model.Desc) {
            return true;
        }
        return false;
    }
    UniqueKey(): LandmarkKey {
        return new LandmarkKey(this.Key, this.Type);
    }
}