import { assert } from "chai";
import { Path, RegionItem, RegionItemType, RoomFilter, SnapshotFilter, SnapshotSearch, Data, Snapshot, Landmark, Variable, Trace, Route, Marker, APIListOption, MapDatabase, Context, MapperOptions, Room, Exit, Shortcut, ValueTag, ValueCondition, Region } from '../src/index';


describe("APITest", () => {
    it("TestAPIVersion", () => {
        var mapDatabase = new MapDatabase();
        assert.equal(mapDatabase.APIVersion(), MapDatabase.Version);
    })
    it("TestAPIInfo", () => {
        var mapDatabase = new MapDatabase();
        var info = mapDatabase.APIInfo();
        assert.isNull(info);
        mapDatabase.NewMap();
        info = mapDatabase.APIInfo();
        assert.isNotNull(info);
        assert.equal("", info.Name);
        assert.equal("", info.Desc);
        mapDatabase.Current!.Map.Info.Name = "testname";
        mapDatabase.Current!.Map.Info.Desc = "testdesc";
        info = mapDatabase.APIInfo();
        assert.isNotNull(info);
        assert.equal("testname", info.Name);
        assert.equal("testdesc", info.Desc);
    })

    it("TestAPIListOption", () => {
        var opt = new APIListOption();
        var keys = opt.Keys();
        var groups = opt.Groups();
        assert.isTrue(opt.IsEmpty());
        assert.isEmpty(keys);
        assert.isEmpty(groups);
        assert.isTrue(opt.Validate("key", "group"));
        opt.WithKeys(["key1", "key2"]);
        keys = opt.Keys();
        keys.sort();
        assert.equal("key1 key2", keys.join(' '));
        assert.isFalse(opt.Validate("key", "group"));
        assert.isFalse(opt.IsEmpty());
        opt.WithKeys(["key"]);
        keys = opt.Keys();
        keys.sort();
        assert.equal("key key1 key2", keys.join(' '));
        assert.isTrue(opt.Validate("key", "group"));
        assert.isFalse(opt.IsEmpty());

        opt.WithGroups(["group1", "group2"]);
        groups = opt.Groups();
        groups.sort();
        assert.equal("group1 group2", groups.join(' '));
        assert.isFalse(opt.Validate("key", "group"));
        assert.isFalse(opt.IsEmpty());
        opt.WithGroups(["group"]);
        groups = opt.Groups();
        groups.sort();
        assert.equal("group group1 group2", groups.join(' '));
        assert.isTrue(opt.Validate("key", "group"));
        assert.isFalse(opt.IsEmpty());
    })
    it("TestRoomAPI", () => {
        var mapDatabase = new MapDatabase();
        let rooms: Room[] = [];
        var room1 = ((): Room => {
            let model = new Room();
            model.Key = "key1";
            model.Group = "group1";
            return model;
        })()
        var room2 = ((): Room => {
            let model = new Room();
            model.Key = "key2";
            model.Group = "";
            return model;
        })()
        var newroom2 = ((): Room => {
            let model = new Room();
            model.Key = "key2";
            model.Group = "group2";
            return model;
        })()
        var room3 = ((): Room => {
            let model = new Room();
            model.Key = "key3";
            model.Group = "group1";
            return model;
        })()
        var room4 = ((): Room => {
            let model = new Room();
            model.Key = "key4";
            model.Group = "group2";
            return model;
        })()
        var badroom = ((): Room => {
            let model = new Room();
            model.Key = "";
            model.Group = "group1";
            return model;
        })()
        var opt = new APIListOption();
        rooms = mapDatabase.APIListRooms(opt);
        assert.isEmpty(rooms);
        mapDatabase.APIInsertRooms([room1, room2, room3]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.isEmpty(rooms);
        mapDatabase.APIRemoveRooms(["key1"]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.isEmpty(rooms);
        mapDatabase.NewMap();
        mapDatabase.APIInsertRooms([room1, room2, room3]);
        opt = new APIListOption();
        rooms = mapDatabase.APIListRooms(opt);
        assert.equal(3, rooms.length);
        assert.equal(room2, rooms[0]);
        assert.equal(room1, rooms[1]);
        assert.equal(room3, rooms[2]);
        opt.Clear().WithGroups([""]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.equal(1, rooms.length);
        assert.equal(room2, rooms[0]);
        opt.Clear().WithGroups(["group1"]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.equal(2, rooms.length);
        assert.equal(room1, rooms[0]);
        assert.equal(room3, rooms[1]);
        opt.Clear().WithGroups(["notfound"]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.isEmpty(rooms);
        opt.Clear().WithKeys(["key2"]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.equal(1, rooms.length);
        assert.equal(room2, rooms[0]);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key2"]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.isEmpty(rooms);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key1"]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.equal(1, rooms.length);
        assert.equal(room1, rooms[0]);
        opt = new APIListOption();
        mapDatabase.APIInsertRooms([]);
        mapDatabase.APIInsertRooms([newroom2, room4]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.equal(4, rooms.length);
        assert.equal(room1, rooms[0]);
        assert.equal(room3, rooms[1]);
        assert.equal(newroom2, rooms[2]);
        assert.equal(room4, rooms[3]);
        assert.isFalse(badroom.Validated());
        mapDatabase.APIInsertRooms([badroom]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.equal(4, rooms.length);
        mapDatabase.APIRemoveRooms([]);
        mapDatabase.APIRemoveRooms(["key1"]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.equal(3, rooms.length);
        assert.equal(room3, rooms[0]);
        assert.equal(newroom2, rooms[1]);
        assert.equal(room4, rooms[2]);
        mapDatabase.APIRemoveRooms(["key1", "key2", "key4"]);
        rooms = mapDatabase.APIListRooms(opt);
        assert.equal(1, rooms.length);
        assert.equal(room3, rooms[0]);
    })
    it("TestMarkerAPI", () => {
        var mapDatabase = new MapDatabase();

        let markers: Marker[] = [];
        var marker1 = ((): Marker => {
            let model = new Marker();
            model.Key = "key1";
            model.Value = "value1";
            model.Group = "group1";
            return model;
        })()
        var marker2 = ((): Marker => {
            let model = new Marker();
            model.Key = "key2";
            model.Value = "value2";
            model.Group = "";
            return model;
        })()
        var newmarker2 = ((): Marker => {
            let model = new Marker();
            model.Key = "key2";
            model.Value = "value2";
            model.Group = "group2";
            return model;
        })()
        var marker3 = ((): Marker => {
            let model = new Marker();
            model.Key = "key3";
            model.Value = "value3";
            model.Group = "group1";
            return model;
        })()
        var marker4 = ((): Marker => {
            let model = new Marker();
            model.Key = "key4";
            model.Value = "value4";
            model.Group = "group2";
            return model;
        })()
        var badmarker = ((): Marker => {
            let model = new Marker();
            model.Key = "badkey";
            model.Value = "";
            model.Group = "group1";
            return model;
        })()
        var opt = new APIListOption();
        markers = mapDatabase.APIListMarkers(opt);
        assert.isEmpty(markers);
        mapDatabase.APIInsertMarkers([marker1, marker2, marker3]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.isEmpty(markers);
        mapDatabase.APIRemoveMarkers(["key1"]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.isEmpty(markers);
        mapDatabase.NewMap();
        mapDatabase.APIInsertMarkers([marker1, marker2, marker3]);
        opt = new APIListOption();
        markers = mapDatabase.APIListMarkers(opt);
        assert.equal(3, markers.length);
        assert.equal(marker2, markers[0]);
        assert.equal(marker1, markers[1]);
        assert.equal(marker3, markers[2]);
        opt.Clear().WithGroups([""]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.equal(1, markers.length);
        assert.equal(marker2, markers[0]);
        opt.Clear().WithGroups(["group1"]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.equal(2, markers.length);
        assert.equal(marker1, markers[0]);
        assert.equal(marker3, markers[1]);
        opt.Clear().WithGroups(["notfound"]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.isEmpty(markers);
        opt.Clear().WithKeys(["key2"]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.equal(1, markers.length);
        assert.equal(marker2, markers[0]);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key2"]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.isEmpty(markers);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key1"]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.equal(1, markers.length);
        assert.equal(marker1, markers[0]);

        opt = new APIListOption();
        mapDatabase.APIInsertMarkers([]);

        mapDatabase.APIInsertMarkers([newmarker2, marker4]);

        markers = mapDatabase.APIListMarkers(opt);
        assert.equal(4, markers.length);
        assert.equal(marker1, markers[0]);
        assert.equal(marker3, markers[1]);
        assert.equal(newmarker2, markers[2]);
        assert.equal(marker4, markers[3]);
        assert.isFalse(badmarker.Validated());
        mapDatabase.APIInsertMarkers([badmarker]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.equal(4, markers.length);
        mapDatabase.APIRemoveMarkers([]);
        mapDatabase.APIRemoveMarkers(["key1"]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.equal(3, markers.length);
        assert.equal(marker3, markers[0]);
        assert.equal(newmarker2, markers[1]);
        assert.equal(marker4, markers[2]);
        mapDatabase.APIRemoveMarkers(["key1", "key2", "key4"]);
        markers = mapDatabase.APIListMarkers(opt);
        assert.equal(1, markers.length);
        assert.equal(marker3, markers[0]);
    })
    it("TestRouteAPI", () => {
        var mapDatabase = new MapDatabase();
        let routes: Route[] = [];
        var route1 = ((): Route => {
            let model = new Route();
            model.Key = "key1"
            model.Group = "group1"
            model.Desc = "desc1"
            model.Message = "message1"
            model.Rooms = ["key1", "key2"]
            return model
        })()
        var route2 = ((): Route => {
            let model = new Route();
            model.Key = "key2"
            model.Group = ""
            model.Desc = "desc2"
            model.Message = "message2"
            model.Rooms = ["key3"]
            return model
        })()

        var newroute2 = ((): Route => {
            let model = new Route();
            model.Key = "key2"
            model.Group = "group2"
            model.Desc = "desc2"
            model.Message = "message2"
            model.Rooms = ["key3"]
            return model
        })()
        var route3 = ((): Route => {
            let model = new Route();
            model.Key = "key3"
            model.Group = "group1"
            model.Desc = "desc3"
            model.Message = "message3"
            model.Rooms = ["key4"]
            return model
        })()
        var route4 = ((): Route => {
            let model = new Route();
            model.Key = "key4"
            model.Group = "group2"
            model.Desc = "desc4"
            model.Message = "message4"
            model.Rooms = ["key5"]
            return model
        })()
        var badroute1 =
            ((): Route => {
                let model = new Route();
                model.Key = ""
                model.Group = ""
                model.Desc = ""
                model.Message = ""
                model.Rooms = []
                return model
            })()
        var opt = new APIListOption();
        routes = mapDatabase.APIListRoutes(opt);
        assert.isEmpty(routes);
        mapDatabase.APIInsertRoutes([route1, route2, route3]);
        routes = mapDatabase.APIListRoutes(opt);
        assert.isEmpty(routes);

        mapDatabase.APIRemoveRoutes(["key1"]);
        routes = mapDatabase.APIListRoutes(opt);
        assert.isEmpty(routes);

        mapDatabase.NewMap();
        mapDatabase.APIInsertRoutes([route1, route2, route3]);


        opt = new APIListOption();
        routes = mapDatabase.APIListRoutes(opt);
        assert.equal(3, routes.length);
        assert.equal(route2, routes[0]);
        assert.equal(route1, routes[1]);
        assert.equal(route3, routes[2]);

        opt.Clear().WithGroups([""]);
        routes = mapDatabase.APIListRoutes(opt);
        assert.equal(1, routes.length);
        assert.equal(route2, routes[0]);
        opt.Clear().WithGroups(["group1"]);
        routes = mapDatabase.APIListRoutes(opt);
        assert.equal(2, routes.length);
        assert.equal(route1, routes[0]);
        assert.equal(route3, routes[1]);
        opt.Clear().WithGroups(["notfound"]);
        routes = mapDatabase.APIListRoutes(opt);
        assert.isEmpty(routes);
        opt.Clear().WithKeys(["key2"]);
        routes = mapDatabase.APIListRoutes(opt);
        assert.equal(1, routes.length);
        assert.equal(route2, routes[0]);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key2"]);
        routes = mapDatabase.APIListRoutes(opt);
        assert.isEmpty(routes);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key1"]);
        routes = mapDatabase.APIListRoutes(opt);
        assert.equal(1, routes.length);
        assert.equal(route1, routes[0]);

        opt = new APIListOption();
        mapDatabase.APIInsertRoutes([]);

        mapDatabase.APIInsertRoutes([newroute2, route4]);


        routes = mapDatabase.APIListRoutes(opt);
        assert.equal(4, routes.length);
        assert.equal(route1, routes[0]);
        assert.equal(route3, routes[1]);
        assert.equal(newroute2, routes[2]);
        assert.equal(route4, routes[3]);
        assert.isFalse(badroute1.Validated());
        mapDatabase.APIInsertRoutes([badroute1]);


        routes = mapDatabase.APIListRoutes(opt);
        assert.equal(4, routes.length);
        mapDatabase.APIRemoveRoutes([]);

        mapDatabase.APIRemoveRoutes(["key1"]);

        routes = mapDatabase.APIListRoutes(opt);
        assert.equal(3, routes.length);
        assert.equal(route3, routes[0]);
        assert.equal(newroute2, routes[1]);
        assert.equal(route4, routes[2]);
        mapDatabase.APIRemoveRoutes(["key1", "key2", "key4"]);

        routes = mapDatabase.APIListRoutes(opt);
        assert.equal(1, routes.length);
        assert.equal(route3, routes[0]);
    })

    it("TestTraceAPI", () => {

        var mapDatabase = new MapDatabase();
        let traces: Trace[] = [];
        var trace1 = ((): Trace => {
            let model = new Trace();
            model.Key = "key1";
            model.Group = "group1";
            model.Desc = "desc1";
            model.Message = "message1";
            return model;
        })()
        var trace2 = ((): Trace => {
            let model = new Trace();
            model.Key = "key2"
            model.Group = ""
            model.Desc = "desc2"
            model.Message = "message2"
            return model;
        })()
        var newtrace2 = ((): Trace => {
            let model = new Trace();
            model.Key = "key2"
            model.Group = "group2"
            model.Desc = "desc2"
            model.Message = "message2"
            return model;
        })()
        var trace3 = ((): Trace => {
            let model = new Trace();
            model.Key = "key3"
            model.Group = "group1"
            model.Desc = "desc3"
            model.Message = "message3"
            return model;
        })()
        var trace4 = ((): Trace => {
            let model = new Trace();
            model.Key = "key4"
            model.Group = "group2"
            model.Desc = "desc4"
            model.Message = "message4"
            return model;
        })()
        var badtrace1 = ((): Trace => {
            let model = new Trace();
            model.Key = ""
            model.Group = ""
            model.Desc = ""
            model.Message = ""
            return model;
        })()
        var opt = new APIListOption();
        traces = mapDatabase.APIListTraces(opt);
        assert.isEmpty(traces);
        mapDatabase.APIInsertTraces([trace1, trace2, trace3]);
        traces = mapDatabase.APIListTraces(opt);
        assert.isEmpty(traces);

        mapDatabase.APIRemoveTraces(["key1"]);
        traces = mapDatabase.APIListTraces(opt);
        assert.isEmpty(traces);

        mapDatabase.NewMap();
        mapDatabase.APIInsertTraces([trace1, trace2, trace3]);


        opt = new APIListOption();
        traces = mapDatabase.APIListTraces(opt);
        assert.equal(3, traces.length);
        assert.equal(trace2, traces[0]);
        assert.equal(trace1, traces[1]);
        assert.equal(trace3, traces[2]);
        opt.WithGroups([""]);
        traces = mapDatabase.APIListTraces(opt);
        assert.equal(1, traces.length);
        assert.equal(trace2, traces[0]);
        opt.Clear().WithGroups(["group1"]);
        traces = mapDatabase.APIListTraces(opt);
        assert.equal(2, traces.length);
        assert.equal(trace1, traces[0]);
        assert.equal(trace3, traces[1]);
        opt.Clear().WithGroups(["notfound"]);
        traces = mapDatabase.APIListTraces(opt);
        assert.isEmpty(traces);
        opt.Clear().WithKeys(["key2"]);
        traces = mapDatabase.APIListTraces(opt);
        assert.equal(1, traces.length);
        assert.equal(trace2, traces[0]);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key2"]);
        traces = mapDatabase.APIListTraces(opt);
        assert.isEmpty(traces);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key1"]);
        traces = mapDatabase.APIListTraces(opt);
        assert.equal(1, traces.length);
        assert.equal(trace1, traces[0]);

        opt = new APIListOption();
        mapDatabase.APIInsertTraces([]);

        mapDatabase.APIInsertTraces([newtrace2, trace4]);


        traces = mapDatabase.APIListTraces(opt);
        assert.equal(4, traces.length);
        assert.equal(trace1, traces[0]);
        assert.equal(trace3, traces[1]);
        assert.equal(newtrace2, traces[2]);
        assert.equal(trace4, traces[3]);
        assert.isFalse(badtrace1.Validated());
        mapDatabase.APIInsertTraces([badtrace1]);


        traces = mapDatabase.APIListTraces(opt);
        assert.equal(4, traces.length);
        mapDatabase.APIRemoveTraces([]);

        mapDatabase.APIRemoveTraces(["key1"]);

        traces = mapDatabase.APIListTraces(opt);
        assert.equal(3, traces.length);
        assert.equal(trace3, traces[0]);
        assert.equal(newtrace2, traces[1]);
        assert.equal(trace4, traces[2]);
        mapDatabase.APIRemoveTraces(["key1", "key2", "key4"]);

        traces = mapDatabase.APIListTraces(opt);
        assert.equal(1, traces.length);
        assert.equal(trace3, traces[0]);
    })

    it("TestRegionAPI", () => {
        var mapDatabase = new MapDatabase();

        let regions: Region[] = [];
        var region1 = ((): Region => {
            let model = new Region();
            model.Key = "key1"
            model.Group = "group1"
            model.Desc = "desc1"
            model.Message = "message1"
            return model;
        })()
        var region2 = ((): Region => {
            let model = new Region();
            model.Key = "key2"
            model.Group = ""
            model.Desc = "desc2"
            model.Message = "message2"
            return model;
        })()
        var newregion2 = ((): Region => {
            let model = new Region();
            model.Key = "key2"
            model.Group = "group2"
            model.Desc = "desc2"
            model.Message = "message2"
            return model;
        })()
        var region3 = ((): Region => {
            let model = new Region();
            model.Key = "key3"
            model.Group = "group1"
            model.Desc = "desc3"
            model.Message = "message3"
            return model;
        })()
        var region4 = ((): Region => {
            let model = new Region();
            model.Key = "key4"
            model.Group = "group2"
            model.Desc = "desc4"
            model.Message = "message4"
            return model;
        })()
        var badregion1 = ((): Region => {
            let model = new Region();
            model.Key = ""
            model.Group = ""
            model.Desc = ""
            model.Message = ""
            return model;
        })()
        var opt = new APIListOption();
        regions = mapDatabase.APIListRegions(opt);
        assert.isEmpty(regions);
        mapDatabase.APIInsertRegions([region1, region2, region3]);
        regions = mapDatabase.APIListRegions(opt);
        assert.isEmpty(regions);

        mapDatabase.APIRemoveRegions(["key1"]);
        regions = mapDatabase.APIListRegions(opt);
        assert.isEmpty(regions);

        mapDatabase.NewMap();
        mapDatabase.APIInsertRegions([region1, region2, region3]);


        opt = new APIListOption();
        regions = mapDatabase.APIListRegions(opt);
        assert.equal(3, regions.length);
        assert.equal(region2, regions[0]);
        assert.equal(region1, regions[1]);
        assert.equal(region3, regions[2]);
        opt.Clear().WithGroups([""]);
        regions = mapDatabase.APIListRegions(opt);
        assert.equal(1, regions.length);
        assert.equal(region2, regions[0]);
        opt.Clear().WithGroups(["group1"]);
        regions = mapDatabase.APIListRegions(opt);
        assert.equal(2, regions.length);
        assert.equal(region1, regions[0]);
        assert.equal(region3, regions[1]);
        opt.Clear().WithGroups(["notfound"]);
        regions = mapDatabase.APIListRegions(opt);
        assert.isEmpty(regions);
        opt.Clear().WithKeys(["key2"]);
        regions = mapDatabase.APIListRegions(opt);
        assert.equal(1, regions.length);
        assert.equal(region2, regions[0]);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key2"]);
        regions = mapDatabase.APIListRegions(opt);
        assert.isEmpty(regions);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key1"]);
        regions = mapDatabase.APIListRegions(opt);
        assert.equal(1, regions.length);
        assert.equal(region1, regions[0]);

        opt = new APIListOption();
        mapDatabase.APIInsertRegions([]);

        mapDatabase.APIInsertRegions([newregion2, region4]);


        regions = mapDatabase.APIListRegions(opt);
        assert.equal(4, regions.length);
        assert.equal(region1, regions[0]);
        assert.equal(region3, regions[1]);
        assert.equal(newregion2, regions[2]);
        assert.equal(region4, regions[3]);
        assert.isFalse(badregion1.Validated());
        mapDatabase.APIInsertRegions([badregion1]);


        regions = mapDatabase.APIListRegions(opt);
        assert.equal(4, regions.length);
        mapDatabase.APIRemoveRegions([]);

        mapDatabase.APIRemoveRegions(["key1"]);

        regions = mapDatabase.APIListRegions(opt);
        assert.equal(3, regions.length);
        assert.equal(region3, regions[0]);
        assert.equal(newregion2, regions[1]);
        assert.equal(region4, regions[2]);
        mapDatabase.APIRemoveRegions(["key1", "key2", "key4"]);

        regions = mapDatabase.APIListRegions(opt);
        assert.equal(1, regions.length);
        assert.equal(region3, regions[0]);
    })
    it("TestShortcutAPI", () => {
        var mapDatabase = new MapDatabase();
        let shortcuts: Shortcut[] = [];
        var shortcut1 = ((): Shortcut => {
            let model = new Shortcut();
            model.Key = "key1"
            model.Command = "cmd1"
            model.Group = "group1"
            model.Desc = "desc1"
            return model;
        })()
        var shortcut2 = ((): Shortcut => {
            let model = new Shortcut();
            model.Key = "key2"
            model.Command = "cmd2"
            model.Group = ""
            model.Desc = "desc2"
            return model;
        })()
        var newshortcut2 = ((): Shortcut => {
            let model = new Shortcut();
            model.Key = "key2"
            model.Command = "cmd2"
            model.Group = "group2"
            model.Desc = "desc2"
            return model;
        })()
        var shortcut3 = ((): Shortcut => {
            let model = new Shortcut();
            model.Key = "key3"
            model.Command = "cmd3"
            model.Group = "group1"
            model.Desc = "desc3"
            return model;
        })()
        var shortcut4 = ((): Shortcut => {
            let model = new Shortcut();
            model.Key = "key4"
            model.Command = "cmd4"
            model.Group = "group2"
            model.Desc = "desc4"
            return model;
        })()
        var badshortcut1 = ((): Shortcut => {
            let model = new Shortcut();
            model.Key = ""
            model.Group = ""
            model.Desc = ""
            return model;
        })()
        var opt = new APIListOption();
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.isEmpty(shortcuts);
        mapDatabase.APIInsertShortcuts([shortcut1, shortcut2, shortcut3]);
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.isEmpty(shortcuts);

        mapDatabase.APIRemoveShortcuts(["key1"]);
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.isEmpty(shortcuts);

        mapDatabase.NewMap();
        mapDatabase.APIInsertShortcuts([shortcut1, shortcut2, shortcut3]);


        opt = new APIListOption();
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.equal(3, shortcuts.length);
        assert.equal(shortcut2, shortcuts[0]);
        assert.equal(shortcut1, shortcuts[1]);
        assert.equal(shortcut3, shortcuts[2]);
        opt.Clear().WithGroups([""]);
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.equal(1, shortcuts.length);
        assert.equal(shortcut2, shortcuts[0]);
        opt.Clear().WithGroups(["group1"]);
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.equal(2, shortcuts.length);
        assert.equal(shortcut1, shortcuts[0]);
        assert.equal(shortcut3, shortcuts[1]);
        opt.Clear().WithGroups(["notfound"]);
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.isEmpty(shortcuts);
        opt.Clear().WithKeys(["key2"]);
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.equal(1, shortcuts.length);
        assert.equal(shortcut2, shortcuts[0]);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key2"]);
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.isEmpty(shortcuts);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key1"]);
        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.equal(1, shortcuts.length);
        assert.equal(shortcut1, shortcuts[0]);

        opt = new APIListOption();
        mapDatabase.APIInsertShortcuts([]);

        mapDatabase.APIInsertShortcuts([newshortcut2, shortcut4]);


        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.equal(4, shortcuts.length);
        assert.equal(shortcut1, shortcuts[0]);
        assert.equal(shortcut3, shortcuts[1]);
        assert.equal(newshortcut2, shortcuts[2]);
        assert.equal(shortcut4, shortcuts[3]);
        assert.isFalse(badshortcut1.Validated());
        mapDatabase.APIInsertShortcuts([badshortcut1]);


        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.equal(4, shortcuts.length);
        mapDatabase.APIRemoveShortcuts([]);

        mapDatabase.APIRemoveShortcuts(["key1"]);

        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.equal(3, shortcuts.length);
        assert.equal(shortcut3, shortcuts[0]);
        assert.equal(newshortcut2, shortcuts[1]);
        assert.equal(shortcut4, shortcuts[2]);
        mapDatabase.APIRemoveShortcuts(["key1", "key2", "key4"]);

        shortcuts = mapDatabase.APIListShortcuts(opt);
        assert.equal(1, shortcuts.length);
        assert.equal(shortcut3, shortcuts[0]);
    })
    it("TestVariableAPI", () => {

        var mapDatabase = new MapDatabase();
        let variables: Variable[] = [];
        var variable1 = ((): Variable => {
            let model = new Variable();
            model.Key = "key1"
            model.Value = "value1"
            model.Group = "group1"
            model.Desc = "desc1"
            return model
        })()
        var variable2 = ((): Variable => {
            let model = new Variable();
            model.Key = "key2"
            model.Value = "value2"
            model.Group = ""
            model.Desc = "desc2"
            return model
        })()
        var newvariable2 = ((): Variable => {
            let model = new Variable();
            model.Key = "key2"
            model.Value = "value2"
            model.Group = "group2"
            model.Desc = "desc2"
            return model
        })()
        var variable3 = ((): Variable => {
            let model = new Variable();
            model.Key = "key3"
            model.Value = "value3"
            model.Group = "group1"
            model.Desc = "desc3"
            return model
        })()
        var variable4 = ((): Variable => {
            let model = new Variable();
            model.Key = "key4"
            model.Value = "value4"
            model.Group = "group2"
            model.Desc = "desc4"
            return model
        })()
        var badvariable1 = ((): Variable => {
            let model = new Variable();
            model.Key = ""
            model.Group = ""
            model.Desc = ""
            model.Value = ""
            return model
        })()
        var opt = new APIListOption();
        variables = mapDatabase.APIListVariables(opt);
        assert.isEmpty(variables);
        mapDatabase.APIInsertVariables([variable1, variable2, variable3]);
        variables = mapDatabase.APIListVariables(opt);
        assert.isEmpty(variables);

        mapDatabase.APIRemoveVariables(["key1"]);
        variables = mapDatabase.APIListVariables(opt);
        assert.isEmpty(variables);

        mapDatabase.NewMap();
        mapDatabase.APIInsertVariables([variable1, variable2, variable3]);


        opt = new APIListOption();
        variables = mapDatabase.APIListVariables(opt);
        assert.equal(3, variables.length);
        assert.equal(variable2, variables[0]);
        assert.equal(variable1, variables[1]);
        assert.equal(variable3, variables[2]);
        opt.Clear().WithGroups([""]);
        variables = mapDatabase.APIListVariables(opt);
        assert.equal(1, variables.length);
        assert.equal(variable2, variables[0]);
        opt.Clear().WithGroups(["group1"]);
        variables = mapDatabase.APIListVariables(opt);
        assert.equal(2, variables.length);
        assert.equal(variable1, variables[0]);
        assert.equal(variable3, variables[1]);
        opt.Clear().WithGroups(["notfound"]);
        variables = mapDatabase.APIListVariables(opt);
        assert.isEmpty(variables);
        opt.Clear().WithKeys(["key2"]);
        variables = mapDatabase.APIListVariables(opt);
        assert.equal(1, variables.length);
        assert.equal(variable2, variables[0]);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key2"]);
        variables = mapDatabase.APIListVariables(opt);
        assert.isEmpty(variables);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key1"]);
        variables = mapDatabase.APIListVariables(opt);
        assert.equal(1, variables.length);
        assert.equal(variable1, variables[0]);

        opt = new APIListOption();
        mapDatabase.APIInsertVariables([]);

        mapDatabase.APIInsertVariables([newvariable2, variable4]);


        variables = mapDatabase.APIListVariables(opt);
        assert.equal(4, variables.length);
        assert.equal(variable1, variables[0]);
        assert.equal(variable3, variables[1]);
        assert.equal(newvariable2, variables[2]);
        assert.equal(variable4, variables[3]);
        assert.isFalse(badvariable1.Validated());
        mapDatabase.APIInsertVariables([badvariable1]);


        variables = mapDatabase.APIListVariables(opt);
        assert.equal(4, variables.length);
        mapDatabase.APIRemoveVariables([]);

        mapDatabase.APIRemoveVariables(["key1"]);

        variables = mapDatabase.APIListVariables(opt);
        assert.equal(3, variables.length);
        assert.equal(variable3, variables[0]);
        assert.equal(newvariable2, variables[1]);
        assert.equal(variable4, variables[2]);
        mapDatabase.APIRemoveVariables(["key1", "key2", "key4"]);

        variables = mapDatabase.APIListVariables(opt);
        assert.equal(1, variables.length);
        assert.equal(variable3, variables[0]);
    })
    it("TestLandmarkAPI", () => {

        var mapDatabase = new MapDatabase();
        let landmarks: Landmark[] = [];

        var landmark1 = ((): Landmark => {
            let model = new Landmark();
            model.Key = "key1";
            model.Type = "type1";
            model.Group = "group1";
            model.Desc = "desc1";
            return model;
        })()

        var landmark1t2 = ((): Landmark => {
            let model = new Landmark();
            model.Key = "key1"
            model.Type = "type2"
            model.Group = "group1"
            model.Desc = "desc1"
            return model;
        })()
        var landmark2 = ((): Landmark => {
            let model = new Landmark();
            model.Key = "key2"
            model.Type = "type2"
            model.Group = ""
            model.Desc = "desc2"
            return model;
        })()
        var newlandmark2 = ((): Landmark => {
            let model = new Landmark();
            model.Key = "key2"
            model.Type = "type2"
            model.Group = "group2"
            model.Desc = "desc2"
            return model;
        })()
        var landmark3 = ((): Landmark => {
            let model = new Landmark();
            model.Key = "key3"
            model.Type = "type1"
            model.Group = "group1"
            model.Desc = "desc3"
            return model;
        })()
        var landmark4 = ((): Landmark => {
            let model = new Landmark();
            model.Key = "key4"
            model.Type = "type1"
            model.Group = "group2"
            model.Desc = "desc4"
            return model;
        })()
        var badlandmark1 = ((): Landmark => {
            let model = new Landmark();
            model.Key = ""
            model.Group = ""
            model.Desc = ""
            return model;
        })()
        var opt = new APIListOption();
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.isEmpty(landmarks);
        mapDatabase.APIInsertLandmarks([landmark1, landmark2, landmark3]);
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.isEmpty(landmarks);

        mapDatabase.APIRemoveLandmarks([landmark1.UniqueKey()]);
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.isEmpty(landmarks);

        mapDatabase.NewMap();
        mapDatabase.APIInsertLandmarks([landmark1, landmark1t2, landmark2, landmark3]);


        opt = new APIListOption();
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.equal(4, landmarks.length);
        assert.equal(landmark2, landmarks[0]);
        assert.equal(landmark1, landmarks[1]);
        assert.equal(landmark1t2, landmarks[2]);
        assert.equal(landmark3, landmarks[3]);
        opt.Clear().WithGroups([""]);
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.equal(1, landmarks.length);
        assert.equal(landmark2, landmarks[0]);
        opt.Clear().WithGroups(["group1"]);
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.equal(3, landmarks.length);
        assert.equal(landmark1, landmarks[0]);
        assert.equal(landmark1t2, landmarks[1]);
        assert.equal(landmark3, landmarks[2]);
        opt.Clear().WithGroups(["notfound"]);
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.isEmpty(landmarks);
        opt.Clear().WithKeys(["key2"]);
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.equal(1, landmarks.length);
        assert.equal(landmark2, landmarks[0]);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key2"]);
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.isEmpty(landmarks);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key1"]);
        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.equal(2, landmarks.length);
        assert.equal(landmark1, landmarks[0]);
        assert.equal(landmark1t2, landmarks[1]);

        opt = new APIListOption();
        mapDatabase.APIInsertLandmarks([]);

        mapDatabase.APIInsertLandmarks([newlandmark2, landmark4]);


        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.equal(5, landmarks.length);
        assert.equal(landmark1, landmarks[0]);
        assert.equal(landmark1t2, landmarks[1]);
        assert.equal(landmark3, landmarks[2]);
        assert.equal(newlandmark2, landmarks[3]);
        assert.equal(landmark4, landmarks[4]);
        assert.isFalse(badlandmark1.Validated());
        mapDatabase.APIInsertLandmarks([badlandmark1]);


        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.equal(5, landmarks.length);
        mapDatabase.APIRemoveLandmarks([]);

        mapDatabase.APIRemoveLandmarks([landmark1.UniqueKey()]);

        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.equal(4, landmarks.length);
        assert.equal(landmark1t2, landmarks[0]);
        assert.equal(landmark3, landmarks[1]);
        assert.equal(newlandmark2, landmarks[2]);
        assert.equal(landmark4, landmarks[3]);
        mapDatabase.APIRemoveLandmarks([landmark1.UniqueKey(), landmark1t2.UniqueKey(), landmark2.UniqueKey(), landmark4.UniqueKey()]);

        landmarks = mapDatabase.APIListLandmarks(opt);
        assert.equal(1, landmarks.length);
        assert.equal(landmark3, landmarks[0]);
    })
    it("TestSnapshotAPI", () => {
        var mapDatabase = new MapDatabase();
        let snapshots: Snapshot[] = [];
        var snapshot1 = ((): Snapshot => {
            let model = new Snapshot();
            model.Key = "key1"
            model.Value = "Value1"
            model.Type = "type1"
            model.Group = "group1"
            model.Timestamp = 1234567890
            return model;
        })()
        var snapshot1t2 = ((): Snapshot => {
            let model = new Snapshot();
            model.Key = "key1"
            model.Value = "Value1"
            model.Type = "type2"
            model.Group = "group1"
            model.Timestamp = 1234567890
            return model;
        })()
        var snapshot2 = ((): Snapshot => {
            let model = new Snapshot();
            model.Key = "key2"
            model.Value = "Value2"
            model.Type = "type2"
            model.Group = ""
            model.Timestamp = 1234567890
            return model;
        })()
        var newsnapshot2 = ((): Snapshot => {
            let model = new Snapshot();
            model.Key = "key2"
            model.Value = "Value2"
            model.Type = "type2"
            model.Group = "group2"
            model.Timestamp = 1234567890
            return model;
        })()
        var snapshot3 = ((): Snapshot => {
            let model = new Snapshot();
            model.Key = "key3"
            model.Value = "Value3"
            model.Type = "type1"
            model.Group = "group1"
            model.Timestamp = 1234567890
            return model;
        })()
        var snapshot4 = ((): Snapshot => {
            let model = new Snapshot();
            model.Key = "key4"
            model.Value = "Value4"
            model.Type = "type1"
            model.Group = "group2"
            model.Timestamp = 1234567890
            return model;
        })()
        var badsnapshot1 = ((): Snapshot => {
            let model = new Snapshot();
            model.Key = ""
            model.Group = ""
            return model;
        })()
        var opt = new APIListOption();
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.isEmpty(snapshots);
        mapDatabase.APIInsertSnapshots([snapshot1, snapshot2, snapshot3]);
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.isEmpty(snapshots);

        mapDatabase.APIRemoveSnapshots([snapshot1.UniqueKey()]);
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.isEmpty(snapshots);

        mapDatabase.NewMap();
        mapDatabase.APIInsertSnapshots([snapshot1, snapshot1t2, snapshot2, snapshot3]);


        opt = new APIListOption();
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.equal(4, snapshots.length);
        assert.equal(snapshot2, snapshots[0]);
        assert.equal(snapshot1, snapshots[1]);
        assert.equal(snapshot1t2, snapshots[2]);
        assert.equal(snapshot3, snapshots[3]);
        opt.Clear().WithGroups([""]);
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.equal(1, snapshots.length);
        assert.equal(snapshot2, snapshots[0]);
        opt.Clear().WithGroups(["group1"]);
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.equal(3, snapshots.length);
        assert.equal(snapshot1, snapshots[0]);
        assert.equal(snapshot1t2, snapshots[1]);
        assert.equal(snapshot3, snapshots[2]);
        opt.Clear().WithGroups(["notfound"]);
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.isEmpty(snapshots);
        opt.Clear().WithKeys(["key2"]);
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.equal(1, snapshots.length);
        assert.equal(snapshot2, snapshots[0]);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key2"]);
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.isEmpty(snapshots);
        opt.Clear().WithGroups(["group1"]).WithKeys(["key1"]);
        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.equal(2, snapshots.length);
        assert.equal(snapshot1, snapshots[0]);
        assert.equal(snapshot1t2, snapshots[1]);

        opt = new APIListOption();
        mapDatabase.APIInsertSnapshots([]);

        mapDatabase.APIInsertSnapshots([newsnapshot2, snapshot4]);


        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.equal(5, snapshots.length);
        assert.equal(snapshot1, snapshots[0]);
        assert.equal(snapshot1t2, snapshots[1]);
        assert.equal(snapshot3, snapshots[2]);
        assert.equal(newsnapshot2, snapshots[3]);
        assert.equal(snapshot4, snapshots[4]);
        assert.isFalse(badsnapshot1.Validated());
        mapDatabase.APIInsertSnapshots([badsnapshot1]);


        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.equal(5, snapshots.length);
        mapDatabase.APIRemoveSnapshots([]);

        mapDatabase.APIRemoveSnapshots([snapshot1.UniqueKey()]);

        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.equal(4, snapshots.length);
        assert.equal(snapshot1t2, snapshots[0]);
        assert.equal(snapshot3, snapshots[1]);
        assert.equal(newsnapshot2, snapshots[2]);
        assert.equal(snapshot4, snapshots[3]);
        mapDatabase.APIRemoveSnapshots([snapshot1.UniqueKey(), snapshot1t2.UniqueKey(), snapshot2.UniqueKey(), snapshot4.UniqueKey()]);

        snapshots = mapDatabase.APIListSnapshots(opt);
        assert.equal(1, snapshots.length);
        assert.equal(snapshot3, snapshots[0]);
    })
    it("TestArrange", () => {

        var mapDatabase = new MapDatabase();
        mapDatabase.NewMap();
        var room = ((): Room => {
            let model = new Room();
            model.Key = "room1"
            model.Group = "group1"
            model.Desc = "desc1"
            model.Data = [new Data("key2", "value2"), new Data("key1", "value1")]
            model.Tags = [new ValueTag("tag1", 0), new ValueTag("tag2", 0)]
            model.Exits = [
                ((): Exit => {
                    let model = new Exit()
                    model.Command = "cmd1"
                    model.To = "to1"
                    model.Cost = 1
                    model.Conditions = [new ValueCondition("key1", 0, true), new ValueCondition("key2", 0, true)]
                    return model
                })()
            ]
            return model
        })()
        mapDatabase.APIInsertRooms([room]);
        var rooms = mapDatabase.APIListRooms(new APIListOption());
        assert.equal(1, rooms.length);
        assert.equal(2, rooms[0].Data.length);
        assert.equal("key1", rooms[0].Data[0].Key);
        assert.equal("key2", rooms[0].Data[1].Key);
        assert.equal(2, rooms[0].Tags.length);
        assert.equal("tag1", rooms[0].Tags[0].Key);
        assert.equal("tag2", rooms[0].Tags[1].Key);
        assert.equal(1, rooms[0].Exits.length);
        assert.equal(2, rooms[0].Exits[0].Conditions.length);
        assert.equal("key1", rooms[0].Exits[0].Conditions[0].Key);
        assert.equal("key2", rooms[0].Exits[0].Conditions[1].Key);

        var trace = ((): Trace => {
            let model = new Trace();
            model.Key = "trace1"
            model.Group = "group1"
            model.Desc = "desc1"
            model.Locations = ["2", "1"]
            model.Message = "message1"
            return model
        })()
        mapDatabase.APIInsertTraces([trace]);
        var traces = mapDatabase.APIListTraces(new APIListOption());
        assert.equal(1, traces.length);
        assert.equal(2, traces[0].Locations.length);
        assert.equal("1", traces[0].Locations[0]);
        assert.equal("2", traces[0].Locations[1]);

        var shortcut = ((): Shortcut => {
            let model = new Shortcut()
            model.Key = "shortcut1"
            model.Command = "cmd1"
            model.Group = "group1"
            model.Desc = "desc1"
            model.Conditions = [new ValueCondition("key2", 0, true), new ValueCondition("key1", 0, true)]

            return model
        })()
        mapDatabase.APIInsertShortcuts([shortcut]);
        var shortcuts = mapDatabase.APIListShortcuts(new APIListOption());
        assert.equal(1, shortcuts.length);
        assert.equal(2, shortcuts[0].Conditions.length);
        assert.equal("key1", shortcuts[0].Conditions[0].Key);
        assert.equal("key2", shortcuts[0].Conditions[1].Key);
    })

    it("TestAPIGroupRoom", () => {
        var room =
            ((): Room => {
                let model = new Room();
                model.Key = "room1"
                model.Group = "group1"
                model.Desc = "desc1"
                model.Data = [new Data("key2", "value2"), new Data("key1", "value1")]
                model.Tags = [new ValueTag("tag1", 0), new ValueTag("tag2", 0)]
                model.Exits = [
                    ((): Exit => {
                        let model = new Exit()
                        model.Command = "cmd1"
                        model.To = "to1"
                        model.Cost = 1
                        model.Conditions = [new ValueCondition("key1", 0, true), new ValueCondition("key2", 0, true)]
                        return model
                    })()
                ]
                return model
            })()
        var mapDatabase = new MapDatabase();

        mapDatabase.APIGroupRoom("room1", "newgroup");

        mapDatabase.NewMap();
        mapDatabase.APIInsertRooms([room]);

        mapDatabase.APIGroupRoom("room1", "group1");
        var rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1"]));
        assert.equal(1, rooms.length);
        assert.equal("group1", rooms[0].Group);

        mapDatabase.APIGroupRoom("room1", "newgroup");
        rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1"]));
        assert.equal(1, rooms.length);
        assert.equal("newgroup", rooms[0].Group);


        mapDatabase.APIGroupRoom("roomnotfound", "newgroup");
        rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1", "roomnotfound"]));
        assert.equal(1, rooms.length);
        assert.equal("newgroup", rooms[0].Group);
    })

    it("TestAPISetRoomData", () => {
        var room = ((): Room => {
            let model = new Room();
            model.Key = "room1"
            model.Group = "group1"
            model.Desc = "desc1"
            model.Data = [new Data("key2", "value2"), new Data("key1", "value1")]
            model.Tags = [new ValueTag("tag1", 0), new ValueTag("tag2", 0)]
            model.Exits = [
                ((): Exit => {
                    let model = new Exit()
                    model.Command = "cmd1"
                    model.To = "to1"
                    model.Cost = 1
                    model.Conditions = [new ValueCondition("key1", 0, true), new ValueCondition("key2", 0, true)]
                    return model
                })()
            ]
            return model
        })()
        var mapDatabase = new MapDatabase();
        mapDatabase.APISetRoomData("room1", "key1", "newvalue");

        mapDatabase.NewMap();
        mapDatabase.APIInsertRooms([room]);

        mapDatabase.APISetRoomData("room1", "key1", "value1");
        var rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1"]));
        assert.equal(1, rooms.length);
        assert.equal("value1", rooms[0].GetData("key1"));

        mapDatabase.APISetRoomData("room1", "key1", "newdata");
        rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1"]));
        assert.equal(1, rooms.length);
        assert.equal("newdata", rooms[0].GetData("key1"));


        mapDatabase.APISetRoomData("roomnotfound", "key1", "newdata");
        rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1", "roomnotfound"]));
        assert.equal(1, rooms.length);
        assert.equal("newdata", rooms[0].GetData("key1"));

    })
    it("TestAPITagRoom", () => {
        var room = ((): Room => {
            let model = new Room();
            model.Key = "room1"
            model.Group = "group1"
            model.Desc = "desc1"
            model.Data = [new Data("key2", "value2"), new Data("key1", "value1")]
            model.Tags = [new ValueTag("tag1", 1), new ValueTag("tag2", 1)]
            model.Exits = [
                ((): Exit => {
                    let model = new Exit()
                    model.Command = "cmd1"
                    model.To = "to1"
                    model.Cost = 1
                    model.Conditions = [new ValueCondition("key1", 0, true), new ValueCondition("key2", 0, true)]
                    return model
                })()
            ]
            return model
        })()
        var mapDatabase = new MapDatabase();
        mapDatabase.APITagRoom("room1", "tag1", 1);

        mapDatabase.APITagRoom("room1", "", 1);

        mapDatabase.NewMap();
        mapDatabase.APIInsertRooms([room]);

        mapDatabase.APITagRoom("room1", "tag1", 1);
        var rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1"]));
        assert.equal(1, rooms.length);
        assert.isNotEmpty(rooms[0].Tags);
        assert.equal("tag1", rooms[0].Tags[0].Key);
        assert.equal(1, rooms[0].Tags[0].Value);

        mapDatabase.APITagRoom("room1", "tag1", 2);
        rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1"]));
        assert.equal(1, rooms.length);
        assert.isNotEmpty(rooms[0].Tags);
        assert.equal("tag1", rooms[0].Tags[0].Key);
        assert.equal(2, rooms[0].Tags[0].Value);


        mapDatabase.APITagRoom("roomnotfound", "tag1", 2);
        rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1", "roomnotfound"]));
        assert.equal(1, rooms.length);
        assert.isNotEmpty(rooms[0].Tags);
        assert.equal("tag1", rooms[0].Tags[0].Key);
        assert.equal(2, rooms[0].Tags[0].Value);


        mapDatabase.APITagRoom("room1", "tag1", 0);
        rooms = mapDatabase.APIListRooms(new APIListOption().WithKeys(["room1"]));
        assert.equal(1, rooms.length);
        assert.equal(1, rooms[0].Tags.length);
        assert.equal("tag2", rooms[0].Tags[0].Key);
        assert.equal(1, rooms[0].Tags[0].Value);

    })

    it("TestAPITraceLocation", () => {
        var mapDatabase = new MapDatabase();
        var trace = ((): Trace => {
            let model = new Trace()
            model.Key = "trace1"
            model.Group = "group1"
            model.Desc = "desc1"
            model.Locations = ["1", "2"]
            model.Message = "message1"

            return model
        })()
        mapDatabase.APITraceLocation("trace1", "3");

        mapDatabase.NewMap();
        mapDatabase.APIInsertTraces([trace]);

        mapDatabase.APITraceLocation("trace1", "1");
        var traces = mapDatabase.APIListTraces(new APIListOption().WithKeys(["trace1"]));
        assert.equal(1, traces.length);
        assert.equal("1;2", traces[0].Locations.join(";"));

        mapDatabase.APITraceLocation("trace1", "3");
        traces = mapDatabase.APIListTraces(new APIListOption().WithKeys(["trace1"]));
        assert.equal(1, traces.length);
        assert.equal("1;2;3", traces[0].Locations.join(";"));


        mapDatabase.APITraceLocation("traceNotfound", "3");
        traces = mapDatabase.APIListTraces(new APIListOption().WithKeys(["trace1", "traceNotfound"]));
        assert.equal(1, traces.length);
        assert.equal("1;2;3", traces[0].Locations.join(";"));
    })

    it("TestGetVariable", () => {

        var mapDatabase = new MapDatabase();
        mapDatabase.NewMap();
        var variable = mapDatabase.APIGetVariable("key1");
        assert.equal("", variable);
        mapDatabase.APIInsertVariables([
            ((): Variable => {
                let model = new Variable();
                model.Key = "key1"
                model.Value = "value1"
                model.Group = "group1"
                model.Desc = "desc1"
                return model;
            })()
        ]);
        variable = mapDatabase.APIGetVariable("key1");
        assert.equal("value1", variable);
        variable = mapDatabase.APIGetVariable("keynotfound");
        assert.equal("", variable);
    })

    it("TestAPIGetRoom", () => {
        var mapDatabase = new MapDatabase();
        var ctx = new Context().WithRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "ctx1"
                model.Group = "ctxroom"
                return model;
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "ctx2"
                model.Group = "ctxroom"
                return model;
            })(),
        ]);
        var opt = new MapperOptions();
        var room = mapDatabase.APIGetRoom("key1", ctx, opt);
        assert.isNull(room);
        mapDatabase.NewMap();
        mapDatabase.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key1"
                return model;
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "ctx2"
                return model;
            })(),
        ]);
        room = mapDatabase.APIGetRoom("key1", ctx, opt);
        assert.isNotNull(room);
        assert.equal("key1", room.Key);
        room = mapDatabase.APIGetRoom("ctx1", ctx, opt);
        assert.isNotNull(room);
        assert.equal("ctx1", room.Key);
        room = mapDatabase.APIGetRoom("ctx2", ctx, opt);
        assert.isNotNull(room);
        assert.equal("ctx2", room.Key);
        assert.equal("ctxroom", room.Group);
    })

    it("TestAPISnapshotALL", () => {
        var mapDatabase = new MapDatabase();
        mapDatabase.APIClearSnapshots(new SnapshotFilter(null, null, null));

        mapDatabase.APITakeSnapshot("key1", "value1", "type1", "group1");

        var snapshots = mapDatabase.APISearchSnapshots(new SnapshotSearch());

        mapDatabase.NewMap();
        mapDatabase.APITakeSnapshot("key1", "value1", "type1", "group1");


        snapshots = mapDatabase.APISearchSnapshots(new SnapshotSearch());
        assert.equal(1, snapshots.length);
        assert.equal("key1", snapshots[0].Key);
        assert.equal(1, snapshots[0].Sum);
        mapDatabase.APITakeSnapshot("key1", "value1", "type1", "group1");
        snapshots = mapDatabase.APISearchSnapshots(new SnapshotSearch());
        assert.equal(1, snapshots.length);
        assert.equal("key1", snapshots[0].Key);
        assert.equal(2, snapshots[0].Sum);
        mapDatabase.APIClearSnapshots(new SnapshotFilter(null, null, null).WithMaxCount(1));
        snapshots = mapDatabase.APISearchSnapshots(new SnapshotSearch());
        assert.equal(1, snapshots.length);
        mapDatabase.APIClearSnapshots(new SnapshotFilter(null, null, null).WithMaxCount(2));
        snapshots = mapDatabase.APISearchSnapshots(new SnapshotSearch());
        assert.isEmpty(snapshots);
        mapDatabase.APITakeSnapshot("key1", "value1", "type1", "group1");
        snapshots = mapDatabase.APISearchSnapshots(new SnapshotSearch());
        assert.equal(1, snapshots.length);
        mapDatabase.APIClearSnapshots(new SnapshotFilter(null, null, null));
        snapshots = mapDatabase.APISearchSnapshots(new SnapshotSearch());
        assert.isEmpty(snapshots);
    })
    it("TestAPIRoomsAll", () => {
        var mapDatabase = new MapDatabase();
        var result = mapDatabase.APISearchRooms(new RoomFilter());
        assert.isEmpty(result);
        result = mapDatabase.APIFilterRooms(["key1", "key2", "key3"], new RoomFilter());
        assert.isEmpty(result);
        mapDatabase.NewMap();
        mapDatabase.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key1"
                model.Group = "group1"
                model.Desc = "desc1"
                return model;
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                model.Group = "group2"
                model.Desc = "desc2"
                return model;
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key3"
                model.Group = "group3"
                model.Desc = "desc3"
                return model;
            })(),
        ]);
        result = mapDatabase.APIFilterRooms(["key1", "key2", "key3"], new RoomFilter());
        assert.equal(3, result.length);
        result.sort((a, b) => a.Key < b.Key ? -1 : 1);
        assert.equal("key1;key2;key3", result.map(r => r.Key).join(";"));
        result = mapDatabase.APIFilterRooms(["key3", "key2", "key2", "key5"], new RoomFilter());
        assert.equal(2, result.length);
        result.sort((a, b) => a.Key < b.Key ? -1 : 1);
        assert.equal("key2;key3", result.map(r => r.Key).join(";"));
        var rf = ((): RoomFilter => {
            let model = new RoomFilter()
            model.ContainsAnyKey = ["key1", "key2", "key3"]
            return model
        })()
        result = mapDatabase.APISearchRooms(rf);
        assert.equal(3, result.length);
        result.sort((a, b) => a.Key < b.Key ? -1 : 1);
        assert.equal("key1;key2;key3", result.map(r => r.Key).join(";"));
    })
    it("TestAPIQueryRegionRooms", () => {
        var mapDatabase = new MapDatabase();
        var result = mapDatabase.APIQueryRegionRooms("key");
        assert.isEmpty(result);
        assert.isEmpty(result);
        mapDatabase.NewMap();
        mapDatabase.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key1"
                model.Group = "group2"
                model.Desc = "desc1"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                model.Group = "group2"
                model.Desc = "desc2"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key3"
                model.Group = "group3"
                model.Desc = "desc3"
                return model
            })(),
        ]);
        mapDatabase.APIInsertRegions([
            ((): Region => {
                let model = new Region()
                model.Key = "key1"
                model.Items = [
                    new RegionItem(RegionItemType.Room, "key1", false),
                    new RegionItem(RegionItemType.Zone, "group3", false),
                ]
                return model;
            })(),
            ((): Region => {
                let model = new Region()
                model.Key = "key2"
                model.Items = [
                    new RegionItem(RegionItemType.Room, "notfoundkey", false),
                    new RegionItem(RegionItemType.Zone, "notfoundzone", false),
                ]
                return model;
            })(),
            ((): Region => {
                let model = new Region()
                model.Key = "key3"
                model.Items = [
                    new RegionItem(RegionItemType.Room, "key1", false),
                    new RegionItem(RegionItemType.Room, "key2", false),
                    new RegionItem(RegionItemType.Room, "key3", false),
                    new RegionItem(RegionItemType.Zone, "group2", true),
                ]
                return model;
            })(),
            ((): Region => {
                let model = new Region()
                model.Key = "key4"
                model.Items = [
                    new RegionItem(RegionItemType.Zone, "group2", false),
                    new RegionItem(RegionItemType.Room, "key1", true),
                ]
                return model;
            })(),
            ((): Region => {
                let model = new Region()
                model.Key = "key5"
                model.Items = [
                    new RegionItem(RegionItemType.Zone, "group2", false),
                    new RegionItem(RegionItemType.Room, "key1", true),
                    new RegionItem(RegionItemType.Zone, "group3", false),
                    new RegionItem(RegionItemType.Room, "key2", false),
                    new RegionItem(RegionItemType.Zone, "group2", true),
                ]
                return model;
            })(),
        ]);
        result = mapDatabase.APIQueryRegionRooms("notfound");
        assert.isEmpty(result);
        result = mapDatabase.APIQueryRegionRooms("key1");
        assert.equal("key1;key3", result.join(";"));
        result = mapDatabase.APIQueryRegionRooms("key2");
        assert.isEmpty(result);
        result = mapDatabase.APIQueryRegionRooms("key3");
        assert.equal("key3", result.join(";"));
        result = mapDatabase.APIQueryRegionRooms("key4");
        assert.equal("key2", result.join(";"));
        result = mapDatabase.APIQueryRegionRooms("key5");
        assert.equal("key3", result.join(";"));
    })
    it("TestAPIGetRoomExits", () => {
        var mapDatabase = new MapDatabase();
        var ctx = new Context();
        var opt = new MapperOptions();
        var result = mapDatabase.APIGetRoomExits("key", ctx, opt);
        assert.isEmpty(result);
        mapDatabase.NewMap();
        var exit1 = ((): Exit => {
            let model = new Exit();
            model.Command = "cmd1"
            model.To = "key2"
            return model;
        })()
        var exit2 = ((): Exit => {
            let model = new Exit();
            model.Command = "cmd2"
            model.To = "key2"
            return model;
        })()
        mapDatabase.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key1"
                model.Exits = [exit1, exit2]
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                return model
            })(),
        ]);
        result = mapDatabase.APIGetRoomExits("notfound", ctx, opt);
        assert.isEmpty(result);
        result = mapDatabase.APIGetRoomExits("key1", ctx, opt);
        assert.equal(2, result.length);
        assert.equal(exit1, result[0]);
        assert.equal(exit2, result[1]);
        var shortcut1 = ((): Shortcut => {
            let model = new Shortcut();
            model.Key = "shortcut1"
            model.To = "key2"
            model.Command = "sc1"
            return model
        })()
        mapDatabase.APIInsertShortcuts([shortcut1]);
        result = mapDatabase.APIGetRoomExits("key1", ctx, opt);
        assert.equal(3, result.length);
        assert.equal(exit1, result[0]);
        assert.equal(exit2, result[1]);
        assert.equal(shortcut1, result[2]);
        var path1 = ((): Path => {
            let model = new Path();
            model.From = "key1"
            model.Command = "cmdp1"
            model.To = "key2"
            return model
        })()

        var shortcut2 = ((): Shortcut => {
            let model = new Shortcut();
            model.Key = "shortcut2"
            model.To = "key2"
            model.Command = "sc2"
            return model
        })()
        ctx.WithPaths([path1]);
        ctx.WithShortcuts([shortcut2]);
        result = mapDatabase.APIGetRoomExits("key1", ctx, opt);
        assert.equal(5, result.length);
        assert.equal(exit1, result[0]);
        assert.equal(exit2, result[1]);
        assert.equal(path1, result[2]);
        assert.equal(shortcut1, result[3]);
        assert.equal(shortcut2, result[4]);
        opt.WithDisableShortcuts(true);
        result = mapDatabase.APIGetRoomExits("key1", ctx, opt);
        assert.equal(3, result.length);
        assert.equal(exit1, result[0]);
        assert.equal(exit2, result[1]);
        assert.equal(path1, result[2]);
    })
})