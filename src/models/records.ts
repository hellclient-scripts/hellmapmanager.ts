import { Room } from './room';
import { Marker } from './marker';
import { Route } from './route';
import { Trace } from './trace';
import { Region } from './region';
import { Landmark } from './landmark';
import { Shortcut } from './shortcut';
import { Variable } from './variable';
import { Snapshot } from './snapshot';
export class Records {
    Rooms: { [key: string]: Room } = {};
    Markers: { [key: string]: Marker } = {};
    Routes: { [key: string]: Route } = {};
    Traces: { [key: string]: Trace } = {};
    Regions: { [key: string]: Region } = {};
    Landmarks: { [key: string]: Landmark } = {};
    Shortcuts: { [key: string]: Shortcut } = {};
    Variables: { [key: string]: Variable } = {};
    Snapshots: Snapshot[] = [];
    Arrange() {
        Snapshot.Sort(this.Snapshots);
    }
}