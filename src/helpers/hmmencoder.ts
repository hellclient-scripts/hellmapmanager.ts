import { Room } from "../models/room";
import { Shortcut } from "../models/shortcut";
import { MapEncoding } from "../models/map";
import { HMMFormatter } from "../models/formatter";
import { MapFile } from "../models/mapfile";
import { MapInfo } from "../models/map";
import { Marker } from "../models/marker";
import { Landmark } from "../models/landmark";
import { Variable } from "../models/variable";
import { Route } from "../models/route";
import { Region } from "../models/region";
import { Trace } from "../models/trace";
import { Snapshot } from "../models/snapshot";
export class DefaultHmmEncoderHooks {
    static RoomHook(model: Room): Room | null {
        return model;
    }
    static ShortcutHook(model: Shortcut): Shortcut | null {
        return model;
    }
}

export class MapHeadData {
    static CurrentFormat: string = "HMM1.0";

    FileFormat: string = "";
    Encoding: MapEncoding = MapEncoding.Default;
    Validated(): boolean {
        return this.FileFormat == MapHeadData.CurrentFormat;
    }
    static EncodeEncoding(e: MapEncoding): string {
        return e == MapEncoding.GB18030 ? "GB18030" : "UTF8";
    }
    static DecodeEncoding(val: string): MapEncoding {
        return val == "GB18030" ? MapEncoding.GB18030 : MapEncoding.Default;
    }
    Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, MapHeadData.CurrentFormat, HMMFormatter.Escape(MapHeadData.EncodeEncoding(this.Encoding)));
    }
    static Decode(val: string): MapHeadData {
        let kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        let result = new MapHeadData

        result.FileFormat = kv.Key
        result.Encoding = this.DecodeEncoding(kv.UnescapeValue())
        return result;
    }
}
export class HMMEncoder {
    static DecodeRoomHook: (model: Room) => Room | null = DefaultHmmEncoderHooks.RoomHook;
    static EncodeRoomHook: (model: Room) => Room | null = DefaultHmmEncoderHooks.RoomHook;
    static DecodeShortcutHook: (model: Shortcut) => Shortcut | null = DefaultHmmEncoderHooks.ShortcutHook;
    static EncodeShortcutHook: (model: Shortcut) => Shortcut | null = DefaultHmmEncoderHooks.ShortcutHook;
    static ResetHooks() {
        this.DecodeRoomHook = DefaultHmmEncoderHooks.RoomHook;
        this.EncodeRoomHook = DefaultHmmEncoderHooks.RoomHook;
        this.DecodeShortcutHook = DefaultHmmEncoderHooks.ShortcutHook;
        this.EncodeShortcutHook = DefaultHmmEncoderHooks.ShortcutHook;
    }
    static Encode(mf: MapFile): string {
        let head = new MapHeadData
        head.Encoding = mf.Map.Encoding
        let results: string[] = [
            head.Encode(),
            mf.Map.Info.Encode(),
        ]
        let rooms = Object.values(mf.Records.Rooms);
        Room.Sort(rooms);
        for (let model of rooms) {
            let room = this.EncodeRoomHook(model)
            if (room != null)
                results.push(room.Encode());
        }
        let markers = Object.values(mf.Records.Markers);
        Marker.Sort(markers);
        for (let model of markers) {
            results.push(model.Encode());
        }
        let landmarks = Object.values(mf.Records.Landmarks);
        Landmark.Sort(landmarks);
        for (let model of landmarks) {
            results.push(model.Encode());
        }
        let variables = Object.values(mf.Records.Variables);
        Variable.Sort(variables);
        for (let model of variables) {
            results.push(model.Encode());
        }
        let routes = Object.values(mf.Records.Routes);
        Route.Sort(routes);
        for (let model of routes) {
            results.push(model.Encode());
        }
        let regions = Object.values(mf.Records.Regions);
        Region.Sort(regions);
        for (let model of regions) {
            results.push(model.Encode());
        }
        let traces = Object.values(mf.Records.Traces);
        Trace.Sort(traces);
        for (let model of traces) {
            results.push(model.Encode());
        }
        let shortcuts = Object.values(mf.Records.Shortcuts);
        Shortcut.Sort(shortcuts);
        for (let model of shortcuts) {
            let shotcut = this.EncodeShortcutHook(model)
            if (shotcut != null)
                results.push(shotcut.Encode());
        }

        let snapshots = mf.Records.Snapshots;
        Snapshot.Sort(snapshots);
        for (let model of snapshots) {
            results.push(model.Encode());
        }
        return HMMFormatter.Escaper.Pack(results.join("\n"));
    }
    static Decode(body: string): MapFile | null {
        let mf = MapFile.Create("", "");
        let alldata = body.split("\n");
        let line = alldata.shift();
        if (line == null) {
            return null;
        }
        line = HMMFormatter.Escaper.Unpack(line);
        let head = MapHeadData.Decode(line);
        if (!head.Validated()) {
            return null;
        }
        for (let data of alldata) {
            data = HMMFormatter.Escaper.Unpack(data);
            let key = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, data);
            switch (key.Key) {
                case MapInfo.EncodeKey:
                    {
                        let model = MapInfo.Decode(data);
                        if (model.Validated()) { mf.Map.Info = model; }
                    }
                    break;
                case Room.EncodeKey:
                    {
                        let model = Room.Decode(data);
                        if (model.Validated()) {
                            let room = this.DecodeRoomHook(model);
                            if (room != null) {
                                mf.InsertRoom(room);
                            }
                        }
                    }
                    break;
                case Marker.EncodeKey:
                    {
                        let model = Marker.Decode(data);
                        if (model.Validated()) { mf.InsertMarker(model); }
                    }
                    break;
                case Landmark.EncodeKey:
                    {
                        let model = Landmark.Decode(data);
                        if (model.Validated()) { mf.InsertLandmark(model); }
                    }
                    break;
                case Variable.EncodeKey:
                    {
                        let model = Variable.Decode(data);
                        if (model.Validated()) { mf.InsertVariable(model); }
                    }
                    break;
                case Route.EncodeKey:
                    {
                        let model = Route.Decode(data);
                        if (model.Validated()) { mf.InsertRoute(model); }
                    }
                    break;
                case Region.EncodeKey:
                    {
                        let model = Region.Decode(data);
                        if (model.Validated()) { mf.InsertRegion(model); }
                    }
                    break;
                case Trace.EncodeKey:
                    {
                        let model = Trace.Decode(data);
                        if (model.Validated()) { mf.InsertTrace(model); }
                    }
                    break;
                case Shortcut.EncodeKey:
                    {
                        let model = Shortcut.Decode(data);
                        if (model.Validated()) {
                            let shortcut = this.DecodeShortcutHook(model);
                            if (shortcut != null) {
                                mf.InsertShortcut(shortcut);
                            }
                        }
                    }
                    break;
                case Snapshot.EncodeKey:
                    {
                        let model = Snapshot.Decode(data);
                        if (model.Validated()) { mf.InsertSnapshot(model); }
                    }
                    break;
            }
        }
        return mf;
    }
}