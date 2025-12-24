import { assert } from "chai";
import { Data, Condition, TypedConditions, ValueTag, ValueCondition, KeyValue, ToggleKeyValue, Exit, Room, RoomFilter, Marker, Route, Trace, Region, RegionItem, RegionItemType, Landmark, Shortcut, Variable, Snapshot, SnapshotKey, MapEncoding, Map, MapInfo, MapSettings, MapFile } from "../src/index";
import { LandmarkKey, ItemKey, Context, RoomConditionExit, Path, Link, Environment, CommandCost, Step, QueryResult, SnapshotFilter, SnapshotSearchResult, SnapshotSearch, MapperOptions } from "../src/index";

describe("ModelTest", () => {
    it("TestBase", () => {
        var data = new Data("key", "Value");
        let data2: Data;
        data2 = data.Clone();
        assert.isTrue(data.Equal(data2));
        assert.isTrue(data2.Validated());
        data2.Key = "";
        assert.isFalse(data.Equal(data2));
        assert.isFalse(data2.Validated());
        data2 = data.Clone();
        data2.Value = "";
        assert.isFalse(data.Equal(data2));
        assert.isFalse(data2.Validated());

        var con = new Condition("cond", true);
        let con2: Condition;
        con2 = con.Clone();
        assert.isTrue(con.Equal(con2));
        assert.isTrue(con2.Validated());
        con2 = con.Clone();
        con2.Key = "";
        assert.isFalse(con.Equal(con2));
        assert.isFalse(con2.Validated());
        con2 = con.Clone();
        con2.Not = false;
        assert.isFalse(con.Equal(con2));
        assert.isTrue(con2.Validated());

        var tc = new TypedConditions("key", ["1", "2"], true);
        let tc2: TypedConditions;
        tc2 = tc.Clone();
        assert.isTrue(tc.Equal(tc2));
        assert.isTrue(tc2.Validated());
        tc2 = tc.Clone();
        tc2.Key = "";
        assert.isFalse(tc.Equal(tc2));
        assert.isFalse(tc2.Validated());
        tc2 = tc.Clone();
        tc2.Conditions[0] = "0";
        assert.isFalse(tc.Equal(tc2));
        assert.isTrue(tc2.Validated());
        tc2 = tc.Clone();
        tc2.Conditions.push("3");
        assert.isFalse(tc.Equal(tc2));
        assert.isTrue(tc2.Validated());

        tc2 = tc.Clone();
        tc2.Not = false;
        assert.isFalse(tc.Equal(tc2));
        assert.isTrue(tc2.Validated());

        var vt = new ValueTag("key", 1);
        let vt2: ValueTag;
        vt2 = vt.Clone();
        assert.isTrue(vt.Equal(vt2));
        assert.isTrue(vt2.Validated());
        assert.equal("key", vt2.ToString());
        vt2 = vt.Clone();
        vt2.Key = "";
        assert.isFalse(vt.Equal(vt2));
        assert.isFalse(vt2.Validated());
        assert.equal("", vt2.ToString());
        vt2 = vt.Clone();
        vt2.Value = -1;
        assert.isFalse(vt.Equal(vt2));
        assert.isTrue(vt2.Validated());
        assert.equal("key:-1", vt2.ToString());
        vt2 = vt.Clone();
        vt2.Value = 2;
        vt2.Key = "key2";
        assert.isFalse(vt.Equal(vt2));
        assert.equal("key2:2", vt2.ToString());

        assert.isTrue(vt.Match("key", 0));
        assert.isTrue(vt.Match("key", -1));
        assert.isFalse(vt.Match("key", 2));
        assert.isFalse(vt.Match("key2", 0));

        var vc = new ValueCondition("key", 1, true);
        let vc2: ValueCondition;
        vc2 = vc.Clone();
        assert.isTrue(vc.Equal(vc2));
        assert.isTrue(vc2.Validated());
        assert.equal("!key", vc2.ToString());
        vc2 = vc.Clone();
        vc2.Key = "";
        assert.isFalse(vc.Equal(vc2));
        assert.isFalse(vc2.Validated());
        assert.equal("!", vc2.ToString());
        vc2 = vc.Clone();
        vc2.Value = -1;
        assert.isFalse(vc.Equal(vc2));
        assert.isTrue(vc2.Validated());
        assert.equal("!key:-1", vc2.ToString());
        vc2 = vc.Clone();
        vc2.Not = false;
        vc2.Value = 1;
        vc2.Key = "key2";
        assert.isFalse(vc.Equal(vc2));
        assert.isTrue(vc2.Validated());
        assert.equal("key2", vc2.ToString());

        let tags: ValueTag[] = [
            new ValueTag("key1", 1),
            new ValueTag("key2", 5),
        ];
        assert.isTrue(ValueTag.HasTag(tags, "key1", 1));
        assert.isTrue(ValueTag.HasTag(tags, "key2", 5));
        assert.isFalse(ValueTag.HasTag(tags, "key1", 2));
        assert.isFalse(ValueTag.HasTag(tags, "key2", 6));
        assert.isFalse(ValueTag.HasTag(tags, "key3", 1));
        assert.isTrue(ValueTag.HasTag(tags, "key3", 0));
        assert.isTrue(ValueTag.ValidateConditions([], []));
        assert.isFalse(ValueTag.ValidateConditions([], [new ValueCondition("key1", 1, false)]));
        assert.isTrue(ValueTag.ValidateConditions(tags, []));
        assert.isTrue(ValueTag.ValidateConditions(tags, [new ValueCondition("key1", 1, false)]));
        assert.isFalse(ValueTag.ValidateConditions(tags, [new ValueCondition("key1", 1, true)]));
        assert.isTrue(ValueTag.ValidateConditions(tags, [new ValueCondition("key1", 1, false), new ValueCondition("key2", 0, false)]));
        assert.isTrue(ValueTag.ValidateConditions(tags, [new ValueCondition("key1", 1, false), new ValueCondition("key2", 10, true)]));
        assert.isFalse(ValueTag.ValidateConditions(tags, [new ValueCondition("key1", 1, false), new ValueCondition("key2", 10, false)]));
        assert.isFalse(ValueTag.ValidateConditions(tags, [new ValueCondition("key1", 1, false), new ValueCondition("key2", 4, true)]));
        assert.isFalse(ValueTag.ValidateConditions(tags, [new ValueCondition("key1", 1, true), new ValueCondition("key2", 1, false)]));
        assert.isTrue(ValueTag.ValidateConditions(tags, [new ValueCondition("key1", 1, false), new ValueCondition("key3", 1, true)]));
        assert.isFalse(ValueTag.ValidateConditions(tags, [new ValueCondition("key1", 1, false), new ValueCondition("key3", 1, false)]));
    })
    it("TestValueTag", () => {
        var kv = new KeyValue("key", "value");
        var tag = kv.ToValueTag();
        assert.equal("key", tag.Key);
        assert.equal(1, tag.Value);
        kv = new KeyValue("key", "");
        tag = kv.ToValueTag();
        assert.equal("key", tag.Key);
        assert.equal(1, tag.Value);
        kv = new KeyValue("key", "1");
        tag = kv.ToValueTag();
        assert.equal("key", tag.Key);
        assert.equal(1, tag.Value);
        kv = new KeyValue("key", "0");
        tag = kv.ToValueTag();
        assert.equal("key", tag.Key);
        assert.equal(0, tag.Value);
        kv = new KeyValue("key", "2");
        tag = kv.ToValueTag();
        assert.equal("key", tag.Key);
        assert.equal(2, tag.Value);
        kv = new KeyValue("key", "-1");
        tag = kv.ToValueTag();
        assert.equal("key", tag.Key);
        assert.equal(-1, tag.Value);
        tag = new ValueTag("key", 0);
        kv = KeyValue.FromValueTag(tag);
        assert.equal("key", kv.Key);
        assert.equal("0", kv.Value);
        tag = new ValueTag("key", -1);
        kv = KeyValue.FromValueTag(tag);
        assert.equal("key", kv.Key);
        assert.equal("-1", kv.Value);
        tag = new ValueTag("key", 1);
        kv = KeyValue.FromValueTag(tag);
        assert.equal("key", kv.Key);
        assert.equal("", kv.Value);
        tag = new ValueTag("key", 2);
        kv = KeyValue.FromValueTag(tag);
        assert.equal("key", kv.Key);
        assert.equal("2", kv.Value);
    });
    it("TestValueCondition", () => {
        var kv = new ToggleKeyValue("key", "value", false);
        var vc = kv.ToValueCondition();
        assert.equal("key", vc.Key);
        assert.equal(1, vc.Value);
        assert.isFalse(vc.Not);
        kv = new ToggleKeyValue("key", "", true);
        vc = kv.ToValueCondition();
        assert.equal("key", vc.Key);
        assert.equal(1, vc.Value);
        assert.isTrue(vc.Not);
        kv = new ToggleKeyValue("key", "1", false);
        vc = kv.ToValueCondition();
        assert.equal("key", vc.Key);
        assert.equal(1, vc.Value);
        assert.isFalse(vc.Not);
        kv = new ToggleKeyValue("key", "0", true);
        vc = kv.ToValueCondition();
        assert.equal("key", vc.Key);
        assert.equal(0, vc.Value);
        assert.isTrue(vc.Not);
        kv = new ToggleKeyValue("key", "2", false);
        vc = kv.ToValueCondition();
        assert.equal("key", vc.Key);
        assert.equal(2, vc.Value);
        assert.isFalse(vc.Not);
        kv = new ToggleKeyValue("key", "-1", true);
        vc = kv.ToValueCondition();
        assert.equal("key", vc.Key);
        assert.equal(-1, vc.Value);
        assert.isTrue(vc.Not);
        vc = new ValueCondition("key", 0, false);
        kv = ToggleKeyValue.FromValueCondition(vc);
        assert.equal("key", kv.Key);
        assert.equal("0", kv.Value);
        assert.isFalse(kv.Not);
        vc = new ValueCondition("key", -1, true);
        kv = ToggleKeyValue.FromValueCondition(vc);
        assert.equal("key", kv.Key);
        assert.equal("-1", kv.Value);
        assert.isTrue(kv.Not);
        vc = new ValueCondition("key", 1, false);
        kv = ToggleKeyValue.FromValueCondition(vc);
        assert.equal("key", kv.Key);
        assert.equal("", kv.Value);
        assert.isFalse(kv.Not);
        vc = new ValueCondition("key", 2, true);
        kv = ToggleKeyValue.FromValueCondition(vc);
        assert.equal("key", kv.Key);
        assert.equal("2", kv.Value);
        assert.isTrue(kv.Not);
    })
    it("TestExit", () => {
        var exit = new Exit()
        exit.To = "to",
            exit.Command = "cmd",
            exit.Cost = 2,
            exit.Conditions = [new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, true)]
        let exit2: Exit;
        exit2 = exit.Clone();
        assert.isTrue(exit.Equal(exit2));
        assert.isTrue(exit2.Validated());
        exit2 = exit.Clone();
        exit2.Command = "";
        assert.isFalse(exit.Equal(exit2));
        assert.isFalse(exit2.Validated());
        exit2 = exit.Clone();
        exit2.To = "";
        assert.isFalse(exit.Equal(exit2));
        assert.isTrue(exit2.Validated());
        exit2 = exit.Clone();
        exit2.Cost = -1;
        assert.isFalse(exit.Equal(exit2));
        assert.isTrue(exit2.Validated());
        exit2 = exit.Clone();
        exit2.Conditions[0].Key = "wrongkey";
        assert.isFalse(exit.Equal(exit2));
        assert.isTrue(exit2.Validated());
        exit2 = exit.Clone();
        exit2.Conditions.push(new ValueCondition("con3", 0, true));
        assert.isFalse(exit.Equal(exit2));
        assert.isTrue(exit2.Validated());
    })
    it("TestRoom", () => {
        let room = new Room()

        room.Key = "key",
            room.Name = "name"
        room.Group = "group"
        room.Desc = "desc"
        room.Tags = [new ValueTag("tag1", 1), new ValueTag("tag2", 1)]
        room.Data = [new Data("dkey1", "dval1"), new Data("dkey2", "dval2")]
        let e1 = new Exit()
        e1.Command = "command1"
        e1.To = "to1"
        e1.Cost = 2
        e1.Conditions = [
            new ValueCondition("con1", 0, true),
            new ValueCondition("con2", 0, false),
        ]
        let e2 = new Exit()
        e2.Command = "command2"
        e2.To = "to2"
        e2.Cost = 4


        room.Exits = [
            e1,
            e2,
        ]


        assert.isTrue(room.HasTag("tag1", 0));
        assert.isTrue(room.HasTag("tag2", 0));
        assert.isFalse(room.HasTag("notexists", 1));
        assert.equal("dval1", room.GetData("dkey1"));
        assert.equal("dval2", room.GetData("dkey2"));
        assert.equal("", room.GetData("notfound"));

        let room2: Room;
        assert.isFalse(room.HasExitTo("to999"));
        assert.isTrue(room.HasExitTo("to1"));
        assert.isTrue(room.HasExitTo("to2"));

        room2 = room.Clone();
        assert.isTrue(room.Equal(room2));
        assert.isTrue(room2.Validated());

        room2 = room.Clone();
        room2.Key = "";
        assert.isFalse(room2.Validated());
        assert.isFalse(room.Equal(room2));

        room2 = room.Clone();
        room2.Desc = "";
        assert.isFalse(room.Equal(room2));
        assert.isTrue(room2.Validated());

        room2 = room.Clone();
        room2.Group = "";
        assert.isFalse(room.Equal(room2));
        assert.isTrue(room2.Validated());

        room2 = room.Clone();
        room2.Desc = "";
        assert.isFalse(room.Equal(room2));
        assert.isTrue(room2.Validated());

        room2 = room.Clone();
        room2.Tags[1] = new ValueTag("", 0);
        assert.isFalse(room.Equal(room2));
        assert.isTrue(room2.Validated());

        room2 = room.Clone();
        room2.Tags.push(new ValueTag("", 0));
        assert.isFalse(room.Equal(room2));
        assert.isTrue(room2.Validated());

        room2 = room.Clone();
        room2.Exits[0].To = "";
        assert.isFalse(room.Equal(room2));
        assert.isTrue(room2.Validated());

        room2 = room.Clone();
        room2.Exits.push(new Exit());
        assert.isFalse(room.Equal(room2));
        assert.isTrue(room2.Validated());

        room2 = room.Clone();
        room2.Data[0].Value = "";
        assert.isFalse(room.Equal(room2));
        assert.isTrue(room2.Validated());

        room2 = room.Clone();
        room2.Data.push(new Data("", ""));
        assert.isFalse(room.Equal(room2));
        assert.isTrue(room2.Validated());

    })
    it("TestRoomFilter", () => {
        var rf = new RoomFilter();
        var room = new Room()
        room.Key = "key"
        room.Name = "name"
        room.Group = "group"
        room.Desc = "desc"
        room.Tags = [new ValueTag("tag1", 1), new ValueTag("tag2", 1)]
        room.Data = [new Data("dkey1", "dval1"), new Data("dkey2", "dval2")]
        let e1 = new Exit()
        e1.Command = "command1"
        e1.To = "to1"
        e1.Cost = 2
        e1.Conditions = [
            new ValueCondition("con1", 1, true),
            new ValueCondition("con2", 1, false),
        ]
        let e2 = new Exit()
        e2.Command = "command2"
        e2.To = "to2"
        e2.Cost = 4
        room.Exits = [e1, e2]
        assert.isTrue(rf.Validate(room));
        rf.ContainsAnyKey = ["key1", "name2"];
        assert.isFalse(rf.Validate(room));
        rf.ContainsAnyKey = ["ke", "name2"];
        assert.isTrue(rf.Validate(room));
        rf.ContainsAnyKey = [];
        assert.isTrue(rf.Validate(room));
        rf.ContainsAnyName = ["name1", "name2"];
        assert.isFalse(rf.Validate(room));
        rf.ContainsAnyName = ["na", "name2"];
        assert.isTrue(rf.Validate(room));
        rf.ContainsAnyName = [];
        assert.isTrue(rf.Validate(room));
        rf.HasAnyName = ["nam", "name2"];
        assert.isFalse(rf.Validate(room));
        rf.HasAnyName = ["name", "name2"];
        assert.isTrue(rf.Validate(room));
        rf.HasAnyName = [];
        assert.isTrue(rf.Validate(room));
        rf.HasAnyExitTo = ["to3", "to4"];
        assert.isFalse(rf.Validate(room));;
        rf.HasAnyExitTo = ["to3", "to2"];
        assert.isTrue(rf.Validate(room));
        rf.HasAnyExitTo = [];
        rf.HasAnyData = [new Data("dkey1", "dval"), new Data("dkey2", "dval3")];
        assert.isFalse(rf.Validate(room));;
        rf.HasAnyData = [new Data("dkey1", "dval1"), new Data("dkey2", "dval3")];
        assert.isTrue(rf.Validate(room));
        rf.HasAnyData = [];
        rf.ContainsAnyData = [new Data("dkey1", "dval2"), new Data("dkey2", "dval3")];
        assert.isFalse(rf.Validate(room));;
        rf.ContainsAnyData = [new Data("dkey1", "dval"), new Data("dkey2", "dval3")];
        assert.isTrue(rf.Validate(room));
        rf.ContainsAnyData = [];
        rf.RoomConditions = [new ValueCondition("tag1", 1, true), new ValueCondition("tag2", 1, false)];
        assert.isFalse(rf.Validate(room));;
        rf.RoomConditions = [new ValueCondition("tag1", 2, true), new ValueCondition("tag2", 1, false)];
        assert.isTrue(rf.Validate(room));
        rf.ContainsAnyData = [];
        rf.HasAnyGroup = ["group1", "group2"];
        assert.isFalse(rf.Validate(room));
        rf.HasAnyGroup = ["group", "group2"];
        assert.isTrue(rf.Validate(room));
        rf.HasAnyGroup = [];
    })
    it("TestMarker", () => {
        var marker = new Marker()

        marker.Key = "key1"
        marker.Value = "value1"
        marker.Group = "group1"
        marker.Desc = "desc1"
        marker.Message = "message1"
        assert.isTrue(marker.Filter("key"));
        assert.isTrue(marker.Filter("value"));
        assert.isTrue(marker.Filter("group"));
        assert.isTrue(marker.Filter("desc"));
        assert.isTrue(marker.Filter("message"));
        assert.isFalse(marker.Filter("notfound"));
        let marker2: Marker;
        marker2 = marker.Clone();
        assert.isTrue(marker2.Validated());
        marker2.Key = "";
        assert.isFalse(marker2.Validated());
        assert.isFalse(marker.Equal(marker2));
        marker2 = marker.Clone();
        marker2.Value = "";
        assert.isFalse(marker2.Validated());
        assert.isFalse(marker.Equal(marker2));
        marker2 = marker.Clone();
        assert.isTrue(marker.Equal(marker2));
        marker2 = marker.Clone();
        marker2.Group = "";
        assert.isTrue(marker2.Validated());
        assert.isFalse(marker.Equal(marker2));

        marker2 = marker.Clone();
        marker2.Desc = "";
        assert.isTrue(marker2.Validated());
        assert.isFalse(marker.Equal(marker2));

        marker2 = marker.Clone();
        marker2.Message = "";
        assert.isTrue(marker2.Validated());
        assert.isFalse(marker.Equal(marker2));

    })
    it("TestRoute", () => {
        var route = new Route()
        route.Key = "key1"
        route.Rooms = ["rid1a", "rid1b"]
        route.Desc = "desc1"
        route.Group = "group1"
        route.Message = "message1"
        let route2: Route;
        route2 = route.Clone();
        assert.isTrue(route2.Validated());
        assert.isTrue(route.Equal(route2));
        route2.Key = "";
        assert.isFalse(route2.Validated());
        assert.isFalse(route.Equal(route2));
        route2 = route.Clone();
        route2.Rooms[0] = "rid0";
        assert.isTrue(route2.Validated());
        assert.isFalse(route.Equal(route2));
        route2 = route.Clone();
        route2.Rooms.push("rid3");
        assert.isTrue(route2.Validated());
        assert.isFalse(route.Equal(route2));
        route2 = route.Clone();
        route2.Group = "";
        assert.isTrue(route2.Validated());
        assert.isFalse(route.Equal(route2));
        route2 = route.Clone();
        route2.Desc = "";
        assert.isTrue(route2.Validated());
        assert.isFalse(route.Equal(route2));
        route2 = route.Clone();
        route2.Message = "";
        assert.isTrue(route2.Validated());
        assert.isFalse(route.Equal(route2));
    })
    it("TestTrace", () => {
        var trace = new Trace()
        trace.Key = "key1"
        trace.Locations = ["rid1", "rid2"]
        trace.Group = "group1"
        trace.Desc = "desc1"
        trace.Message = "message1"

        let trace2: Trace;
        trace2 = trace.Clone();
        assert.isTrue(trace.Equal(trace2));
        assert.isTrue(trace2.Validated());

        trace2.Key = "";
        assert.isFalse(trace.Equal(trace2));
        assert.isFalse(trace2.Validated());

        trace2 = trace.Clone();
        trace2.Locations[0] = "rid0";
        assert.isFalse(trace.Equal(trace2));
        assert.isTrue(trace2.Validated());

        trace2 = trace.Clone();
        trace2.Locations.push("rid3");
        assert.isFalse(trace.Equal(trace2));
        assert.isTrue(trace2.Validated());

        trace2 = trace.Clone();
        trace2.Group = "";
        assert.isFalse(trace.Equal(trace2));
        assert.isTrue(trace2.Validated());

        trace2 = trace.Clone();
        trace2.Desc = "";
        assert.isFalse(trace.Equal(trace2));
        assert.isTrue(trace2.Validated());

        trace2 = trace.Clone();
        trace2.Message = "";
        assert.isFalse(trace.Equal(trace2));
        assert.isTrue(trace2.Validated());
    })
    it("TestRegion", () => {

        var region = new Region()
        region.Key = "key1"
        region.Group = "group1"
        region.Desc = "desc1"
        region.Message = "message1"
        region.Items = [new RegionItem(RegionItemType.Room, "room1", false), new RegionItem(RegionItemType.Zone, "zone1", true)]
        let region2: Region;
        region2 = region.Clone();
        assert.isTrue(region.Equal(region2));
        assert.isTrue(region2.Validated());
        region2.Key = "";
        assert.isFalse(region.Equal(region2));
        assert.isFalse(region2.Validated());
        region2 = region.Clone();
        region2.Items[0].Value = "room0";
        assert.isFalse(region.Equal(region2));
        assert.isTrue(region2.Validated());
        region2 = region.Clone();
        region2.Items.push(new RegionItem(RegionItemType.Room, "room3", false));
        assert.isFalse(region.Equal(region2));
        assert.isTrue(region2.Validated());
        region2 = region.Clone();
        region2.Group = "";
        assert.isFalse(region.Equal(region2));
        assert.isTrue(region2.Validated());
        region2 = region.Clone();
        region2.Desc = "";
        assert.isFalse(region.Equal(region2));
        assert.isTrue(region2.Validated());
        region2 = region.Clone();
        region2.Message = "";
        assert.isFalse(region.Equal(region2));
        assert.isTrue(region2.Validated());
    })
    it("TestRegionItem", () => {
        var ri = new RegionItem(RegionItemType.Room, "room1", false);
        let ri2: RegionItem;
        assert.isTrue(ri.Validated());
        ri2 = ri.Clone();
        assert.isTrue(ri.Equal(ri2));
        assert.isTrue(ri2.Validated());
        ri2 = ri.Clone();
        ri2.Value = "";
        assert.isFalse(ri.Equal(ri2));
        assert.isFalse(ri2.Validated());
        ri2 = ri.Clone();
        ri2.Type = RegionItemType.Zone;
        assert.isFalse(ri.Equal(ri2));
        assert.isTrue(ri2.Validated());
        ri2 = ri.Clone();
        ri2.Not = true;
        assert.isFalse(ri.Equal(ri2));
        ri2 = ri.Clone();
        ri2.Not = true;
        ri2.Type = RegionItemType.Zone;
        assert.isFalse(ri.Equal(ri2));
        assert.isTrue(ri2.Validated());
    })
    it("TestLandmark", () => {

        var lm = new Landmark()
        lm.Key = "key1"
        lm.Type = "type1"
        lm.Value = "value1"
        lm.Group = "group1"
        lm.Desc = "desc1"

        let lm2: Landmark;
        lm2 = lm.Clone();
        assert.isTrue(lm.Equal(lm2));
        assert.isTrue(lm2.Validated());
        assert.equal(lm.UniqueKey().ToString(), lm2.UniqueKey().ToString());
        lm2.Key = "";
        assert.isFalse(lm.Equal(lm2));
        assert.isFalse(lm2.Validated());
        assert.notEqual(lm.UniqueKey(), lm2.UniqueKey());
        lm2 = lm.Clone();
        lm2.Type = "";
        assert.isFalse(lm.Equal(lm2));
        assert.isTrue(lm2.Validated());
        assert.notEqual(lm.UniqueKey(), lm2.UniqueKey());
        lm2 = lm.Clone();
        lm2.Value = "";
        assert.isFalse(lm.Equal(lm2));
        assert.isTrue(lm2.Validated());
        assert.equal(lm.UniqueKey().ToString(), lm2.UniqueKey().ToString());
        lm2 = lm.Clone();
        lm2.Group = "";
        assert.isFalse(lm.Equal(lm2));
        assert.isTrue(lm2.Validated());
        assert.equal(lm.UniqueKey().ToString(), lm2.UniqueKey().ToString());
        lm2 = lm.Clone();
        lm2.Desc = "";
        assert.isFalse(lm.Equal(lm2));
        assert.isTrue(lm2.Validated());
        assert.equal(lm.UniqueKey().ToString(), lm2.UniqueKey().ToString());
    })
    it("TestShortcut", () => {

        var sc = new Shortcut()

        sc.Key = "key1"
        sc.Group = "group1"
        sc.Desc = "desc1"
        sc.Command = "command1"
        sc.To = "to1"
        sc.Cost = 2
        sc.RoomConditions = [new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, true)]
        sc.Conditions = [new ValueCondition("con3", 0, false), new ValueCondition("con4", 0, true)]

        let sc2: Shortcut;
        sc2 = sc.Clone();
        assert.isTrue(sc.Equal(sc2));
        assert.isTrue(sc2.Validated());

        sc2.Key = "";
        assert.isFalse(sc.Equal(sc2));
        assert.isFalse(sc2.Validated());

        sc2 = sc.Clone();
        sc2.Command = "";
        assert.isFalse(sc.Equal(sc2));
        assert.isFalse(sc2.Validated());
        sc2 = sc.Clone();
        sc2.To = "";
        assert.isFalse(sc.Equal(sc2));
        assert.isTrue(sc2.Validated());
        sc2 = sc.Clone();
        sc2.Cost = -1;
        assert.isFalse(sc.Equal(sc2));
        assert.isTrue(sc2.Validated());
        sc2 = sc.Clone();
        sc2.Conditions[0].Key = "wrongkey";
        assert.isFalse(sc.Equal(sc2));
        assert.isTrue(sc2.Validated());
        sc2 = sc.Clone();
        sc2.Conditions.push(new ValueCondition("con5", 0, true));
        assert.isFalse(sc.Equal(sc2));
        assert.isTrue(sc2.Validated());
        sc2 = sc.Clone();
        sc2 = sc.Clone();
        sc2.Conditions = [];
        sc2 = sc.Clone();
        sc2.RoomConditions[0].Key = "wrongkey";
        assert.isFalse(sc.Equal(sc2));
        assert.isTrue(sc2.Validated());
        sc2 = sc.Clone();
        sc2.RoomConditions.push(new ValueCondition("con5", 0, true));
        assert.isFalse(sc.Equal(sc2));
        assert.isTrue(sc2.Validated());
    })
    it("TestVariable", () => {

        var var1 = new Variable()
        var1.Key = "key1"
        var1.Value = "value1"
        var1.Group = "group1"
        var1.Desc = "desc1"

        let var2: Variable;
        var2 = var1.Clone();
        assert.isTrue(var1.Equal(var2));
        assert.isTrue(var2.Validated());
        var2.Key = "";
        assert.isFalse(var1.Equal(var2));
        assert.isFalse(var2.Validated());
        var2 = var1.Clone();
        var2.Value = "";
        assert.isFalse(var1.Equal(var2));
        assert.isTrue(var2.Validated());
        var2 = var1.Clone();
        var2.Group = "";
        assert.isFalse(var1.Equal(var2));
        assert.isTrue(var2.Validated());
        var2 = var1.Clone();
        var2.Desc = "";
        assert.isFalse(var1.Equal(var2));
        assert.isTrue(var2.Validated());
    })

    it("TestSnapshot", () => {

        var snapshot = new Snapshot()
        snapshot.Key = "key1"
        snapshot.Type = "type1"
        snapshot.Value = "value1"
        snapshot.Group = "group1"
        snapshot.Timestamp = 1234567890

        let snapshot2: Snapshot;
        snapshot2 = snapshot.Clone();
        assert.isTrue(snapshot.Equal(snapshot2));
        assert.isTrue(snapshot2.Validated());
        snapshot2.Key = "";
        assert.isFalse(snapshot.Equal(snapshot2));
        assert.isFalse(snapshot2.Validated());
        snapshot2 = snapshot.Clone();
        snapshot2.Type = "";
        assert.isFalse(snapshot.Equal(snapshot2));
        assert.isTrue(snapshot2.Validated());
        snapshot2 = snapshot.Clone();
        snapshot2.Value = "";
        assert.isFalse(snapshot.Equal(snapshot2));
        assert.isTrue(snapshot2.Validated());
        snapshot2 = snapshot.Clone();
        snapshot2.Group = "";
        assert.isFalse(snapshot.Equal(snapshot2));
        assert.isTrue(snapshot2.Validated());
        snapshot2 = Snapshot.Create("key1", "type1", "value1", "group1");
        assert.isTrue(snapshot2.Validated());
        assert.equal("key1", snapshot2.Key);
        assert.equal("type1", snapshot2.Type);
        assert.equal("value1", snapshot2.Value);
        assert.equal("group1", snapshot2.Group);
        assert.isTrue(snapshot2.Timestamp > 0);

        snapshot2 = new Snapshot()
        snapshot2.Timestamp = 123456789

        assert.equal(1, snapshot2.Count);
        snapshot2.Repeat();
        assert.equal(2, snapshot2.Count);
    })

    it("TestMap", () => {

        var map = new Map()
        assert.equal(MapEncoding.Default, map.Encoding);
        map = Map.Create("name", "desc");
        assert.equal("name", map.Info.Name);
        assert.equal("desc", map.Info.Desc);
    })

    it("TestMapInfo", () => {

        var mapInfo = new MapInfo()
        mapInfo.UpdatedTime = -1
        assert.isFalse(mapInfo.Validated());
        mapInfo = new MapInfo()
        mapInfo.Name = "name"
        mapInfo.UpdatedTime = 0
        mapInfo.Desc = "desc"

        assert.isTrue(mapInfo.Validated());
        assert.equal("name", mapInfo.Name);
        assert.equal(0, mapInfo.UpdatedTime);
        assert.equal("desc", mapInfo.Desc);
        mapInfo = MapInfo.Create("name", "desc");
        assert.equal("name", mapInfo.Name);
        assert.isTrue(mapInfo.UpdatedTime > 0);
        assert.equal("desc", mapInfo.Desc);
        mapInfo = MapInfo.Create("", "");
        assert.equal("", mapInfo.Name);
        assert.isTrue(mapInfo.UpdatedTime > 0);
        assert.equal("", mapInfo.Desc);
        mapInfo = MapInfo.Create("name", "Desc");
        let mapInfo2: MapInfo;
        mapInfo2 = mapInfo.Clone();
        assert.isTrue(mapInfo.Equal(mapInfo2));
        assert.isTrue(mapInfo2.Validated());
        mapInfo2 = mapInfo.Clone();
        mapInfo2.Name = "";
        assert.isFalse(mapInfo.Equal(mapInfo2));
        assert.isTrue(mapInfo2.Validated());
        mapInfo2 = mapInfo.Clone();
        mapInfo2.UpdatedTime = -1;
        assert.isFalse(mapInfo.Equal(mapInfo2));
        assert.isFalse(mapInfo2.Validated());
        mapInfo2 = mapInfo.Clone();
        mapInfo2.Desc = "";
        assert.isFalse(mapInfo.Equal(mapInfo2));
        assert.isTrue(mapInfo2.Validated());
    })

    it("TestMapFile", () => {
        var mf = new MapFile();
        let settings: MapSettings;
        assert.isTrue(mf.Modified);
        assert.equal("", mf.Path);
        assert.equal(MapEncoding.Default, mf.Map.Encoding);
        assert.equal("", mf.Map.Info.Name);
        assert.equal("", mf.Map.Info.Desc);
        settings = mf.ToSettings();
        assert.equal(MapEncoding.Default, settings.Encoding);
        assert.equal("", settings.Name);
        assert.equal("", settings.Desc);
        mf = MapFile.Create("name", "desc");
        assert.isTrue(mf.Modified);
        assert.equal("", mf.Path);
        assert.equal("name", mf.Map.Info.Name);
        assert.equal("desc", mf.Map.Info.Desc);
        settings = mf.ToSettings();
        assert.equal(MapEncoding.Default, settings.Encoding);
        assert.equal("name", settings.Name);
        assert.equal("desc", settings.Desc);
        mf.Map.Encoding = MapEncoding.GB18030;
        settings = mf.ToSettings();
        assert.equal(MapEncoding.GB18030, settings.Encoding);
        assert.equal("name", settings.Name);
        assert.equal("desc", settings.Desc);
        assert.isEmpty(mf.Records.Rooms);
        assert.isEmpty(mf.Records.Markers);
        assert.isEmpty(mf.Records.Routes);
        assert.isEmpty(mf.Records.Traces);
        assert.isEmpty(mf.Records.Regions);
        assert.isEmpty(mf.Records.Landmarks);
        assert.isEmpty(mf.Records.Shortcuts);
        assert.isEmpty(mf.Records.Variables);
        assert.isEmpty(mf.Records.Snapshots);

        mf.RemoveRoom("notfound");
        assert.isEmpty(mf.Records.Rooms);
        var room = new Room()
        room.Key = "key1"
        mf.InsertRoom(room);

        assert.equal(Object.keys(mf.Records.Rooms).length, 1);
        assert.equal(room, mf.Records.Rooms[room.Key]);
        var room2 = new Room()
        room2.Key = "key1"
        mf.InsertRoom(room2);
        assert.equal(Object.keys(mf.Records.Rooms).length, 1);
        assert.equal(room2, mf.Records.Rooms[room2.Key]);
        var room3 = new Room()
        room3.Key = "key2"
        mf.InsertRoom(room3);
        assert.equal(2, Object.keys(mf.Records.Rooms).length);
        assert.equal(room2, mf.Records.Rooms[room2.Key]);
        assert.equal(room3, mf.Records.Rooms[room3.Key]);
        mf.RemoveRoom("key1");
        assert.equal(Object.keys(mf.Records.Rooms).length, 1);
        assert.equal(room3, mf.Records.Rooms[room3.Key]);

        mf.RemoveMarker("notfound");
        assert.isEmpty(mf.Records.Markers);
        var marker = new Marker()
        marker.Key = "key1"
        mf.InsertMarker(marker);
        assert.equal(Object.keys(mf.Records.Markers).length, 1);
        assert.equal(marker, mf.Records.Markers[marker.Key]);
        var marker2 = new Marker()
        marker2.Key = "key1"
        mf.InsertMarker(marker2);
        assert.equal(Object.keys(mf.Records.Markers).length, 1);

        assert.equal(marker2, mf.Records.Markers[marker2.Key]);
        var marker3 = new Marker()
        marker3.Key = "key2"
        mf.InsertMarker(marker3);
        assert.equal(2, Object.keys(mf.Records.Markers).length);
        assert.equal(marker2, mf.Records.Markers[marker2.Key]);
        assert.equal(marker3, mf.Records.Markers[marker3.Key]);
        mf.RemoveMarker("key1");
        assert.equal(1, Object.keys(mf.Records.Markers).length);
        assert.equal(marker3, mf.Records.Markers[marker3.Key]);

        mf.RemoveRoute("notfound");
        assert.isEmpty(mf.Records.Routes);
        var route = new Route()
        route.Key = "key1"
        mf.InsertRoute(route);
        assert.equal(1, Object.keys(mf.Records.Routes).length);

        assert.equal(route, mf.Records.Routes[route.Key]);
        var route2 = new Route()
        route2.Key = "key1"

        mf.InsertRoute(route2);
        assert.equal(1, Object.keys(mf.Records.Routes).length);
        assert.equal(route2, mf.Records.Routes[route2.Key]);
        var route3 = new Route()
        route3.Key = "key2"
        mf.InsertRoute(route3);
        assert.equal(2, Object.keys(mf.Records.Routes).length);
        assert.equal(route2, mf.Records.Routes[route2.Key]);
        assert.equal(route3, mf.Records.Routes[route3.Key]);
        mf.RemoveRoute("key1");
        assert.equal(1, Object.keys(mf.Records.Routes).length);
        assert.equal(route3, mf.Records.Routes[route3.Key]);

        mf.RemoveTrace("notfound");
        assert.isEmpty(mf.Records.Traces);
        var trace = new Trace()
        trace.Key = "key1"

        mf.InsertTrace(trace);
        assert.equal(1, Object.keys(mf.Records.Traces).length);

        assert.equal(trace, mf.Records.Traces[trace.Key]);
        var trace2 = new Trace()
        trace2.Key = "key1"
        mf.InsertTrace(trace2);
        assert.equal(1, Object.keys(mf.Records.Traces).length);

        assert.equal(trace2, mf.Records.Traces[trace2.Key]);
        var trace3 = new Trace()
        trace3.Key = "key2"

        mf.InsertTrace(trace3);

        assert.equal(2, Object.keys(mf.Records.Traces).length);
        assert.equal(trace2, mf.Records.Traces[trace2.Key]);
        assert.equal(trace3, mf.Records.Traces[trace3.Key]);
        mf.RemoveTrace("key1");
        assert.equal(1, Object.keys(mf.Records.Traces).length);

        assert.equal(trace3, mf.Records.Traces[trace3.Key]);

        mf.RemoveRegion("notfound");
        assert.isEmpty(mf.Records.Regions);
        var region = new Region()
        region.Key = "key1"
        mf.InsertRegion(region);
        assert.equal(1, Object.keys(mf.Records.Regions).length);

        assert.equal(region, mf.Records.Regions[region.Key]);
        var region2 = new Region()
        region2.Key = "key1"
        mf.InsertRegion(region2);

        assert.equal(1, Object.keys(mf.Records.Regions).length);
        assert.equal(region2, mf.Records.Regions[region2.Key]);
        var region3 = new Region()
        region3.Key = "key2"
        mf.InsertRegion(region3);

        assert.equal(2, Object.keys(mf.Records.Regions).length);
        assert.equal(region2, mf.Records.Regions[region2.Key]);
        assert.equal(region3, mf.Records.Regions[region3.Key]);
        mf.RemoveRegion("key1");
        assert.equal(1, Object.keys(mf.Records.Regions).length);

        assert.equal(region3, mf.Records.Regions[region3.Key]);
        mf.RemoveLandmark(new LandmarkKey("notfound", ""));
        assert.isEmpty(mf.Records.Landmarks);
        var landmark = new Landmark()
        landmark.Key = "key1"
        mf.InsertLandmark(landmark);
        assert.equal(1, Object.keys(mf.Records.Landmarks).length);
        assert.equal(landmark, mf.Records.Landmarks[landmark.UniqueKey().ToString()]);
        var landmark2 = new Landmark()
        landmark2.Key = "key1"
        mf.InsertLandmark(landmark2);
        assert.equal(1, Object.keys(mf.Records.Landmarks).length);
        assert.equal(landmark2, mf.Records.Landmarks[landmark2.UniqueKey().ToString()]);
        var landmark3 = new Landmark()
        landmark3.Key = "key2"
        mf.InsertLandmark(landmark3);
        assert.equal(2, Object.keys(mf.Records.Landmarks).length);
        assert.equal(landmark2, mf.Records.Landmarks[landmark2.UniqueKey().ToString()]);
        assert.equal(landmark3, mf.Records.Landmarks[landmark3.UniqueKey().ToString()]);
        mf.RemoveLandmark(new LandmarkKey("key1", ""));
        assert.equal(1, Object.keys(mf.Records.Landmarks).length);
        assert.equal(landmark3, mf.Records.Landmarks[landmark3.UniqueKey().ToString()]);

        mf.RemoveShortcut("notfound");
        assert.isEmpty(mf.Records.Shortcuts);
        var shortcut = new Shortcut()
        shortcut.Key = "key1"
        mf.InsertShortcut(shortcut);
        assert.equal(1, Object.keys(mf.Records.Shortcuts).length);

        assert.equal(shortcut, mf.Records.Shortcuts[shortcut.Key]);
        var shortcut2 = new Shortcut()

        shortcut2.Key = "key1"
        mf.InsertShortcut(shortcut2);
        assert.equal(1, Object.keys(mf.Records.Shortcuts).length);
        assert.equal(shortcut2, mf.Records.Shortcuts[shortcut2.Key]);
        var shortcut3 = new Shortcut()
        shortcut3.Key = "key2"
        mf.InsertShortcut(shortcut3);
        assert.equal(2, Object.keys(mf.Records.Shortcuts).length);
        assert.equal(shortcut2, mf.Records.Shortcuts[shortcut2.Key]);
        assert.equal(shortcut3, mf.Records.Shortcuts[shortcut3.Key]);
        mf.RemoveShortcut("key1");
        assert.equal(1, Object.keys(mf.Records.Shortcuts).length);
        assert.equal(shortcut3, mf.Records.Shortcuts[shortcut3.Key]);
        mf.RemoveVariable("notfound");
        assert.isEmpty(mf.Records.Variables);
        var variable = new Variable()
        variable.Key = "key1"
        mf.InsertVariable(variable);
        assert.equal(1, Object.keys(mf.Records.Variables).length);
        assert.equal(variable, mf.Records.Variables[variable.Key]);
        var variable2 = new Variable()
        variable2.Key = "key1"
        mf.InsertVariable(variable2);
        assert.equal(1, Object.keys(mf.Records.Variables).length);
        assert.equal(variable2, mf.Records.Variables[variable2.Key]);
        var variable3 = new Variable()
        variable3.Key = "key2"
        mf.InsertVariable(variable3);
        assert.equal(2, Object.keys(mf.Records.Variables).length);
        assert.equal(variable2, mf.Records.Variables[variable2.Key]);
        assert.equal(variable3, mf.Records.Variables[variable3.Key]);
        mf.RemoveVariable("key1");
        assert.equal(1, Object.keys(mf.Records.Variables).length);
        assert.equal(variable3, mf.Records.Variables[variable3.Key]);
        mf.RemoveSnapshot(new SnapshotKey("notfound", "", ""));
        assert.isEmpty(mf.Records.Snapshots);
        var snapshot = new Snapshot()
        snapshot.Key = "key1"
        mf.InsertSnapshot(snapshot);
        assert.equal(1, mf.Records.Snapshots.length);

        assert.equal(snapshot, mf.Records.Snapshots[0]);
        var snapshot2 = new Snapshot()
        snapshot2.Key = "key1"

        mf.InsertSnapshot(snapshot2);
        assert.equal(1, mf.Records.Snapshots.length);
        assert.equal(snapshot2, mf.Records.Snapshots[0]);
        var snapshot3 = new Snapshot()
        snapshot3.Key = "key2"

        mf.InsertSnapshot(snapshot3);
        assert.equal(2, mf.Records.Snapshots.length);
        assert.equal(snapshot2, mf.Records.Snapshots[0]);
        assert.equal(snapshot3, mf.Records.Snapshots[1]);
        mf.RemoveSnapshot(new SnapshotKey("key1", "", ""));
        assert.equal(1, mf.Records.Snapshots.length);
        assert.equal(snapshot3, mf.Records.Snapshots[0]);
        mf = new MapFile();
        mf.TakeSnapshot("key3", "type3", "value3", "group3");
        assert.equal(1, mf.Records.Snapshots.length);
        assert.equal(1, mf.Records.Snapshots[0].Count);
        mf.TakeSnapshot("key3", "type3", "value3", "group2");
        assert.equal(1, mf.Records.Snapshots.length);
        assert.equal(2, mf.Records.Snapshots[0].Count);

        mf = new MapFile();
        mf.Modified = false;
        assert.isFalse(mf.Modified);
        assert.equal(0, mf.Map.Info.UpdatedTime);
        mf.MarkAsModified();
        assert.isTrue(mf.Modified);
        assert.notEqual(0, mf.Map.Info.UpdatedTime);
        mf = new MapFile();
        mf.Path = "/mypath";
        mf.Map.Info.Name = "myname";
    })

    it("TestItemKey", () => {

        assert.isTrue(ItemKey.Validate("ab"));
        assert.isFalse(ItemKey.Validate(""));
        assert.isFalse(ItemKey.Validate("a\nb"));
        var room = new Room()
        room.Key = "ab"
        assert.isTrue(room.Validated());
        room.Key = "";
        assert.isFalse(room.Validated());
        room.Key = "a\nb";
        assert.isFalse(room.Validated());
        var marker = new Marker()
        marker.Key = "ab"
        marker.Value = "value"

        assert.isTrue(marker.Validated());
        marker.Key = "";
        assert.isFalse(marker.Validated());
        marker.Key = "a\nb";
        assert.isFalse(marker.Validated());
        var route = new Route()
        route.Key = "ab"
        route.Rooms = ["room1", "room2"]
        assert.isTrue(route.Validated());
        route.Key = "";
        assert.isFalse(route.Validated());
        route.Key = "a\nb";
        assert.isFalse(route.Validated());
        var trace = new Trace()

        trace.Key = "ab"
        trace.Locations = ["room1", "room2"]
        assert.isTrue(trace.Validated());
        trace.Key = "";
        assert.isFalse(trace.Validated());
        trace.Key = "a\nb";
        assert.isFalse(trace.Validated());
        var region = new Region()
        region.Key = "ab"
        region.Items = [new RegionItem(RegionItemType.Room, "room1", false), new RegionItem(RegionItemType.Zone, "zone1", true)]
        assert.isTrue(region.Validated());
        region.Key = "";
        assert.isFalse(region.Validated());
        region.Key = "a\nb";
        assert.isFalse(region.Validated());
        var landmark = new Landmark()

        landmark.Key = "ab"
        landmark.Type = "type1"
        landmark.Value = "value1"

        assert.isTrue(landmark.Validated());
        landmark.Key = "";
        assert.isFalse(landmark.Validated());
        landmark.Key = "a\nb";
        assert.isFalse(landmark.Validated());
        var shortcut = new Shortcut()

        shortcut.Key = "ab"
        shortcut.Command = "command1"
        shortcut.To = "to1"
        assert.isTrue(shortcut.Validated());
        shortcut.Key = "";
        assert.isFalse(shortcut.Validated());
        shortcut.Key = "a\nb";
        assert.isFalse(shortcut.Validated());
        var variable = new Variable()

        variable.Key = "ab"
        variable.Value = "value1"
        assert.isTrue(variable.Validated());
        variable.Key = "";
        assert.isFalse(variable.Validated());
        variable.Key = "a\nb";
        assert.isFalse(variable.Validated());
        var snapshot = new Snapshot()
        snapshot.Key = "ab"
        snapshot.Timestamp = 123456
        assert.isTrue(snapshot.Validated());
        snapshot.Key = "";
        assert.isFalse(snapshot.Validated());
        snapshot.Key = "a\nb";
        assert.isFalse(snapshot.Validated());
    })

    it("TestContext", () => {

        var ctx = new Context();
        assert.isEmpty(ctx.Tags);
        assert.equal(ctx, ctx.WithTags([new ValueTag("tag1", 1), new ValueTag("tag2", 2)]));
        assert.equal(2, Object.keys(ctx.Tags).length);
        assert.equal(1, ctx.Tags["tag1"]);
        assert.equal(2, ctx.Tags["tag2"]);
        assert.isEmpty(ctx.RoomConditions);
        assert.equal(ctx, ctx.WithRoomConditions([new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, true)]));
        assert.equal(2, ctx.RoomConditions.length);
        assert.equal("con1", ctx.RoomConditions[0].Key);
        assert.equal(0, ctx.RoomConditions[0].Value);
        assert.isFalse(ctx.RoomConditions[0].Not);
        assert.equal("con2", ctx.RoomConditions[1].Key);
        assert.isEmpty(ctx.Rooms);
        let r1 = new Room()
        r1.Key = "room1"
        let r2 = new Room()
        r2.Key = "room2"
        assert.equal(ctx, ctx.WithRooms([r1, r2]));
        assert.equal(2, Object.keys(ctx.Rooms).length);
        assert.equal("room1", ctx.Rooms["room1"].Key);
        assert.equal("room2", ctx.Rooms["room2"].Key);
        assert.isEmpty(ctx.Whitelist);
        assert.equal(ctx, ctx.WithWhitelist(["room1", "room2"]));
        assert.equal(2, Object.keys(ctx.Whitelist).length);
        assert.isTrue(ctx.Whitelist["room1"]);
        assert.isTrue(ctx.Whitelist["room2"]);
        assert.isEmpty(ctx.Blacklist);
        assert.equal(ctx, ctx.WithBlacklist(["room3", "room4"]));
        assert.equal(2, Object.keys(ctx.Blacklist).length);
        assert.isTrue(ctx.Blacklist["room3"]);
        assert.isTrue(ctx.Blacklist["room4"]);
        assert.isEmpty(ctx.Shortcuts);
        let rce1 = new RoomConditionExit()
        rce1.Command = "cmd1"
        rce1.To = "to1"
        let rce2 = new RoomConditionExit()
        rce2.Command = "cmd2"
        rce2.To = "to2"
        assert.equal(ctx, ctx.WithShortcuts([
            rce1,
            rce2,
        ]));
        assert.equal(2, ctx.Shortcuts.length);
        assert.equal("to1", ctx.Shortcuts[0].To);
        assert.equal("cmd1", ctx.Shortcuts[0].Command);
        assert.equal("to2", ctx.Shortcuts[1].To);
        assert.equal("cmd2", ctx.Shortcuts[1].Command);
        assert.isEmpty(ctx.Paths);
        let path1 = new Path()
        path1.To = "to1"
        path1.From = "from1"
        path1.Command = "cmd1"
        let path2 = new Path()
        path2.To = "to2"
        path2.From = "from2"
        path2.Command = "cmd2"
        let path3 = new Path()
        path3.To = "to3"
        path3.From = "from1"
        path3.Command = "cmd3"
        assert.equal(ctx, ctx.WithPaths([
            path1,
            path2,
            path3,
        ]));
        assert.equal(2, Object.keys(ctx.Paths).length);
        assert.equal("to1", ctx.Paths["from1"][0].To);
        assert.equal("cmd1", ctx.Paths["from1"][0].Command);
        assert.equal("to3", ctx.Paths["from1"][1].To);
        assert.equal("cmd3", ctx.Paths["from1"][1].Command);
        assert.equal("to2", ctx.Paths["from2"][0].To);
        assert.equal("cmd2", ctx.Paths["from2"][0].Command);
        assert.isEmpty(ctx.BlockedLinks);
        assert.equal(ctx, ctx.WithBlockedLinks([
            new Link("from1", "to1"),
            new Link("from2", "to2"),
            new Link("from1", "to3"),
        ]));
        assert.equal(2, Object.keys(ctx.BlockedLinks).length);
        assert.isTrue(ctx.BlockedLinks["from1"]["to1"]);
        assert.isTrue(ctx.BlockedLinks["from1"]["to3"]);
        assert.isTrue(ctx.BlockedLinks["from2"]["to2"]);
        assert.isTrue(ctx.IsBlocked("from1", "to1"));
        assert.isTrue(ctx.IsBlocked("from2", "to2"));
        assert.isTrue(ctx.IsBlocked("from1", "to3"));
        assert.isFalse(ctx.IsBlocked("notexist1", "notexist2"));
        assert.isFalse(ctx.IsBlocked("from1", "notexist2"));
        assert.isFalse(ctx.IsBlocked("from1", "notexist2"));
        assert.isFalse(ctx.IsBlocked("notexist1", "to1"));
        assert.isFalse(ctx.IsBlocked("notexist1", "to2"));
        assert.isFalse(ctx.IsBlocked("notexist1", "to3"));

        assert.isEmpty(ctx.CommandCosts);
        assert.equal(ctx, ctx.WithCommandCosts([
            new CommandCost("cmd1", "to1", 1),
            new CommandCost("cmd2", "to1", 2),
            new CommandCost("cmd1", "to3", 3),
        ]));
        assert.equal(2, Object.keys(ctx.CommandCosts).length);
        assert.equal(1, ctx.CommandCosts["cmd1"]["to1"]);
        assert.equal(2, ctx.CommandCosts["cmd2"]["to1"]);
        assert.equal(3, ctx.CommandCosts["cmd1"]["to3"]);
        assert.equal(ctx, ctx.ClearTags());
        assert.isEmpty(ctx.Tags);
        assert.equal(ctx, ctx.ClearRoomConditions());
        assert.isEmpty(ctx.RoomConditions);
        assert.equal(ctx, ctx.ClearRooms());
        assert.isEmpty(ctx.Rooms);
        assert.equal(ctx, ctx.ClearWhitelist());
        assert.isEmpty(ctx.Whitelist);
        assert.equal(ctx, ctx.ClearBlacklist());
        assert.isEmpty(ctx.Blacklist);
        assert.equal(ctx, ctx.ClearShortcuts());
        assert.isEmpty(ctx.Shortcuts);
        assert.equal(ctx, ctx.ClearPaths());
        assert.isEmpty(ctx.Paths);
        assert.equal(ctx, ctx.ClearBlockedLinks());
        assert.isEmpty(ctx.BlockedLinks);
        assert.equal(ctx, ctx.ClearCommandCosts());
        assert.isEmpty(ctx.CommandCosts);
    })

    it("TestEnvironment", () => {
        var env = new Environment()

        env.Tags = [new ValueTag("tag1", 1), new ValueTag("tag2", 2)]
        env.RoomConditions = [new ValueCondition("con1", 0, false), new ValueCondition("con2", 0, true)]
        let r1 = new Room()
        r1.Key = "room1"
        let r2 = new Room()
        r2.Key = "room2"
        env.Rooms = [r1, r2]
        env.Whitelist = ["room1", "room2"]
        env.Blacklist = ["room3", "room4"]
        let rce1 = new RoomConditionExit()
        rce1.Command = "cmd1"
        rce1.To = "to1"
        let rce2 = new RoomConditionExit()
        rce2.Command = "cmd2"
        rce2.To = "to2"
        env.Shortcuts = [rce1, rce2]
        let path1 = new Path();
        path1.To = "to1"
        path1.From = "from1"
        path1.Command = "cmd1"
        let path2 = new Path();
        path2.To = "to2"
        path2.From = "from2"
        path2.Command = "cmd2"
        let path3 = new Path();
        path3.To = "to3"
        path3.From = "from1"
        path3.Command = "cmd3"
        env.Paths = [
            path1,
            path2,
            path3
        ]
        env.BlockedLinks = [new Link("from1", "to1"), new Link("from2", "to2"), new Link("from1", "to3")]
        env.CommandCosts = [new CommandCost("cmd1", "to1", 1), new CommandCost("cmd2", "to1", 2), new CommandCost("cmd1", "to3", 3)]

        var ctx = Context.FromEnvironment(env);
        assert.equal(2, Object.keys(ctx.Tags).length);
        assert.equal(1, ctx.Tags["tag1"]);
        assert.equal(2, ctx.Tags["tag2"]);
        assert.equal(2, ctx.RoomConditions.length);
        assert.equal("con1", ctx.RoomConditions[0].Key);
        assert.equal(0, ctx.RoomConditions[0].Value);
        assert.isFalse(ctx.RoomConditions[0].Not);
        assert.equal("con2", ctx.RoomConditions[1].Key);
        assert.equal(2, Object.keys(ctx.Rooms).length);
        assert.equal("room1", ctx.Rooms["room1"].Key);
        assert.equal("room2", ctx.Rooms["room2"].Key);
        assert.equal(2, Object.keys(ctx.Whitelist).length);
        assert.isTrue(ctx.Whitelist["room1"]);
        assert.isTrue(ctx.Whitelist["room2"]);
        assert.equal(2, Object.keys(ctx.Blacklist).length);
        assert.isTrue(ctx.Blacklist["room3"]);
        assert.isTrue(ctx.Blacklist["room4"]);
        assert.equal(2, ctx.Shortcuts.length);
        assert.equal("to1", ctx.Shortcuts[0].To);
        assert.equal("cmd1", ctx.Shortcuts[0].Command);
        assert.equal("to2", ctx.Shortcuts[1].To);
        assert.equal("cmd2", ctx.Shortcuts[1].Command);
        assert.equal(2, Object.keys(ctx.Paths).length);
        assert.equal("to1", ctx.Paths["from1"][0].To);
        assert.equal("cmd1", ctx.Paths["from1"][0].Command);
        assert.equal("to3", ctx.Paths["from1"][1].To);
        assert.equal("cmd3", ctx.Paths["from1"][1].Command);
        assert.equal("to2", ctx.Paths["from2"][0].To);
        assert.equal("cmd2", ctx.Paths["from2"][0].Command);
        assert.equal(2, Object.keys(ctx.BlockedLinks).length);
        assert.isTrue(ctx.BlockedLinks["from1"]["to1"]);
        assert.isTrue(ctx.BlockedLinks["from1"]["to3"]);
        assert.isTrue(ctx.BlockedLinks["from2"]["to2"]);
        assert.equal(2, Object.keys(ctx.CommandCosts).length);
        assert.equal(1, ctx.CommandCosts["cmd1"]["to1"]);
        assert.equal(2, ctx.CommandCosts["cmd2"]["to1"]);
        assert.equal(3, ctx.CommandCosts["cmd1"]["to3"]);
        var env2 = ctx.ToEnvironment();
        assert.equal(env.Tags.length, env2.Tags.length);
        env.Tags.sort((a, b) => a.Key < b.Key ? -1 : 1);
        env2.Tags.sort((a, b) => a.Key < b.Key ? -1 : 1);
        for (var i = 0; i < env.Tags.length; i++) {
            assert.equal(env.Tags[i].Key, env2.Tags[i].Key);
            assert.equal(env.Tags[i].Value, env2.Tags[i].Value);
        }
        assert.equal(env.RoomConditions.length, env2.RoomConditions.length);
        env.RoomConditions.sort((a, b) => a.Key < b.Key ? -1 : 1);
        env2.RoomConditions.sort((a, b) => a.Key < b.Key ? -1 : 1);
        for (var i = 0; i < env.RoomConditions.length; i++) {
            assert.equal(env.RoomConditions[i].Key, env2.RoomConditions[i].Key);
            assert.equal(env.RoomConditions[i].Value, env2.RoomConditions[i].Value);
            assert.equal(env.RoomConditions[i].Not, env2.RoomConditions[i].Not);
        }
        assert.equal(env.Rooms.length, env2.Rooms.length);
        env.Rooms.sort((a, b) => a.Key < b.Key ? -1 : 1);
        env2.Rooms.sort((a, b) => a.Key < b.Key ? -1 : 1);
        for (var i = 0; i < env.Rooms.length; i++) {
            assert.equal(env.Rooms[i].Key, env2.Rooms[i].Key);
        }
        assert.equal(env.Whitelist.length, env2.Whitelist.length);
        env.Whitelist.sort();
        env2.Whitelist.sort();
        for (var i = 0; i < env.Whitelist.length; i++) {
            assert.equal(env.Whitelist[i], env2.Whitelist[i]);
        }
        assert.equal(env.Blacklist.length, env2.Blacklist.length);
        env.Blacklist.sort();
        env2.Blacklist.sort();
        for (var i = 0; i < env.Blacklist.length; i++) {
            assert.equal(env.Blacklist[i], env2.Blacklist[i]);
        }
        assert.equal(env.Shortcuts.length, env2.Shortcuts.length);
        env.Shortcuts.sort((a, b) => a.To < b.To ? -1 : 1);
        env2.Shortcuts.sort((a, b) => a.To < b.To ? -1 : 1);
        for (var i = 0; i < env.Shortcuts.length; i++) {
            assert.equal(env.Shortcuts[i].Command, env2.Shortcuts[i].Command);
            assert.equal(env.Shortcuts[i].To, env2.Shortcuts[i].To);
        }
        assert.equal(env.Paths.length, env2.Paths.length);
        env.Paths.sort((a, b) => a.To < b.To ? -1 : 1);
        env2.Paths.sort((a, b) => a.To < b.To ? -1 : 1);
        for (var i = 0; i < env.Paths.length; i++) {
            assert.equal(env.Paths[i].To, env2.Paths[i].To);
            assert.equal(env.Paths[i].From, env2.Paths[i].From);
            assert.equal(env.Paths[i].Command, env2.Paths[i].Command);
        }
        assert.equal(env.BlockedLinks.length, env2.BlockedLinks.length);
        env.BlockedLinks.sort((a, b) => a.From < b.From ? -1 : 1);
        env2.BlockedLinks.sort((a, b) => a.From < b.From ? -1 : 1);
        for (var i = 0; i < env.BlockedLinks.length; i++) {
            assert.equal(env.BlockedLinks[i].From, env2.BlockedLinks[i].From);
            assert.equal(env.BlockedLinks[i].To, env2.BlockedLinks[i].To);
        }
        assert.equal(env.CommandCosts.length, env2.CommandCosts.length);
        env.CommandCosts.sort((a, b) => a.To < b.To ? -1 : 1);
        env2.CommandCosts.sort((a, b) => a.To < b.To ? -1 : 1);
        for (var i = 0; i < env.CommandCosts.length; i++) {
            assert.equal(env.CommandCosts[i].Command, env2.CommandCosts[i].Command);
            assert.equal(env.CommandCosts[i].To, env2.CommandCosts[i].To);
            assert.equal(env.CommandCosts[i].Cost, env2.CommandCosts[i].Cost);
        }
    })

    it("TestMapperOption", () => {
        var opt = new MapperOptions();
        assert.equal(0, opt.MaxExitCost);
        assert.equal(0, opt.MaxTotalCost);
        assert.isFalse(opt.DisableShortcuts);
        assert.equal(opt, opt.WithMaxExitCost(5));
        assert.equal(5, opt.MaxExitCost);
        assert.equal(opt, opt.WithMaxTotalCost(50));
        assert.equal(50, opt.MaxTotalCost);
        assert.equal(opt, opt.WithDisableShortcuts(true));
        assert.isTrue(opt.DisableShortcuts);
    })
    it("TestStep", () => {
        var step = new Step("cmd1", "to1", 5);
        assert.equal("cmd1", step.Command);
        assert.equal("to1", step.Target);
        assert.equal(5, step.Cost);
        var result = new QueryResult();
        assert.equal(0, result.Cost);
        assert.equal("", result.From);
        assert.equal("", result.To);
        assert.isEmpty(result.Steps);
        assert.isEmpty(result.Unvisited);
        assert.isFalse(result.IsSuccess());
        assert.isNull(result.SuccessOrNull());
        result.To = "to1";
        assert.isFalse(result.IsSuccess());
        assert.isNull(result.SuccessOrNull());
        result.To = "";
        result.From = "from1";
        assert.isFalse(result.IsSuccess());
        assert.isNull(result.SuccessOrNull());
        result.To = "to1";
        result.From = "from1";
        assert.isTrue(result.IsSuccess());
        assert.isNotNull(result.SuccessOrNull());
        var result2 = QueryResult.Fail;
        assert.isFalse(result2.IsSuccess());
        assert.isNull(result2.SuccessOrNull());

        assert.equal("", Step.JoinCommands(";", []));
        assert.equal("cmd1;cmd2", Step.JoinCommands(";", [new Step("cmd1", "to1", 5), new Step("cmd2", "to2", 10)]));
    })

    it("TestContextTags", () => {
        var ctx = new Context();
        ctx.WithTags([
            new ValueTag("tag1", 1),
            new ValueTag("tag2", 2),
        ]);
        assert.isTrue(ctx.HasTag("tag1", 1));
        assert.isFalse(ctx.HasTag("tag1", 2));
        assert.isTrue(ctx.HasTag("tag2", 2));
        assert.isFalse(ctx.HasTag("tag2", 3));
        assert.isFalse(ctx.HasTag("tag3", 1));
        assert.isTrue(ctx.HasTag("tag3", 0));
        assert.isTrue(ctx.ValidateConditions([new ValueCondition("tag1", 1, false), new ValueCondition("tag2", 2, false)]));
        assert.isTrue(ctx.ValidateConditions([new ValueCondition("tag1", 1, false), new ValueCondition("tag3", 1, true)]));
        assert.isFalse(ctx.ValidateConditions([new ValueCondition("tag1", 1, false), new ValueCondition("tag3", 1, false)]));
        assert.isTrue(ctx.ValidateConditions([new ValueCondition("tag3", 0, false)]));
    })

    it("TestSnapshotFilter", () => {

        var snapshot = new Snapshot()
        snapshot.Key = "key1"
        snapshot.Type = "type1"
        snapshot.Value = "value1"
        snapshot.Group = "group1"
        snapshot.Count = 10
        snapshot.Timestamp = 1234567890
        var sf = new SnapshotFilter("key1", "type1", "group1");
        assert.equal("key1", sf.Key);
        assert.equal("type1", sf.Type);
        assert.equal("group1", sf.Group);
        assert.isTrue(new SnapshotFilter(null, null, null).Validate(snapshot));
        assert.isTrue(new SnapshotFilter("key1", null, null).Validate(snapshot));
        assert.isTrue(new SnapshotFilter("key1", "type1", null).Validate(snapshot));
        assert.isTrue(new SnapshotFilter("key1", "type1", "group1").Validate(snapshot));
        assert.isTrue(new SnapshotFilter(null, "type1", null).Validate(snapshot));
        assert.isTrue(new SnapshotFilter(null, "type1", "group1").Validate(snapshot));
        assert.isTrue(new SnapshotFilter(null, null, "group1").Validate(snapshot));
        assert.isFalse(new SnapshotFilter("keynotfound", null, null).Validate(snapshot));
        assert.isFalse(new SnapshotFilter(null, "typenotfound", null).Validate(snapshot));
        assert.isFalse(new SnapshotFilter(null, null, "groupnotfound").Validate(snapshot));
        assert.isFalse(new SnapshotFilter("keynotfound", "typenotfound", "groupnotfound").Validate(snapshot));
        assert.isTrue(new SnapshotFilter("key1", "type1", "group1").WithMaxCount(10).Validate(snapshot));
        assert.isFalse(new SnapshotFilter("key1", "type1", "group1").WithMaxCount(9).Validate(snapshot));
    })

    it("TestSnapshotSearch", () => {
        var snapshot = new Snapshot()
        snapshot.Key = "key1"
        snapshot.Type = "type1"
        snapshot.Value = "value1\nvalue2"
        snapshot.Group = "group1"
        snapshot.Timestamp = 1234567890
        var ss = new SnapshotSearch();
        assert.isNull(ss.Type);
        assert.isNull(ss.Group);
        assert.isEmpty(ss.Keywords);
        assert.isTrue(ss.PartialMatch);
        assert.isFalse(ss.Any);
        assert.isTrue(ss.Validate(snapshot));
        ss.Type = "type2";
        assert.isFalse(ss.Validate(snapshot));
        ss.Type = "type1";
        assert.isTrue(ss.Validate(snapshot));
        ss.Group = "group2";
        assert.isFalse(ss.Validate(snapshot));
        ss.Group = "group1";
        assert.isTrue(ss.Validate(snapshot));
        ss.Keywords = ["valuenotfound"];
        assert.isFalse(ss.Validate(snapshot));
        ss.Keywords = ["value1"];
        assert.isTrue(ss.Validate(snapshot));
        ss.Keywords = ["value1", "value3"];
        assert.isFalse(ss.Validate(snapshot));
        ss.Any = true;
        assert.isTrue(ss.Validate(snapshot));
        ss.PartialMatch = false;
        ss.Keywords = ["value1"];
        assert.isFalse(ss.Validate(snapshot));
        ss.Keywords = ["value1\nvalue2"];
        assert.isTrue(ss.Validate(snapshot));
    })

    it("TestSnapshotSearchResult", () => {
        var sr = new SnapshotSearchResult();
        assert.equal(0, sr.Count);
        assert.equal(0, sr.Sum);
        assert.equal("", sr.Key);
        assert.isEmpty(sr.Items);
        var snapshot = new Snapshot()
        snapshot.Key = "key1"
        snapshot.Type = "type1"
        snapshot.Value = "value1\nvalue2"
        snapshot.Group = "group1"
        snapshot.Timestamp = 1234567890
        snapshot.Count = 15
        var snapshot2 = new Snapshot()
        snapshot2.Key = "key1"
        snapshot2.Type = "type1"
        snapshot2.Value = "value1\nvalue2"
        snapshot2.Group = "group1"
        snapshot2.Timestamp = 1234567890
        snapshot2.Count = 30
        sr.Add(snapshot, true);
        assert.equal(15, sr.Count);
        assert.equal(15, sr.Sum);
        assert.equal("", sr.Key);
        assert.equal(1, sr.Items.length);
        assert.equal(snapshot, sr.Items[0]);
        sr.Add(snapshot2, false);
        assert.equal(15, sr.Count);
        assert.equal(45, sr.Sum);
        assert.equal("", sr.Key);
        assert.equal(1, sr.Items.length);
        assert.equal(snapshot, sr.Items[0]);
        assert.equal(snapshot, sr.Items[0]);
    })
})