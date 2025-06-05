
import { assert } from "chai";
import { MapFile, Room, Marker, Route, Trace, Region, Landmark, Variable, Shortcut, Snapshot, MapEncoding } from "../src/index";
import { HMMEncoder, DefaultHmmEncoderHooks } from "../src/index";
describe("HMMTest", () => {
    it("TestEncoder", () => {
        var mf = MapFile.Create("testname", "testdesc");
        var room = new Room()
        room.Key = "testroom世界"
        var marker = new Marker()
        marker.Key = "testmarker世界"
        marker.Value = "value"

        var route = new Route()
        route.Key = "testroute世界"
        var trace = new Trace()
        trace.Key = "testtrace世界"
        var region = new Region()
        region.Key = "testregion世界"
        var landmark = new Landmark()
        landmark.Key = "testlandmark世界"
        var variable = new Variable()
        variable.Key = "testvariable世界"
        var shortcut = new Shortcut()
        shortcut.Key = "testshortcut世界"
        shortcut.Command = "to"

        var snapshot = new Snapshot()
        snapshot.Key = "testsnapshot世界"
        snapshot.Timestamp = 1
        mf.InsertRoom(room);
        mf.InsertMarker(marker);
        mf.InsertRoute(route);
        mf.InsertTrace(trace);
        mf.InsertRegion(region);
        mf.InsertLandmark(landmark);
        mf.InsertVariable(variable);
        mf.InsertShortcut(shortcut);
        mf.InsertSnapshot(snapshot);

        var data = HMMEncoder.Encode(mf);
        var mf2 = HMMEncoder.Decode(data);
        assert.isNotNull(mf2);
        assert.equal(mf.Map.Info.Name, mf2.Map.Info.Name);
        assert.equal(mf.Map.Info.Desc, mf2.Map.Info.Desc);
        assert.equal(Object.keys(mf.Records.Rooms).length, Object.keys(mf2.Records.Rooms).length);
        assert.equal(Object.keys(mf.Records.Markers).length, Object.keys(mf2.Records.Markers).length);
        assert.equal(Object.keys(mf.Records.Routes).length, Object.keys(mf2.Records.Routes).length);
        assert.equal(Object.keys(mf.Records.Traces).length, Object.keys(mf2.Records.Traces).length);
        assert.equal(Object.keys(mf.Records.Regions).length, Object.keys(mf2.Records.Regions).length);
        assert.equal(Object.keys(mf.Records.Landmarks).length, Object.keys(mf2.Records.Landmarks).length);
        assert.equal(Object.keys(mf.Records.Variables).length, Object.keys(mf2.Records.Variables).length);
        assert.equal(Object.keys(mf.Records.Shortcuts).length, Object.keys(mf2.Records.Shortcuts).length);
        assert.equal(mf.Records.Snapshots.length, mf2.Records.Snapshots.length);

        assert.isTrue(mf.Records.Rooms[Object.keys(mf.Records.Rooms)[0]].Equal(mf2.Records.Rooms[Object.keys(mf2.Records.Rooms)[0]]));
        assert.isTrue(mf.Records.Markers[Object.keys(mf.Records.Markers)[0]].Equal(mf2.Records.Markers[Object.keys(mf2.Records.Markers)[0]]));
        assert.isTrue(mf.Records.Routes[Object.keys(mf.Records.Routes)[0]].Equal(mf2.Records.Routes[Object.keys(mf2.Records.Routes)[0]]));
        assert.isTrue(mf.Records.Traces[Object.keys(mf.Records.Traces)[0]].Equal(mf2.Records.Traces[Object.keys(mf2.Records.Traces)[0]]));
        assert.isTrue(mf.Records.Regions[Object.keys(mf.Records.Regions)[0]].Equal(mf2.Records.Regions[Object.keys(mf2.Records.Regions)[0]]));
        assert.isTrue(mf.Records.Landmarks[Object.keys(mf.Records.Landmarks)[0]].Equal(mf2.Records.Landmarks[Object.keys(mf2.Records.Landmarks)[0]]));
        assert.isTrue(mf.Records.Variables[Object.keys(mf.Records.Variables)[0]].Equal(mf2.Records.Variables[Object.keys(mf2.Records.Variables)[0]]));
        assert.isTrue(mf.Records.Shortcuts[Object.keys(mf.Records.Shortcuts)[0]].Equal(mf2.Records.Shortcuts[Object.keys(mf2.Records.Shortcuts)[0]]));
        assert.isTrue(mf.Records.Snapshots[0].Equal(mf2.Records.Snapshots[0]));

        mf2 = HMMEncoder.Decode("");
        assert.isNull(mf2);
    })
    var TestEncodeRoomHook = (room: Room): Room | null => {
        if (room.Key == "empty") {
            return null;
        }
        var model = room.Clone();
        model.Key = room.Key + "-encoded";
        return model;
    }
    var TestEncodeShortcutHook = (shortcut: Shortcut): Shortcut | null => {

        if (shortcut.Key == "empty") {
            return null;
        }
        var model = shortcut.Clone();
        model.Key = shortcut.Key + "-encoded";
        return model;
    }
    var TestDecodeRoomHook = (room: Room): Room | null => {
        if (room.Key == "empty") {
            return null;
        }
        var model = room.Clone();
        model.Key = room.Key + "-decoded";
        return model;
    }
    var TestDecodeShortcutHook = (shortcut: Shortcut): Shortcut | null => {
        if (shortcut.Key == "empty") {
            return null;
        }
        var model = shortcut.Clone();
        model.Key = shortcut.Key + "-decoded";
        return model;
    }

    it("TestHook", () => {

        var mf = MapFile.Create("testname", "testdesc");
        var room = new Room()
        room.Key = "empty"
        var room2 = new Room()
        room2.Key = "key1"
        var shortcut = new Shortcut()
        shortcut.Key = "empty"
        shortcut.Command = "to"

        var shortcut2 = new Shortcut()
        shortcut2.Key = "key1"
        shortcut2.Command = "to2"
        mf.InsertRoom(room);
        mf.InsertRoom(room2);
        mf.InsertShortcut(shortcut);
        mf.InsertShortcut(shortcut2);
        var rawdata = HMMEncoder.Encode(mf);
        HMMEncoder.EncodeRoomHook = TestEncodeRoomHook;
        HMMEncoder.EncodeShortcutHook = TestEncodeShortcutHook;
        var data = HMMEncoder.Encode(mf);
        var mf2 = HMMEncoder.Decode(data);
        assert.isNotNull(mf2);
        assert.equal(1, Object.keys(mf2.Records.Rooms).length);
        assert.equal("key1-encoded", Object.keys(mf2.Records.Rooms)[0]);
        assert.equal(1, Object.keys(mf2.Records.Shortcuts).length);
        assert.equal("key1-encoded", Object.keys(mf2.Records.Shortcuts)[0]);
        HMMEncoder.DecodeRoomHook = TestDecodeRoomHook;
        HMMEncoder.DecodeShortcutHook = TestDecodeShortcutHook;
        var mf3 = HMMEncoder.Decode(rawdata);
        assert.isNotNull(mf3);
        assert.equal(1, Object.keys(mf3.Records.Rooms).length);
        assert.equal("key1-decoded", Object.keys(mf3.Records.Rooms)[0]);
        assert.equal(1, Object.keys(mf2.Records.Shortcuts).length);
        assert.equal("key1-decoded", Object.keys(mf3.Records.Shortcuts)[0]);
        assert.equal(TestEncodeRoomHook, HMMEncoder.EncodeRoomHook);
        assert.equal(TestEncodeShortcutHook, HMMEncoder.EncodeShortcutHook);
        assert.equal(TestDecodeRoomHook, HMMEncoder.DecodeRoomHook);
        assert.equal(TestDecodeShortcutHook, HMMEncoder.DecodeShortcutHook);
        HMMEncoder.ResetHooks();
        assert.equal(DefaultHmmEncoderHooks.RoomHook, HMMEncoder.EncodeRoomHook);
        assert.equal(DefaultHmmEncoderHooks.ShortcutHook, HMMEncoder.EncodeShortcutHook);
        assert.equal(DefaultHmmEncoderHooks.RoomHook, HMMEncoder.DecodeRoomHook);
        assert.equal(DefaultHmmEncoderHooks.ShortcutHook, HMMEncoder.DecodeShortcutHook);
        var mf4 = HMMEncoder.Decode(rawdata);
        assert.isNotNull(mf4);
        assert.equal(2, Object.keys(mf4.Records.Rooms).length);
        assert.isTrue(mf.Records.Rooms[Object.keys(mf.Records.Rooms)[0]].Equal(mf4.Records.Rooms[Object.keys(mf4.Records.Rooms)[0]]));
        assert.isTrue(mf.Records.Rooms[Object.keys(mf.Records.Rooms)[1]].Equal(mf4.Records.Rooms[Object.keys(mf4.Records.Rooms)[1]]));
        assert.equal(2, Object.keys(mf4.Records.Shortcuts).length);
        assert.isTrue(mf.Records.Shortcuts[Object.keys(mf.Records.Rooms)[0]].Equal(mf4.Records.Shortcuts[Object.keys(mf4.Records.Rooms)[0]]));
        assert.isTrue(mf.Records.Shortcuts[Object.keys(mf.Records.Rooms)[1]].Equal(mf4.Records.Shortcuts[Object.keys(mf4.Records.Rooms)[1]]));
    })
})
