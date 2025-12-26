import { Landmark } from "../models/landmark";
import { MapFile } from "../models/mapfile";
import { MapSettings } from "../models/map";
import { LandmarkKey } from "../models/landmark";
import { Marker } from "../models/marker";
import { Route } from "../models/route";
import { Trace } from "../models/trace";
import { Region } from "../models/region";
import { RegionItemType, ValueTag, Data } from "../models/base"
import { Room } from "../models/room";
import { Exit } from "../models/exit";
import { Shortcut } from "../models/shortcut";
import { Snapshot, SnapshotKey } from "../models/snapshot";
import { Variable } from "../models/variable";
import { Context } from "../models/context";
import { Mapper, Walking } from "../helpers/mapper";
import { MapperOptions } from "../models/mapperoption";
import { QueryResult } from "../models/step";
import { SnapshotFilter, SnapshotSearchResult, SnapshotSearch } from "../models/snapshotsearchresult";
import { RoomFilter } from "../models/room";
import { SnapshotHelper } from "../helpers/snapshothelper";
import { HMMEncoder } from "../helpers/hmmencoder";
import { MapInfo } from "../models/map";
export class APIListOption {
    private AllKeys: { [key: string]: boolean } = {};
    private AllGroups: { [key: string]: boolean } = {};
    static New(): APIListOption {
        return new APIListOption();
    }
    Clear(): APIListOption {
        this.AllKeys = {};
        this.AllGroups = {};
        return this;
    }
    WithKeys(keys: string[]): APIListOption {
        for (let key of keys) {
            this.AllKeys[key] = true;
        }
        return this;
    }
    WithGroups(groups: string[]): APIListOption {
        for (let group of groups) {
            this.AllGroups[group] = true;
        }
        return this;
    }
    Keys(): string[] {
        let result: string[] = [];
        for (let key in this.AllKeys) {
            result.push(key);
        }
        return result;
    }
    Groups(): string[] {
        let result: string[] = [];
        for (let group in this.AllGroups) {
            result.push(group);
        }
        return result;
    }
    Validate(key: string, group: string): boolean {
        if (Object.keys(this.AllKeys).length > 0 && this.AllKeys[key] !== true) {
            return false;
        }
        if (Object.keys(this.AllGroups).length > 0 && this.AllGroups[group] !== true) {
            return false;
        }
        return true;
    }
    IsEmpty(): boolean {
        return Object.keys(this.AllKeys).length == 0 && Object.keys(this.AllGroups).length == 0;
    }
}

