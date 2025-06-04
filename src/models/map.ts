import { HMMFormatter } from "./formatter";

export class MapSettings {
    Name: string = "";
    Desc: string = "";
    Encoding: MapEncoding = MapEncoding.Default;
    static New(): MapSettings {
        return new MapSettings();
    }
}
export enum MapEncoding {
    Default,
    GB18030,
}
export class MapInfo {
    Name: string = "";
    Desc: string = "";
    UpdatedTime: number = 0;
    static Create(name: string, desc: string): MapInfo {
        let result = new MapInfo()

        result.UpdatedTime = Date.now() / 1000;
        result.Name = name
        result.Desc = desc
        return result;
    }
    Validated(): boolean {
        return this.UpdatedTime > -1;
    }
    static EncodeKey: string = "Info";

    Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, MapInfo.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Name),//0
                HMMFormatter.Escape(this.UpdatedTime.toString()),//1
                HMMFormatter.Escape(this.Desc),//2
            ])
        );
    }
    static Decode(val: string): MapInfo {
        let result = new MapInfo();
        let kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        let list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Name = HMMFormatter.UnescapeAt(list, 0);
        result.UpdatedTime = HMMFormatter.UnescapeIntAt(list, 1, -1);
        result.Desc = HMMFormatter.UnescapeAt(list, 2);
        return result;
    }
    Clone(): MapInfo {
        let result = new MapInfo();
        result.Name = this.Name;
        result.Desc = this.Desc;
        result.UpdatedTime = this.UpdatedTime;
        return result
    }
    Equal(model: MapInfo): boolean {
        if (this.Name !== model.Name) {
            return false;
        }
        if (this.Desc !== model.Desc) {
            return false;
        }
        if (this.UpdatedTime !== model.UpdatedTime) {
            return false;
        }
        return true;
    }
}
export class Map {
    Encoding: MapEncoding = MapEncoding.Default;
    static CurrentVersion: string = "1.0";

    Info: MapInfo = new MapInfo();

    // void Arrange()
    // {
    //     Room.Sort(Rooms);
    //     Marker.Sort(Markers);
    //     Route.Sort(Routes);
    //     Trace.Sort(Traces);
    //     Region.Sort(Regions);
    //     Landmark.Sort(Landmarks);
    //     Shortcut.Sort(Shortcuts);
    //     Variable.Sort(Variables);
    //     Snapshot.Sort(Snapshots);
    // }
    static Create(name: string, desc: string): Map {
        let result = new Map();
        result.Info = MapInfo.Create(name, desc)
        return result
    }
}