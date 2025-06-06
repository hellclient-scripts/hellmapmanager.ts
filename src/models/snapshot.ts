import { UniqueKeyUtil } from "../utils/uniquekeyutil"
import { ItemKey } from "./base";
import { HMMFormatter } from "./formatter";
import { Timestamp } from "@include/timestamp";
export class SnapshotKey {
    constructor(key: string, type: string, value: string) {
        this.Key = key;
        this.Type = type;
        this.Value = value;
    }
    static New(key: string, type: string, value: string): SnapshotKey {
        return new SnapshotKey(key, type, value);
    }
    Key: string = ""
    Type: string = ""
    Value: string = "";
    ToString(): string {
        return UniqueKeyUtil.Join([this.Key, this.Type, this.Value]);
    }
    Equal(model: SnapshotKey): boolean {
        if (this.Key === model.Key && this.Type === model.Type && this.Value === model.Value) {
            return true;
        }
        return false;
    }
}
export class Snapshot {
    static New(): Snapshot {
        return new Snapshot();
    }
    static Create(key: string, type: string, value: string, group: string): Snapshot {
        let result = new Snapshot()
        result.Key = key
        result.Type = type
        result.Value = value
        result.Timestamp = Timestamp.Now();
        result.Group = group
        return result;
    }
    Key: string = "";
    Timestamp: number = 0;
    Group: string = "";
    Type: string = "";
    Count: number = 1;
    Value: string = "";

    Validated(): boolean {
        return ItemKey.Validate(this.Key);
    }
    static EncodeKey: string = "Snapshot";

    Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, Snapshot.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Key),//0
                HMMFormatter.Escape(this.Type),//1
                HMMFormatter.Escape(this.Value),//2
                HMMFormatter.Escape(this.Group),//3
                HMMFormatter.Escape(this.Timestamp.toString()),//4
                HMMFormatter.Escape(this.Count.toString()),//5
            ])
        );
    }
    static Decode(val: string): Snapshot {
        let result = new Snapshot();
        let kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        let list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Key = HMMFormatter.UnescapeAt(list, 0);
        result.Type = HMMFormatter.UnescapeAt(list, 1);
        result.Value = HMMFormatter.UnescapeAt(list, 2);
        result.Group = HMMFormatter.UnescapeAt(list, 3);
        result.Timestamp = HMMFormatter.UnescapeIntAt(list, 4, 0);
        result.Count = HMMFormatter.UnescapeIntAt(list, 5, 1);
        return result;
    }
    Clone(): Snapshot {
        let result = new Snapshot();

        result.Key = this.Key
        result.Timestamp = this.Timestamp
        result.Group = this.Group
        result.Type = this.Type
        result.Value = this.Value
        result.Count = this.Count
        return result;
    }
    Equal(model: Snapshot): boolean {
        if (this.Key === model.Key && this.Type === model.Type && this.Value === model.Value && this.Group === model.Group && this.Timestamp === model.Timestamp && this.Count === model.Count) {
            return true;
        }
        return false;
    }
    Arrange() {
    }
    static Sort(list: Snapshot[]) {
        list.sort((x, y) => x.Group != y.Group ? (x.Group < y.Group ? -1 : 1) : (x.Key != y.Key ? (x.Key < y.Key ? -1 : 1) : (x.Timestamp != y.Timestamp ? (x.Timestamp < y.Timestamp ? -1 : 1) : (x.Type != y.Type ? (x.Type < y.Type ? -1 : 1) : (x.Value < y.Value ? -1 : 1)))));
    }
    UniqueKey(): SnapshotKey {
        return new SnapshotKey(this.Key, this.Type, this.Value);
    }
    Repeat() {
        this.Count++;
    }
}