export class MapDatabase {
    Current: MapFile | null = null;
    static Version = 1003;
    static New(): MapDatabase {
        return new MapDatabase();
    }
    Import(body: string, path: string) {
        let mf = HMMEncoder.Decode(body)
        if (mf != null) {
            mf.Path = path;
            this.SetCurrent(mf);
            mf.Modified = false;
            mf.MarkAsModified();
        }
    }
    Export(path: string): string {
        if (this.Current != null) {
            this.Current.Records.Arrange();
            this.Current.Modified = false;
            this.Current.Path = path
            return HMMEncoder.Encode(this.Current);
        }
        return "";
    }
    NewMap() {
        let mapfile = MapFile.Create("", "");
        this.SetCurrent(mapfile);
    }
    SetCurrent(mapfile: MapFile) {
        this.Current = mapfile;
    }
    CloseCurrent() {
        this.Current = null;
    }
    UpdateMapSettings(s: MapSettings) {
        if (this.Current != null) {
            this.Current.Map.Encoding = s.Encoding;
            this.Current.Map.Info.Name = s.Name;
            this.Current.Map.Info.Desc = s.Desc;
            this.Current.MarkAsModified();
        }
    }
    APIVersion(): Number {
        return MapDatabase.Version;
    }
    APIInfo(): MapInfo | null {
        if (this.Current != null) {

            return this.Current.Map.Info;
        }

        return null;
    }
    APIListLandmarks(option: APIListOption): Landmark[] {
        if (this.Current != null) {
            let list: Landmark[] = [];
            let landmarks = this.Current.Records.Landmarks
            Object.keys(landmarks).forEach((key) => {
                let model = landmarks[key];
                if (option.Validate(model.Key, model.Group)) {
                    list.push(model);
                }
            });
            Landmark.Sort(list)
            return list;
        }
        return [];
    }
    APIInsertLandmarks(models: Landmark[]) {
        if (this.Current != null && models.length > 0) {
            for (let model of models) {
                if (model.Validated()) {
                    this.Current.InsertLandmark(model);
                }
            }
            this.Current.MarkAsModified();
        }
    }
    APIRemoveLandmarks(keys: LandmarkKey[]) {
        if (this.Current != null && keys.length > 0) {
            for (let key of keys) {
                this.Current.RemoveLandmark(key);
            }
            this.Current.MarkAsModified();
        }
    }
    APIListMarkers(option: APIListOption): Marker[] {
        if (this.Current != null) {
            let list: Marker[] = [];
            let markers = this.Current.Records.Markers;
            Object.keys(markers).forEach((key) => {
                let model = markers[key];
                if (option.Validate(model.Key, model.Group)) {
                    list.push(model);
                }
            });
            Marker.Sort(list);
            return list;
        }
        return [];
    }
    APIInsertMarkers(models: Marker[]) {
        if (this.Current != null && models.length > 0) {
            for (let model of models) {
                if (model.Validated()) {
                    this.Current.InsertMarker(model);
                }
            }
            this.Current.MarkAsModified();
        }
    }
    APIRemoveMarkers(keys: string[]) {
        if (this.Current != null && keys.length > 0) {
            for (let key of keys) {
                this.Current.RemoveMarker(key);
            }
            this.Current.MarkAsModified();
        }
    }
    APIListRegions(option: APIListOption): Region[] {
        if (this.Current != null) {
            let list: Region[] = [];
            let regions = this.Current.Records.Regions;
            Object.keys(regions).forEach((key) => {
                let model = regions[key];
                if (option.Validate(model.Key, model.Group)) {
                    list.push(model);
                }
            });
            Region.Sort(list);
            return list;
        }
        return [];
    }
    APIInsertRegions(models: Region[]) {
        if (this.Current != null && models.length > 0) {
            for (let model of models) {
                if (model.Validated()) {
                    this.Current.InsertRegion(model);
                }
            }
            this.Current.MarkAsModified();
        }
    }
    APIRemoveRegions(keys: string[]) {
        if (this.Current != null && keys.length > 0) {
            for (let key of keys) {
                this.Current.RemoveRegion(key);
            }
            this.Current.MarkAsModified();
        }
    }
    APIListRooms(option: APIListOption): Room[] {
        if (this.Current != null) {

            let list: Room[] = [];
            let rooms = this.Current.Records.Rooms;
            Object.keys(rooms).forEach((key) => {
                let model = rooms[key];
                if (option.Validate(model.Key, model.Group)) {
                    list.push(model);
                }
            });
            Room.Sort(list);
            return list;
        }
        return [];
    }
    APIInsertRooms(models: Room[]) {
        if (this.Current != null && models.length > 0) {
            for (let model of models) {
                if (model.Validated()) {
                    this.Current.InsertRoom(model);
                }
            }
            this.Current.MarkAsModified();
        }
    }
    APIRemoveRooms(keys: string[]) {
        if (this.Current != null && keys.length > 0) {
            for (let key of keys) {
                this.Current.RemoveRoom(key);
            }
            this.Current.MarkAsModified();
        }
    }
    APIInsertRoutes(models: Route[]) {
        if (this.Current != null && models.length > 0) {
            for (let model of models) {
                if (model.Validated()) {
                    this.Current.InsertRoute(model);
                }
            }
            this.Current.MarkAsModified();
        }
    }
    APIListRoutes(option: APIListOption): Route[] {
        if (this.Current != null) {
            let list: Route[] = [];
            let routes = this.Current.Records.Routes;
            Object.keys(routes).forEach((key) => {
                let model = routes[key];
                if (option.Validate(model.Key, model.Group)) {
                    list.push(model);
                }
            });
            Route.Sort(list);
            return list;
        }
        return [];
    }
    APIRemoveRoutes(keys: string[]) {
        if (this.Current != null && keys.length > 0) {
            for (let key of keys) {
                this.Current.RemoveRoute(key);
            }
            this.Current.MarkAsModified();
        }
    }
    APIInsertShortcuts(models: Shortcut[]) {
        if (this.Current != null && models.length > 0) {
            for (let model of models) {
                if (model.Validated()) {
                    this.Current.InsertShortcut(model);
                }
            }
            this.Current.MarkAsModified();
        }
    }
    APIListShortcuts(option: APIListOption): Shortcut[] {
        if (this.Current != null) {
            let list: Shortcut[] = [];
            let shortcuts = this.Current.Records.Shortcuts;
            Object.keys(shortcuts).forEach((key) => {
                let model = shortcuts[key];
                if (option.Validate(model.Key, model.Group)) {
                    list.push(model);
                }
            });
            Shortcut.Sort(list);
            return list;
        }
        return [];
    }
    APIRemoveShortcuts(keys: string[]) {
        if (this.Current != null && keys.length > 0) {
            for (let key of keys) {
                this.Current.RemoveShortcut(key);
            }
            this.Current.MarkAsModified();
        }
    }
    APIInsertSnapshots(models: Snapshot[]) {
        if (this.Current != null && models.length > 0) {
            for (let model of models) {
                if (model.Validated()) {
                    this.Current.InsertSnapshot(model);
                }
            }
            this.Current.MarkAsModified();
        }
    }
    APIListSnapshots(option: APIListOption): Snapshot[] {
        if (this.Current != null) {
            let list: Snapshot[] = [];
            this.Current.Records.Snapshots.forEach((model) => {
                if (option.Validate(model.Key, model.Group)) {
                    list.push(model);
                }
            });
            Snapshot.Sort(list);
            return list;
        }
        return [];
    }
    APIRemoveSnapshots(keys: SnapshotKey[]) {
        if (this.Current != null && keys.length > 0) {
            for (let k of keys) {
                this.Current.RemoveSnapshot(k);
            }
            this.Current.MarkAsModified();
        }
    }
    APIInsertTraces(models: Trace[]) {
        if (this.Current != null && models.length > 0) {
            for (let model of models) {
                if (model.Validated()) {
                    this.Current.InsertTrace(model);
                }
            }
            this.Current.MarkAsModified();
        }
    }

