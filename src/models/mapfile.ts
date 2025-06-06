import { Map, MapSettings } from './map';
import { Records } from './records';
import { Room } from './room';
import { Marker } from './marker';
import { Route } from './route';
import { Trace } from './trace';
import { Region } from './region';
import { Landmark, LandmarkKey } from './landmark';
import { Shortcut } from './shortcut';
import { Variable } from './variable';
import { Snapshot, SnapshotKey } from './snapshot';
import { Timestamp } from '@include/timestamp';
export class MapFile {
    constructor() {
        this.Map = new Map();
    }
    static New() {
        return new MapFile();
    }
    Map: Map
    Path: string = "";
    Modified: boolean = true;
    Records: Records = new Records();
    static Create(name: string, desc: string): MapFile {
        let result = new MapFile();
        result.Map = Map.Create(name, desc)
        return result
    }
    MarkAsModified() {
        this.Map.Info.UpdatedTime = Timestamp.Now();
        this.Modified = true;
    }

    InsertRoom(room: Room) {
        room.Arrange();
        this.Records.Rooms[room.Key] = room;
    }
    RemoveRoom(key: string) {

        delete this.Records.Rooms[key];
    }

    InsertMarker(marker: Marker) {
        marker.Arrange();
        this.Records.Markers[marker.Key] = marker;
    }
    RemoveMarker(key: string) {

        delete this.Records.Markers[key];
    }
    InsertRoute(route: Route) {
        route.Arrange();
        this.Records.Routes[route.Key] = route;
    }
    RemoveRoute(key: string) {
        delete this.Records.Routes[key];
    }

    InsertTrace(trace: Trace) {
        trace.Arrange();
        this.Records.Traces[trace.Key] = trace;
    }
    RemoveTrace(key: string) {

        delete this.Records.Traces[key];
    }
    InsertRegion(region: Region) {
        region.Arrange();
        this.Records.Regions[region.Key] = region;
    }
    RemoveRegion(key: string) {
        delete this.Records.Regions[key];
    }

    InsertLandmark(landmark: Landmark) {
        landmark.Arrange();
        this.Records.Landmarks[landmark.UniqueKey().ToString()] = landmark;
    }
    RemoveLandmark(key: LandmarkKey) {

        delete this.Records.Landmarks[key.ToString()];
    }

    InsertShortcut(model: Shortcut) {
        model.Arrange();
        this.Records.Shortcuts[model.Key] = model;
    }
    RemoveShortcut(key: string) {
        delete this.Records.Shortcuts[key]
    }
    InsertVariable(model: Variable) {
        model.Arrange();
        this.Records.Variables[model.Key] = model;
    }
    RemoveVariable(key: string) {

        delete this.Records.Variables[key];
    }
    InsertSnapshot(model: Snapshot) {
        model.Arrange();
        this.RemoveSnapshot(model.UniqueKey());
        this.Records.Snapshots.push(model);
        this.Records.Arrange();
    }
    RemoveSnapshot(key: SnapshotKey) {
        this.Records.Snapshots = this.Records.Snapshots.filter(r => !r.UniqueKey().Equal(key));
    }

    TakeSnapshot(key: string, type: string, value: string, group: string) {
        let snapshotKey = new SnapshotKey(key, type, value);
        let item = this.Records.Snapshots.find(r => r.UniqueKey().Equal(snapshotKey));
        if (item != null) {
            item.Repeat();
        }
        else {
            let model = Snapshot.Create(key, type, value, group);
            model.Arrange();
            this.Records.Snapshots.push(model);
            Snapshot.Sort(this.Records.Snapshots);
        }
    }
    ToSettings(): MapSettings {
        let result = new MapSettings();
        result.Name = this.Map.Info.Name;
        result.Desc = this.Map.Info.Desc;
        result.Encoding = this.Map.Encoding;
        return result;
    }
}