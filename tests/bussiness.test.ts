import { assert } from "chai";
import { MapInfo, Variable, Snapshot, Shortcut, SnapshotKey, LandmarkKey, Landmark, RegionItemType, RegionItem, Region, Trace, Route, Marker, Exit, Data, ValueCondition, Room, ValueTag, Records } from "../src/index";

describe("ControlCode Test", () => {
    it("TestExit", () => {
        var exit = new Exit();
        exit.Conditions = [new ValueCondition("con1", 0, true), new ValueCondition("con2", 0, false)];
        exit.Arrange();
        assert.isTrue(exit.Conditions[0].Equal(new ValueCondition("con2", 0, false)));
        assert.isTrue(exit.Conditions[1].Equal(new ValueCondition("con1", 0, true)));
        exit.Conditions = [new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, false)];
        exit.Arrange();
        assert.isTrue(exit.Conditions[0].Equal(new ValueCondition("con1", 0, false)));
        assert.isTrue(exit.Conditions[1].Equal(new ValueCondition("con2", 0, false)));
        exit.Conditions = [new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, true)];
        exit.Arrange();
        assert.isTrue(exit.Conditions[0].Equal(new ValueCondition("con1", 0, false)));
        assert.isTrue(exit.Conditions[1].Equal(new ValueCondition("con2", 0, true)));
        exit.Conditions = [new ValueCondition("con1", 0, true), new ValueCondition("con2", 0, true)];
        exit.Arrange();
        assert.isTrue(exit.Conditions[0].Equal(new ValueCondition("con1", 0, true)));
        assert.isTrue(exit.Conditions[1].Equal(new ValueCondition("con2", 0, true)));
    })
    let SuffRoom = (suff: string): Room => {
        let model = new Room();
        model.Key = `key${suff}`
        model.Name = `name${suff}`
        model.Group = `group${suff}`
        model.Desc = `desc${suff}`
        model.Tags = [new ValueTag(`tag1${suff}`, 0), new ValueTag(`tag2${suff}`, 15)]
        model.Exits = [
            ((): Exit => {
                let model = new Exit()
                model.To = `to1${suff}`
                model.Command = `cmd1${suff}`
                model.Cost = 1
                model.Conditions = [
                    new ValueCondition(`con1${suff}`, 0, true),
                    new ValueCondition(`con2${suff}`, 0, false),
                ]
                return model
            })(),
            ((): Exit => {
                let model = new Exit()
                model.To = `to2${suff}`
                model.Command = `cmd2${suff}`
                return model
            })(),
        ]
        model.Data = [
            new Data(`key1${suff}`, `val1${suff}`),
            new Data(`key2${suff}`, `val2${suff}`),
        ]
        return model
    };

    it("TestRoom", () => {
        let room: Room;
        room = new Room();
        var data1 = new Data("key1", "val1");
        var data2 = new Data("key2", "val2");
        room.Data = [data2, data1];
        room.Arrange();
        assert.isTrue(room.Data[0].Equal(data1));
        assert.isTrue(room.Data[1].Equal(data2));
        room.Data = [];
        room.SetData(new Data("key1", "valnew"));
        assert.isTrue(room.Data[0].Equal(new Data("key1", "valnew")));
        room.SetData(new Data("key2", "valnew2"));
        assert.isTrue(room.Data[1].Equal(new Data("key2", "valnew2")));
        room.SetData(new Data("key0", "val0"));
        assert.isTrue(room.Data[0].Equal(new Data("key0", "val0")));
        room.SetData(new Data("key3", "val3"));
        assert.isTrue(room.Data[3].Equal(new Data("key3", "val3")));
        room.Data = [];
        room.SetDatas([new Data("key0", "val0"), data2, data1, new Data("key3", "val3")]);
        assert.isTrue(room.Data[0].Equal(new Data("key0", "val0")));
        assert.isTrue(room.Data[1].Equal(data1));
        assert.isTrue(room.Data[2].Equal(data2));
        assert.isTrue(room.Data[3].Equal(new Data("key3", "val3")));

        room = new Room();
        assert.isTrue(room.Equal(Room.Decode(room.Encode())));
        room = SuffRoom("");
        assert.isTrue(room.Equal(Room.Decode(room.Encode())));
        room = SuffRoom(">:=@!;\\,&!\n");
        assert.isTrue(room.Equal(Room.Decode(room.Encode())));
        room = SuffRoom("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(room.Equal(Room.Decode(room.Encode())));

    })
    let SuffMarker = (suff: string): Marker => {
        let model = new Marker()
        model.Key = `key${suff}`
        model.Value = `value${suff}`
        model.Group = `group${suff}`
        model.Desc = `desc${suff}`
        model.Message = `message${suff}`
        return model
    }
    it("TestRoom", () => {
        var marker = SuffMarker("");
        var marker2 = marker.Clone();
        marker2.Arrange();
        assert.isTrue(marker.Equal(marker2));
        marker = SuffMarker("");
        assert.isTrue(marker.Equal(Marker.Decode(marker.Encode())));
        marker = SuffMarker(">:=@!;\\,&!\n");
        assert.isTrue(marker.Equal(Marker.Decode(marker.Encode())));
        marker = SuffMarker("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(marker.Equal(Marker.Decode(marker.Encode())));

    })
    let SuffRoute = (suff: string): Route => {
        let model = new Route()

        model.Key = `key${suff}`
        model.Rooms = [`rid${suff}`, `rid{$suff}`]
        model.Group = `group${suff}`
        model.Desc = `desc${suff}`
        model.Message = `message${suff}`
        return model
    }

    it("TestRoute", () => {
        var route = SuffRoute("");
        var route2 = route.Clone();
        route2.Arrange();
        assert.isTrue(route.Equal(route2));
        route = SuffRoute("");
        assert.isTrue(route.Equal(Route.Decode(route.Encode())));
        route = SuffRoute(">:=@!;\\,&!\n");
        assert.isTrue(route.Equal(Route.Decode(route.Encode())));
        route = SuffRoute("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(route.Equal(Route.Decode(route.Encode())));
    })
    let SuffTrace = (suff: string): Trace => {
        let model = new Trace()
        model.Key = `key${suff}`
        model.Locations = [`rid${suff}`, `rid${suff}`]
        model.Group = `group${suff}`
        model.Desc = `desc${suff}`
        model.Message = `message${suff}`
        return model;
    }

    it("TestTrace", () => {

        var trace = SuffTrace("");
        let trace2: Trace;
        trace2 = new Trace();
        trace2.Locations = ["2", "1"];
        trace2.Arrange();
        assert.equal(2, trace2.Locations.length);
        assert.equal("1", trace2.Locations[0]);
        assert.equal("2", trace2.Locations[1]);
        trace2 = new Trace();
        trace2.Locations = ["1", "2"];
        trace2.RemoveLocations(["2", "3"]);
        assert.equal(1, trace2.Locations.length);
        assert.equal("1", trace2.Locations[0]);
        trace2 = new Trace();
        trace2.Locations = ["2", "3"];
        trace2.AddLocations(["1", "3", "4"]);
        assert.equal(4, trace2.Locations.length);
        assert.equal("1", trace2.Locations[0]);
        assert.equal("2", trace2.Locations[1]);
        assert.equal("3", trace2.Locations[2]);
        assert.equal("4", trace2.Locations[3]);
        trace2 = trace.Clone();
        assert.isTrue(trace.Equal(trace2));
        trace = SuffTrace("");
        assert.isTrue(trace.Equal(Trace.Decode(trace.Encode())));
        trace = SuffTrace(">:=@!;\\,&!\n");
        assert.isTrue(trace.Equal(Trace.Decode(trace.Encode())));
        trace = SuffTrace("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(trace.Equal(Trace.Decode(trace.Encode())));
    })
    let SuffRegion = (suff: string): Region => {
        let model = new Region()
        model.Key = `key${suff}`
        model.Group = `group${suff}`
        model.Desc = `desc${suff}`
        model.Items = [
            new RegionItem(RegionItemType.Room, `val1${suff}`, false),
            new RegionItem(RegionItemType.Zone, `val2${suff}`, true),
        ]
        model.Message = `message{$suff}`
        return model
    }

    it("TestRegion", () => {
        var region = SuffRegion("");
        var region2 = region.Clone();
        region2.Arrange();
        assert.isTrue(region.Equal(region2));
        region = SuffRegion("");
        assert.isTrue(region.Equal(Region.Decode(region.Encode())));
        region = SuffRegion(">:=@!;\\,&!\n");
        assert.isTrue(region.Equal(Region.Decode(region.Encode())));
        region = SuffRegion("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(region.Equal(Region.Decode(region.Encode())));
    })
    let SuffLandmark = (suff: string): Landmark => {
        let model = new Landmark()
        model.Key = `key${suff}`
        model.Type = `type${suff}`
        model.Value = `value${suff}`
        model.Group = `group${suff}`
        model.Desc = `desc${suff}`
        return model
    };
    it("TestLandmark", () => {
        var landmark = SuffLandmark("");
        var landmark2 = landmark.Clone();
        landmark2.Arrange();
        assert.isTrue(landmark.Equal(landmark2));
        landmark = SuffLandmark("");
        assert.isTrue(landmark.Equal(Landmark.Decode(landmark.Encode())));
        landmark = SuffLandmark(">:=@!;\\,&!\n");
        assert.isTrue(landmark.Equal(Landmark.Decode(landmark.Encode())));
        landmark = SuffLandmark("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(landmark.Equal(Landmark.Decode(landmark.Encode())));
    })

    it("TestLandmarkKey", () => {
        var landmark = ((): Landmark => {
            let model = new Landmark();
            model.Key = "key"
            model.Type = "type"
            return model;
        })()
        var landmark2 = ((): Landmark => {
            let model = new Landmark();
            model.Key = "key"
            model.Type = "type2"
            return model;
        })()
        var key = new LandmarkKey("key", "type");
        var key2 = landmark2.UniqueKey();
        assert.isTrue(key.Equal(landmark.UniqueKey()));
        assert.equal(key.ToString(), landmark.UniqueKey().ToString());
        assert.isFalse(key.Equal(key2));
        assert.notEqual(key.ToString(), key2.ToString());
    })
    let SuffShortcut = (suff: string): Shortcut => {
        let model = new Shortcut()
        model.Key = `key${suff}`
        model.Group = `group${suff}`
        model.Desc = `desc${suff}`
        model.RoomConditions = [new ValueCondition(`con1${suff}`, 0, false), new ValueCondition(`con2${suff}`, 10, true)]
        model.Command = `cmd${suff}`
        model.To = `to${suff}`
        model.Conditions = [new ValueCondition(`con3${suff}`, 0, false), new ValueCondition(`con4${suff}`, 5, true)]
        model.Cost = 1
        return model
    };


    it("TestShortcut", () => {

        var shortcut = SuffShortcut("");
        shortcut.Arrange();
        let shortcut2: Shortcut;
        shortcut2 = new Shortcut();
        shortcut2.Conditions = [new ValueCondition("con1", 0, true), new ValueCondition("con2", 0, false)];
        shortcut2.Arrange();
        assert.isTrue(shortcut2.Conditions[0].Equal(new ValueCondition("con2", 0, false)));
        assert.isTrue(shortcut2.Conditions[1].Equal(new ValueCondition("con1", 0, true)));
        shortcut2.Conditions = [new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, false)];
        shortcut2.Arrange();
        assert.isTrue(shortcut2.Conditions[0].Equal(new ValueCondition("con1", 0, false)));
        assert.isTrue(shortcut2.Conditions[1].Equal(new ValueCondition("con2", 0, false)));
        shortcut2.Conditions = [new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, true)];
        shortcut2.Arrange();
        assert.isTrue(shortcut2.Conditions[0].Equal(new ValueCondition("con1", 0, false)));
        assert.isTrue(shortcut2.Conditions[1].Equal(new ValueCondition("con2", 0, true)));
        shortcut2.Conditions = [new ValueCondition("con1", 0, true), new ValueCondition("con2", 0, true)];
        shortcut2.Arrange();
        assert.isTrue(shortcut2.Conditions[0].Equal(new ValueCondition("con1", 0, true)));
        assert.isTrue(shortcut2.Conditions[1].Equal(new ValueCondition("con2", 0, true)));

        shortcut2 = new Shortcut();
        shortcut2.RoomConditions = [new ValueCondition("con1", 0, true), new ValueCondition("con2", 0, false)];
        shortcut2.Arrange();
        assert.isTrue(shortcut2.RoomConditions[0].Equal(new ValueCondition("con2", 0, false)));
        assert.isTrue(shortcut2.RoomConditions[1].Equal(new ValueCondition("con1", 0, true)));
        shortcut2.RoomConditions = [new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, false)];
        shortcut2.Arrange();
        assert.isTrue(shortcut2.RoomConditions[0].Equal(new ValueCondition("con1", 0, false)));
        assert.isTrue(shortcut2.RoomConditions[1].Equal(new ValueCondition("con2", 0, false)));
        shortcut2.RoomConditions = [new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, true)];
        shortcut2.Arrange();
        assert.isTrue(shortcut2.RoomConditions[0].Equal(new ValueCondition("con1", 0, false)));
        assert.isTrue(shortcut2.RoomConditions[1].Equal(new ValueCondition("con2", 0, true)));
        shortcut2.RoomConditions = [new ValueCondition("con1", 0, true), new ValueCondition("con2", 0, true)];
        shortcut2.Arrange();
        assert.isTrue(shortcut2.RoomConditions[0].Equal(new ValueCondition("con1", 0, true)));
        assert.isTrue(shortcut2.RoomConditions[1].Equal(new ValueCondition("con2", 0, true)));

        shortcut2 = shortcut.Clone();
        shortcut2.Arrange();
        assert.isTrue(shortcut.Equal(shortcut2));
        shortcut = SuffShortcut("");
        assert.isTrue(shortcut.Equal(Shortcut.Decode(shortcut.Encode())));
        shortcut = SuffShortcut(">:=@!;\\,&!\n");
        assert.isTrue(shortcut.Equal(Shortcut.Decode(shortcut.Encode())));
        shortcut = SuffShortcut("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(shortcut.Equal(Shortcut.Decode(shortcut.Encode())));
    })
    let SuffVariable = (suff: string): Variable => {
        let model = new Variable()
        model.Key = `key${suff}`
        model.Value = `value${suff}`
        model.Group = `group${suff}`
        model.Desc = `desc${suff}`
        return model
    }
    it("TestVariable", () => {

        var variable = SuffVariable("");
        var variable2 = variable.Clone();
        variable2.Arrange();
        assert.isTrue(variable.Equal(variable2));
        variable = SuffVariable("");
        assert.isTrue(variable.Equal(Variable.Decode(variable.Encode())));
        variable = SuffVariable(">:=@!;\\,&!\n");
        assert.isTrue(variable.Equal(Variable.Decode(variable.Encode())));
        variable = SuffVariable("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(variable.Equal(Variable.Decode(variable.Encode())));
    })
    let SuffSnapshot = (suff: string): Snapshot => {
        let model = new Snapshot()
        model.Key = `key${suff}`
        model.Type = `type${suff}`
        model.Value = `value${suff}`
        model.Group = `group${suff}`
        model.Count = 1
        model.Timestamp = 123456789
        return model
    }

    it("TestSnapshot", () => {

        var snapshot = SuffSnapshot("");
        var snapshot2 = snapshot.Clone();
        snapshot2.Arrange();
        assert.isTrue(snapshot.Equal(snapshot2));
        snapshot = SuffSnapshot("");
        assert.isTrue(snapshot.Equal(Snapshot.Decode(snapshot.Encode())));
        snapshot = SuffSnapshot(">:=@!;\\,&!\n");
        assert.isTrue(snapshot.Equal(Snapshot.Decode(snapshot.Encode())));
        snapshot = SuffSnapshot("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(snapshot.Equal(Snapshot.Decode(snapshot.Encode())));
    })

    it("TestSnapshotKey", () => {

        var snapshot = ((): Snapshot => {
            let model = new Snapshot()
            model.Key = "key"
            model.Type = "type"
            model.Value = "value"
            return model
        })()
        var snapshot2 = ((): Snapshot => {
            let model = new Snapshot()
            model.Key = "key"
            model.Type = "Type"
            model.Value = "value2"
            return model
        })()

        var key = new SnapshotKey("key", "type", "value");
        var key2 = snapshot2.UniqueKey();
        assert.isTrue(key.Equal(snapshot.UniqueKey()));
        assert.equal(key.ToString(), snapshot.UniqueKey().ToString());
        assert.isFalse(key.Equal(key2));
        assert.notEqual(key.ToString(), key2.ToString());
    })


    it("TestMap", () => {

        var records = new Records();
        var snapshot = ((): Snapshot => {
            let model = new Snapshot()
            model.Key = "1"
            model.Group = "2"
            model.Type = "2"
            model.Timestamp = 1
            model.Value = "2"
            return model
        })()
        var snapshot2 = ((): Snapshot => {
            let model = new Snapshot()
            model.Key = "2"
            model.Group = "2"
            model.Type = "2"
            model.Timestamp = 1
            model.Value = "2"
            return model
        })()
        var snapshot3 = ((): Snapshot => {
            let model = new Snapshot()
            model.Key = "3"
            model.Group = "1"
            model.Type = "2"
            model.Timestamp = 1
            model.Value = "2"
            return model
        })()
        var snapshot4 = ((): Snapshot => {
            let model = new Snapshot()
            model.Key = "3"
            model.Group = "1"
            model.Type = "2"
            model.Timestamp = 0
            model.Value = "2"
            return model
        })()

        var snapshot5 = ((): Snapshot => {
            let model = new Snapshot()
            model.Key = "2"
            model.Group = "2"
            model.Type = "1"
            model.Timestamp = 1
            model.Value = "2"
            return model
        })()
        var snapshot6 = ((): Snapshot => {
            let model = new Snapshot()
            model.Key = "2"
            model.Group = "2"
            model.Type = "1"
            model.Timestamp = 1
            model.Value = "1"
            return model
        })()
        records.Snapshots = [snapshot, snapshot2];
        records.Arrange();
        assert.equal(snapshot, records.Snapshots[0]);
        assert.equal(snapshot2, records.Snapshots[1]);
        records.Snapshots = [snapshot2, snapshot];
        records.Arrange();
        assert.equal(snapshot, records.Snapshots[0]);
        assert.equal(snapshot2, records.Snapshots[1]);
        records.Snapshots = [snapshot, snapshot3];
        records.Arrange();
        assert.equal(snapshot3, records.Snapshots[0]);
        assert.equal(snapshot, records.Snapshots[1]);
        records.Snapshots = [snapshot4, snapshot3];
        records.Arrange();
        assert.equal(snapshot4, records.Snapshots[0]);
        assert.equal(snapshot3, records.Snapshots[1]);
        records.Snapshots = [snapshot5, snapshot2];
        records.Arrange();
        assert.equal(snapshot5, records.Snapshots[0]);
        assert.equal(snapshot2, records.Snapshots[1]);
        records.Snapshots = [snapshot5, snapshot6];
        records.Arrange();
        assert.equal(snapshot6, records.Snapshots[0]);
        assert.equal(snapshot5, records.Snapshots[1]);
    })
    let SuffMapInfo = (suff: string): MapInfo => {
        let model = new MapInfo()
        model.Name = `name${suff}`
        model.Desc = `desc${suff}`
        return model
    }

    it("TestMapInfo", () => {
        var mapInfo = SuffMapInfo("");
        var mapInfo2 = mapInfo.Clone();
        assert.isTrue(mapInfo.Equal(mapInfo2));
        mapInfo = SuffMapInfo("");
        assert.isTrue(mapInfo.Equal(MapInfo.Decode(mapInfo.Encode())));
        mapInfo = SuffMapInfo(">:=@!;\\,&!\n");
        assert.isTrue(mapInfo.Equal(MapInfo.Decode(mapInfo.Encode())));
        mapInfo = SuffMapInfo("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n");
        assert.isTrue(mapInfo.Equal(MapInfo.Decode(mapInfo.Encode())));
    })
})