    APIRemoveTraces(keys: string[]) {
        if (this.Current != null && keys.length > 0) {
            for (let key of keys) {
                this.Current.RemoveTrace(key);
            }
            this.Current.MarkAsModified();
        }
    }
    APIListTraces(option: APIListOption): Trace[] {
        if (this.Current != null) {
            let list: Trace[] = [];
            let traces = this.Current.Records.Traces;
            Object.keys(traces).forEach((key) => {
                let model = traces[key];
                if (option.Validate(model.Key, model.Group)) {
                    list.push(model);
                }
            });
            Trace.Sort(list);
            return list;
        }
        return [];
    }
    APIInsertVariables(models: Variable[]) {
        if (this.Current != null && models.length > 0) {
            for (let model of models) {
                if (model.Validated()) {
                    this.Current.InsertVariable(model);
                }
            }
            this.Current.MarkAsModified();

        }
    }
    APIListVariables(option: APIListOption): Variable[] {
        if (this.Current != null) {
            let list: Variable[] = [];
            let variables = this.Current.Records.Variables;
            Object.keys(variables).forEach((key) => {
                let model = variables[key];
                if (option.Validate(model.Key, model.Group)) {
                    list.push(model);
                }
            });
            Variable.Sort(list);
            return list;
        }
        return [];
    }
    APIRemoveVariables(keys: string[]) {
        if (this.Current != null && keys.length > 0) {
            for (let key of keys) {
                this.Current.RemoveVariable(key);
            }
            this.Current.MarkAsModified();
        }
    }
    APIQueryPathAny(from: string[], target: string[], context: Context, options: MapperOptions): QueryResult | null {
        if (this.Current != null) {
            return new Walking(new Mapper(this.Current, context, options)).QueryPathAny(from, target, 0).SuccessOrNull();
        }
        return null;
    }

    APIQueryPathAll(start: string, target: string[], context: Context, options: MapperOptions): QueryResult | null {
        if (this.Current != null) {
            return new Walking(new Mapper(this.Current, context, options)).QueryPathAll(start, target).SuccessOrNull();
        }
        return null;
    }
    APIQueryPathOrdered(start: string, target: string[], context: Context, options: MapperOptions): QueryResult | null {
        if (this.Current != null) {
            return new Walking(new Mapper(this.Current, context, options)).QueryPathOrdered(start, target).SuccessOrNull();
        }
        return null;
    }
    //不考虑context
    APIQueryRegionRooms(key: string): string[] {
        if (this.Current != null) {
            let region = this.Current.Records.Regions[key];
            if (region != null) {
                let result: { [key: string]: boolean } = {};
                for (let item of region.Items) {
                    if (item.Type == RegionItemType.Room) {
                        if (item.Not) {
                            delete result[item.Value];
                        }
                        else {
                            if (this.Current.Records.Rooms[item.Value] != null) {
                                result[item.Value] = true;
                            }
                        }
                    }
                    else {
                        for (let key of Object.keys(this.Current.Records.Rooms)) {
                            let room = this.Current.Records.Rooms[key];
                            if (room.Group == item.Value) {
                                if (item.Not) {
                                    delete result[room.Key];
                                }
                                else {
                                    result[room.Key] = true;
                                }
                            }
                        }
                    }
                }
                let list = Object.keys(result);
                list.sort();
                return list;
            }
        }
        return [];
    }

