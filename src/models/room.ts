import { ValueCondition, Data, ValueTag, ItemKey } from "./base";
import { Exit } from "./exit";
import { ToggleKeyValue, KeyValue, HMMFormatter } from "./formatter";
export class RoomFilter {
    RoomConditions: ValueCondition[] = [];
    HasAnyExitTo: string[] = [];
    HasAnyData: Data[] = [];
    ContainsAnyData: Data[] = [];
    ContainsAnyName: string[] = [];
    ContainsAnyKey: string[] = [];

    private ValidateHasAnyData(room: Room): boolean {
        if (this.HasAnyData.length > 0) {
            for (let data of this.HasAnyData) {
                if (room.GetData(data.Key) === data.Value) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    private ValidateContainsAnyData(room: Room): boolean {
        if (this.ContainsAnyData.length > 0) {
            for (let data of this.ContainsAnyData) {
                if (room.GetData(data.Key).includes(data.Value)) {
                    return true;
                }
            }
            return false;

        }
        return true;
    }
    private ValidateContainsAnyName(room: Room): boolean {
        if (this.ContainsAnyName.length > 0) {
            for (let name of this.ContainsAnyName) {
                if (room.Name.includes(name)) {
                    return true;
                }
            }
            return false;
        }
        return true;

    }
    private ValidateContainsAnyKey(room: Room): boolean {
        if (this.ContainsAnyKey.length > 0) {
            for (let key of this.ContainsAnyKey) {
                if (room.Key.includes(key)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }


    private ValidateHasAnyExitTo(room: Room): boolean {
        if (this.HasAnyExitTo.length > 0) {
            for (let to of this.HasAnyExitTo) {
                if (room.HasExitTo(to)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
    Validate(room: Room): boolean {
        if (this.RoomConditions.length > 0) {
            if (!ValueTag.ValidteConditions(room.Tags, this.RoomConditions)) {
                return false;
            }
        }
        if (!this.ValidateHasAnyExitTo(room)) {
            return false;
        }
        if (!this.ValidateContainsAnyData(room)) {
            return false;
        }
        if (!this.ValidateHasAnyData(room)) {
            return false;
        }
        if (!this.ValidateContainsAnyName(room)) {
            return false;
        }
        if (!this.ValidateContainsAnyKey(room)) {
            return false;
        }
        return true;
    }
}

//房间的数据结构
export class Room {
    static EncodeKey: string = "Room";
    Key: string = "";
    //房间的名称，显示用
    Name: string = "";
    //房间的描述，显示用
    Desc: string = "";
    //房间的区域，筛选用
    Group: string = "";
    //标签列表，筛选用
    Tags: ValueTag[] = [];
    //房间出口列表
    Exits: Exit[] = [];
    Data: Data[] = [];
    Validated(): boolean {
        return ItemKey.Validate(this.Key);
    }
    Clone(): Room {
        let result = new Room();
        result.Key = this.Key
        result.Name = this.Name
        result.Group = this.Group
        result.Desc = this.Desc
        result.Tags = [...this.Tags]
        result.Exits = this.Exits.map(e => e.Clone())
        result.Data = this.Data.map(d => d.Clone())
        return result;
    }
    Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, Room.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Key),//0
                HMMFormatter.Escape(this.Name),//1
                HMMFormatter.Escape(this.Group),//2
                HMMFormatter.Escape(this.Desc),//3
                HMMFormatter.EncodeList(HMMFormatter.Level2, this.Tags.map(
                    e => HMMFormatter.EncodeKeyValue(HMMFormatter.Level3, KeyValue.FromValueTag(e))
                )),//4
                HMMFormatter.EncodeList(HMMFormatter.Level2, this.Exits.map(//5
                    e => HMMFormatter.EncodeList(HMMFormatter.Level3, [
                        HMMFormatter.Escape(e.Command),//5-0
                        HMMFormatter.Escape(e.To),//5-1
                        HMMFormatter.EncodeList(HMMFormatter.Level4, e.Conditions.map(c => HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level5, ToggleKeyValue.FromValueCondition(c)))),//5-2
                        HMMFormatter.Escape(HMMFormatter.Escape(e.Cost.toString())),//5-4
                    ])
                )),
                HMMFormatter.EncodeList(HMMFormatter.Level2,//6
                    this.Data.map(
                        d => HMMFormatter.EncodeKeyValue(HMMFormatter.Level3, KeyValue.FromData(d))
                    )
                ),
            ])
        );
    }
    public Sort(list: Room[]) {
        list.sort((x, y) => x.Group != y.Group ? x.Group.localeCompare(y.Group) : x.Key.localeCompare(y.Key));

    }
    static Decode(val: string): Room {
        var result = new Room();
        var kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        var list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Key = HMMFormatter.UnescapeAt(list, 0);
        result.Name = HMMFormatter.UnescapeAt(list, 1);
        result.Group = HMMFormatter.UnescapeAt(list, 2);
        result.Desc = HMMFormatter.UnescapeAt(list, 3);
        result.Tags = HMMFormatter.DecodeList(HMMFormatter.Level2, HMMFormatter.At(list, 4)).map(e => HMMFormatter.DecodeKeyValue(HMMFormatter.Level3, e).ToValueTag());
        result.Exits = HMMFormatter.DecodeList(HMMFormatter.Level2, HMMFormatter.At(list, 5)).map(d => {
            var list = HMMFormatter.DecodeList(HMMFormatter.Level3, d);
            var exit = new Exit();

            exit.Command = HMMFormatter.UnescapeAt(list, 0)
            exit.To = HMMFormatter.UnescapeAt(list, 1)
            exit.Conditions = HMMFormatter.DecodeList(HMMFormatter.Level4, HMMFormatter.At(list, 2)).map(e => HMMFormatter.DecodeToggleKeyValue(HMMFormatter.Level5, e).ToValueCondition())
            exit.Cost = HMMFormatter.UnescapeInt(HMMFormatter.At(list, 3), 0)
            return exit;
        });
        result.Data = HMMFormatter.DecodeList(HMMFormatter.Level2, HMMFormatter.At(list, 6)).map(
            d => HMMFormatter.DecodeKeyValue(HMMFormatter.Level3, d).ToData());
        return result;
    }
    public HasTag(key: string, value: number): boolean {
        return ValueTag.HasTag(this.Tags, key, value);
    }
    public GetData(key: string): string {
        for (var data of this.Data) {
            if (data.Key == key) {
                return data.Value;
            }
        }
        return "";
    }
    public HasExitTo(key: string): boolean {
        for (var exit of this.Exits) {
            if (exit.To == key) {
                return true;
            }
        }
        return false;
    }
    private DoAddData(rd: Data) {
        this.Data.filter((d) => d.Key !== rd.Key);
        if (rd.Value != "") {
            this.Data.push(rd);
        }
    }
    public SetData(rd: Data) {
        this.DoAddData(rd);
        this.Arrange();
    }
    public SetDatas(list: Data[]) {
        for (var rd of list) {
            this.DoAddData(rd);
        }
        this.Arrange();
    }

    public Arrange() {
        this.Data.sort((x, y) => x.Key.localeCompare(y.Key))
        this.Tags.sort((x, y) => x.Key.localeCompare(y.Key))
        this.Exits.forEach(e => e.Arrange());
    }
    public Filter(val: string): boolean {
        if (this.Key.includes(val) ||
            this.Name.includes(val) ||
            this.Desc.includes(val) ||
            this.Group.includes(val)) {
            return true;
        }
        for (var tag of this.Tags) {
            if (tag.Key.includes(val)) {
                return true;
            }
        }
        for (var data of this.Data) {
            if (data.Key.includes(val) || data.Value.includes(val)) {
                return true;
            }
        }
        for (var exit of this.Exits) {
            if (exit.Command.includes(val) || exit.To.includes(val)) {
                return true;
            }
        }
        return false;
    }

    public Equal(model: Room): boolean {
        if (
            this.Key !== model.Key ||
            this.Name !== model.Name ||
            this.Group !== model.Group ||
            this.Desc !== model.Desc
        ) {
            return false;
        }
        if (this.Exits.length != this.Exits.length) {
            return false;
        }
        for (var i = 0; i < this.Exits.length; i++) {
            if (!this.Exits[i].Equal(model.Exits[i])) {
                return false;
            }
        }
        if (this.Tags.length != model.Tags.length) {
            return false;
        }
        for (var i = 0; i < this.Tags.length; i++) {
            if (!this.Tags[i].Equal(model.Tags[i])) {
                return false;
            }
        }
        if (Data.length != model.Data.length) {
            return false;
        }
        for (var i = 0; i < Data.length; i++) {
            if (!this.Data[i].Equal(model.Data[i])) {
                return false;
            }
        }
        return true;
    }
}