    APIDilate(src: string[], iterations: number, context: Context, options: MapperOptions): string[] {
        if (this.Current != null) {
            return new Walking(new Mapper(this.Current, context, options)).Dilate(src, iterations);
        }
        return [];
    }
    APITrackExit(start: string, command: string, context: Context, options: MapperOptions): string {
        if (this.Current != null) {
            let mapper = new Mapper(this.Current, context, options);
            let room = mapper.GetRoom(start);
            if (room != null) {
                let exits = mapper.GetRoomExits(room);
                for (let exit of exits) {
                    if (exit.Command == command && mapper.ValidateExit(start, exit, mapper.GetExitCost(exit))) {
                        return exit.To;
                    }
                }
            }
        }
        return "";
    }
    APIGetVariable(key: string): string {
        if (this.Current != null) {
            let variable = this.Current.Records.Variables[key];
            if (variable != null) {
                return variable.Value;
            }
        }
        return "";
    }
    APIGetRoom(key: string, context: Context, options: MapperOptions): Room | null {
        if (this.Current != null) {
            return new Mapper(this.Current, context, options).GetRoom(key);
        }
        return null;
    }
    APIClearSnapshots(filter: SnapshotFilter) {
        if (this.Current != null) {
            this.Current.Records.Snapshots = this.Current.Records.Snapshots.filter(s => !filter.Validate(s));
            this.Current.MarkAsModified();
        }
    }
    APISearchRooms(filter: RoomFilter): Room[] {
        if (this.Current != null) {
            let result: Room[] = [];
            let rooms = this.Current.Records.Rooms;
            Object.keys(rooms).forEach((key) => {
                let model = rooms[key];
                if (filter.Validate(model)) {
                    result.push(model);
                }
            });
            return result;
        }
        return [];
    }

    APIFilterRooms(src: string[], filter: RoomFilter): Room[] {
        if (this.Current != null) {
            let result: Room[] = [];
            let keys: { [key: string]: boolean } = {};
            src.forEach((key) => {
                keys[key] = true;
            })
            src = Object.keys(keys);
            let rooms = this.Current.Records.Rooms;
            src.forEach((key) => {
                let model = rooms[key];
                if (model != null) {
                    if (filter.Validate(model)) {
                        result.push(model);
                    }
                }
            });
            Room.Sort(result);
            return result;
        }
        return [];
    }
    APITakeSnapshot(key: string, type: string, value: string, group: string) {

        if (this.Current != null) {
            this.Current.TakeSnapshot(key, type, value, group);
            this.Current.MarkAsModified();
        }
    }
    APISearchSnapshots(search: SnapshotSearch): SnapshotSearchResult[] {
        if (this.Current != null) {
            return SnapshotHelper.Search(search, this.Current.Records.Snapshots);
        }
        return [];
    }
    APITraceLocation(key: string, location: string) {
        if (this.Current != null) {
            let trace = this.Current.Records.Traces[key];
            if (trace != null) {
                let prev = trace.Clone();

                if (trace.Locations.includes(location)) {
                    return;
                }
                trace.AddLocations([location]);
                trace.Arrange();
                if (!trace.Equal(prev)) {
                    this.Current.MarkAsModified();
                }
            }
        }
    }
    APITagRoom(key: string, tag: string, value: number) {
        if (this.Current != null) {
            if (tag != "") {
                let room = this.Current.Records.Rooms[key];
                if (room != null) {
                    let prev = room.Clone();
                    room.Tags = room.Tags.filter((t) => t.Key !== tag);
                    if (value != 0) {
                        room.Tags.push(new ValueTag(tag, value));
                    }
                    room.Arrange();
                    if (!room.Equal(prev)) {
                        this.Current.MarkAsModified();
                    }
                    return;
                }
            }
        }
    }
    APISetRoomData(roomkey: string, datakey: string, datavalue: string) {
        if (this.Current != null) {
            let room = this.Current.Records.Rooms[roomkey];
            if (room != null) {
                let prev = room.Clone();
                room.Data = room.Data.filter((d) => d.Key !== datakey);
                room.Data.push(new Data(datakey, datavalue));
                room.Arrange();
                if (!room.Equal(prev)) {
                    this.Current.MarkAsModified();
                }
                return;
            }
        }
    }
    APIGroupRoom(key: string, group: string) {
        if (this.Current != null) {
            let room = this.Current.Records.Rooms[key];
            if (room != null) {
                if (room.Group == group) {
                    return;
                }
                room.Group = group;
                this.Current.MarkAsModified();
            }
        }
    }
    APIGetRoomExits(key: string, context: Context, options: MapperOptions): Exit[] {
        if (this.Current != null) {
            let mapper = new Mapper(this.Current, context, options);
            let room = mapper.GetRoom(key);
            if (room != null) {
                return mapper.GetRoomExits(room);
            }
        }
        return [];
    }

}