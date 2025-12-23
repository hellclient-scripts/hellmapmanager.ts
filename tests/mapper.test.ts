import { assert } from "chai";
import { MapDatabase, Context, MapperOptions, Room, Exit, Shortcut, Step, ValueTag, ValueCondition, Link, CommandCost } from '../src/index';
import { Path, RoomConditionExit, Mapper, Walking, WalkingStep } from '../src/index';

describe("MapperTest", () => {

    it("TestGetRoom", () => {
        var md = new MapDatabase();
        md.NewMap();
        var room = ((): Room => {
            let model = new Room();
            model.Key = "key1"
            return model
        })()

        var room2 = ((): Room => {
            let model = new Room();
            model.Key = "key2"
            return model
        })()

        var room3 = ((): Room => {
            let model = new Room();
            model.Key = "key2"
            return model
        })()
        var room4 = ((): Room => {
            let model = new Room();
            model.Key = "key3"
            return model
        })()
        md.APIInsertRooms([room, room2]);
        var ctx = new Context().WithRooms([
            room3, room4
        ]);
        var mapper = new Mapper(md.Current!, ctx, new MapperOptions());

        assert.isNull(mapper.GetRoom("keynotfound"));
        assert.equal(room, mapper.GetRoom("key1"));
        assert.equal(room3, mapper.GetRoom("key2"));
        assert.equal(room4, mapper.GetRoom("key3"));
    })

    it("TestGetExitCost", () => {

        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        ctx.WithCommandCosts([
            new CommandCost("cmd2", "to1", 20),
            new CommandCost("cmd2", "to2", 20),
            new CommandCost("cmd3", "to4", 20),
            new CommandCost("cmd3", "", 30)
        ]);
        var mapper = new Mapper(md.Current!, ctx, new MapperOptions());
        var exit = ((): Exit => {
            let model = new Exit();
            model.To = "to1"
            model.Command = "cmd1"
            model.Cost = 10
            return model
        })()
        var exit2 = ((): Exit => {
            let model = new Exit();
            model.To = "to1"
            model.Command = "cmd2"
            model.Cost = 10
            return model
        })()
        var exit3 = ((): Exit => {
            let model = new Exit();
            model.To = "to3"
            model.Command = "cmd2"
            model.Cost = 10
            return model
        })()
        var exit4 = ((): Exit => {
            let model = new Exit();
            model.To = "to4"
            model.Command = "cmd3"
            model.Cost = 10
            return model
        })()
        var exit5 = ((): Exit => {
            let model = new Exit();
            model.To = "to5"
            model.Command = "cmd3"
            model.Cost = 10
            return model
        })()


        assert.equal(10, mapper.GetExitCost(exit));
        assert.equal(20, mapper.GetExitCost(exit2));
        assert.equal(10, mapper.GetExitCost(exit3));
        assert.equal(20, mapper.GetExitCost(exit4));
        assert.equal(30, mapper.GetExitCost(exit5));
    })

    it("TestValidateRoom", () => {

        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var room = ((): Room => {
            let model = new Room();
            model.Key = "key1"
            model.Name = "name1"
            model.Desc = "desc1"
            model.Tags = [
                new ValueTag("tag1", 10)
            ]
            model.Group = "group1"
            return model
        })()
        var mapper = new Mapper(md.Current!, ctx, new MapperOptions());
        assert.isTrue(mapper.ValidateRoom(room));
        ctx.WithBlacklist(["key1"]);
        assert.isFalse(mapper.ValidateRoom(room));
        ctx.ClearBlacklist();
        ctx.WithWhitelist(["key2", "key3"]);
        assert.isFalse(mapper.ValidateRoom(room));
        ctx.WithWhitelist(["key1", "key3"]);
        assert.isTrue(mapper.ValidateRoom(room));
        ctx.ClearWhitelist();
        ctx.WithRoomConditions([new ValueCondition("tag1", 11, false)]);
        assert.isFalse(mapper.ValidateRoom(room));
        ctx.ClearRoomConditions();
        ctx.WithRoomConditions([new ValueCondition("tag1", 11, true)]);
        assert.isTrue(mapper.ValidateRoom(room));
        ctx.WithRoomConditions([new ValueCondition("tag1", 5, false)]);
        assert.isTrue(mapper.ValidateRoom(room));
    })

    it("TestValidateExit", () => {

        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var room = ((): Room => {
            let model = new Room();
            model.Key = "key2"
            model.Name = "name1"
            model.Desc = "desc1"
            model.Tags = [
                new ValueTag("tag1", 10)
            ]
            model.Group = "group1"
            return model
        })()
        md.APIInsertRooms([room]);
        var exit = ((): Exit => {
            let model = new Exit();
            model.To = "key2"
            model.Command = "cmd1"
            model.Conditions = [
                new ValueCondition("etag1", 1, true)
            ]
            model.Cost = 10
            return model
        })()
        var opt = new MapperOptions();
        var mapper = new Mapper(md.Current!, ctx, opt);
        assert.isTrue(mapper.ValidateExit("key1", exit, 10));
        var exit2 = exit.Clone();
        exit2.To = "notfound";
        assert.isFalse(mapper.ValidateExit("key1", exit2, 10));
        ctx.WithBlacklist(["key2"]);
        assert.isFalse(mapper.ValidateExit("key1", exit, 10));
        ctx.ClearBlacklist();
        ctx.WithBlockedLinks([new Link("key1", "key2")]);
        assert.isFalse(mapper.ValidateExit("key1", exit, 10));
        ctx.ClearBlockedLinks();
        ctx.WithBlockedLinks([new Link("key2", "key1")]);
        assert.isTrue(mapper.ValidateExit("key1", exit, 10));
        ctx.ClearBlockedLinks();
        assert.isTrue(mapper.ValidateExit("key1", exit, 10));
        opt.MaxExitCost = 5;
        assert.isFalse(mapper.ValidateExit("key1", exit, 10));
        opt.MaxExitCost = 0;
        assert.isTrue(mapper.ValidateExit("key1", exit, 10));
        opt.MaxTotalCost = 5;
        assert.isFalse(mapper.ValidateExit("key1", exit, 10));
        opt.MaxTotalCost = 0;
        assert.isTrue(mapper.ValidateExit("key1", exit, 10));
        ctx.WithTags([new ValueTag("etag1", 5)]);
        assert.isFalse(mapper.ValidateExit("key1", exit, 10));
        ctx.ClearTags();
        assert.isTrue(mapper.ValidatePath("key1", exit));
        ctx.WithBlockedLinks([new Link("key1", "key2")]);
        assert.isFalse(mapper.ValidatePath("key1", exit));
        ctx.ClearBlockedLinks();
        opt.MaxExitCost = 20;
        assert.isTrue(mapper.ValidatePath("key1", exit));
        ctx.WithCommandCosts([new CommandCost("cmd1", "key2", 50)]);
        assert.isFalse(mapper.ValidatePath("key1", exit));
    })
    it("TestWalkingStep", () => {
        var exit = ((): Exit => {
            let model = new Exit();
            model.To = "key2"
            model.Command = "cmd1"
            model.Conditions = [
                new ValueCondition("etag1", 1, true)
            ]
            model.Cost = 150
            return model
        })()
        var ws2 = new WalkingStep();
        assert.isNull(ws2.Prev);
        assert.equal("", ws2.From);
        assert.equal("", ws2.To);
        assert.equal("", ws2.Command);
        assert.equal(0, ws2.Cost);
        assert.equal(0, ws2.TotalCost);
        assert.equal(0, ws2.Remain);


        var ws = WalkingStep.FromExit(null, "key1", exit, 10, 20);
        assert.isNotNull(ws);
        assert.isNull(ws2.Prev);
        assert.equal("key1", ws.From);
        assert.equal("key2", ws.To);
        assert.equal("cmd1", ws.Command);
        assert.equal(10, ws.Cost);
        assert.equal(30, ws.TotalCost);
        assert.equal(9, ws.Remain);

        exit = ((): Exit => {
            let model = new Exit();
            model.To = "key3"
            model.Command = "cmd2"
            model.Cost = 20
            return model
        })()
        var ws3 = WalkingStep.FromExit(ws, "key2", exit, 12, 20);
        assert.isNotNull(ws);
        assert.equal(ws, ws3.Prev);
        assert.equal("key2", ws3.From);
        assert.equal("key3", ws3.To);
        assert.equal("cmd2", ws3.Command);
        assert.equal(12, ws3.Cost);
        assert.equal(32, ws3.TotalCost);
        assert.equal(11, ws3.Remain);
        var step = ws3.ToStep();
        assert.equal("cmd2", step.Command);
        assert.equal("key3", step.Target);
        assert.equal(12, step.Cost);
    })
    it("TestGetRoomExits", () => {

        var room = ((): Room => {
            let model = new Room();
            model.Key = "key1"
            model.Tags = [
                new ValueTag("tag1", 10)
            ]
            model.Exits = [
                ((): Exit => {
                    let model = new Exit();
                    model.To = "key2"
                    model.Command = "cmd1"
                    model.Conditions = [
                        new ValueCondition("etag1", 1, true)
                    ]
                    model.Cost = 10
                    return model
                })(),
                ((): Exit => {
                    let model = new Exit();
                    model.To = "key3"
                    model.Command = "cmd2"
                    model.Cost = 20
                    return model
                })()
            ]
            return model
        })()
        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var opt = new MapperOptions();
        var mapper = new Mapper(md.Current!, ctx, opt);
        var exits = mapper.GetRoomExits(room);
        assert.equal(2, exits.length);
        md.APIInsertShortcuts([
            ((): Shortcut => {
                let model = new Shortcut();
                model.Key = "shortcut1"
                model.Command = "cmd1"
                model.To = "key3"
                model.Cost = 1
                return model
            })()
        ]);
        exits = mapper.GetRoomExits(room);
        assert.equal(3, exits.length);
        md.APIInsertShortcuts([
            ((): Shortcut => {
                let model = new Shortcut();
                model.Key = "shortcut2"
                model.Command = "cmd2"
                model.To = "key4"
                model.RoomConditions = [
                    new ValueCondition("tag1", 1, true)
                ]
                model.Cost = 1
                return model
            })()

        ]);
        exits = mapper.GetRoomExits(room);
        assert.equal(3, exits.length);
        ctx.WithShortcuts([
            ((): RoomConditionExit => {
                let model = new RoomConditionExit();
                model.To = "key4"
                model.Command = "cmd2"
                model.RoomConditions = [
                    new ValueCondition("tag1", 1, false)
                ]
                model.Cost = 1

                return model;
            })()

        ]);
        exits = mapper.GetRoomExits(room);
        assert.equal(4, exits.length);
        ctx.WithShortcuts([
            ((): RoomConditionExit => {
                let model = new RoomConditionExit();
                model.To = "key5"
                model.Command = "cmd3"
                model.RoomConditions = [
                    new ValueCondition("tag1", 99, false)
                ]
                model.Cost = 1
                return model;
            })()
        ]);
        exits = mapper.GetRoomExits(room);
        assert.equal(4, exits.length);
        opt.WithDisableShortcuts(true);
        exits = mapper.GetRoomExits(room);
        assert.equal(2, exits.length);
        ctx.WithPaths([
            ((): Path => {
                let model = new Path();
                model.From = "key1"
                model.To = "key6"
                model.Command = "cmd4"
                model.Cost = 10
                return model
            })()
        ]);
        exits = mapper.GetRoomExits(room);
        assert.equal(3, exits.length);
    })

    it("TestValidateToWalkingStep", () => {

        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var opt = new MapperOptions();
        var mapper = new Mapper(md.Current!, ctx, opt);
        md.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                model.Tags = [
                    new ValueTag("etag1", 1)
                ]
                return model;
            })(),
        ]);
        var exit = ((): Exit => {
            let model = new Exit();
            model.To = "key2"
            model.Command = "cmd1"
            model.Conditions = [
                new ValueCondition("etag1", 1, true)
            ]
            model.Cost = 10
            return model;
        })()
        var wsprev = new WalkingStep()
        var ws = mapper.ValidateToWalkingStep(wsprev, "key1", exit, 10);
        assert.isNotNull(ws);
        assert.equal(wsprev, ws.Prev);
        assert.equal("key1", ws.From);
        assert.equal("key2", ws.To);
        assert.equal("cmd1", ws.Command);
        assert.equal(10, ws.Cost);
        assert.equal(20, ws.TotalCost);
        assert.equal(9, ws.Remain);
        var exit2 = exit.Clone();
        ws = mapper.ValidateToWalkingStep(wsprev, "key1", exit2, 10);
        assert.isNotNull(ws);
        exit2.To = "";
        ws = mapper.ValidateToWalkingStep(wsprev, "key1", exit2, 10);
        assert.isNull(ws);
        exit2 = exit.Clone();
        ws = mapper.ValidateToWalkingStep(wsprev, "key1", exit2, 10);
        assert.isNotNull(ws);
        exit2.To = "key1";
        ws = mapper.ValidateToWalkingStep(wsprev, "key1", exit2, 10);
        assert.isNull(ws);
        ws = mapper.ValidateToWalkingStep(wsprev, "key1", exit, 10);
        assert.isNotNull(ws);
        ctx.WithTags([new ValueTag("etag1", 2)]);
        ws = mapper.ValidateToWalkingStep(wsprev, "key1", exit, 10);
        ctx.ClearTags();
        assert.isNull(ws);
        ws = mapper.ValidateToWalkingStep(wsprev, "key1", exit, 10);
        assert.isNotNull(ws);
        opt.WithMaxTotalCost(15);
        ws = mapper.ValidateToWalkingStep(wsprev, "key1", exit, 10);
        assert.isNull(ws);
    })

    it("TestAddRoomWalkingSteps", () => {
        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var opt = new MapperOptions();
        var mapper = new Mapper(md.Current!, ctx, opt);
        var list: WalkingStep[] = [];
        var room = ((): Room => {
            let model = new Room();
            model.Key = "key1"
            model.Tags = [
                new ValueTag("etag1", 1)
            ]
            model.Exits = [
                ((): Exit => {
                    let model = new Exit();
                    model.To = "key2"
                    model.Command = "cmd1"
                    model.Conditions = [
                        new ValueCondition("etag1", 1, true)
                    ]
                    model.Cost = 10
                    return model;
                })(),
                ((): Exit => {
                    let model = new Exit();
                    model.To = "key3"
                    model.Command = "cmd2"
                    model.Cost = 20
                    return model;
                })(),

            ]
            return model;
        })()

        md.APIInsertRooms([room,
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                return model;
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key3"
                return model;
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key4"
                return model;
            })(),
        ]);
        mapper.AddRoomWalkingSteps(null, list, "notfound", 15);
        assert.isEmpty(list);
        md.APIInsertShortcuts([
            ((): Shortcut => {
                let model = new Shortcut();
                model.Key = "shortcut1"
                model.Command = "cmd3"
                model.To = "key4"
                model.Cost = 1
                return model;
            })()
        ]);
        ctx.WithTags([new ValueTag("etag1", 2)]);
        mapper.AddRoomWalkingSteps(null, list, "key1", 15);
        assert.equal(2, list.length);
        list.sort((a, b) => a.To < b.To ? -1 : 1);
        assert.isNull(list[0].Prev);
        assert.equal("key3", list[0].To);
        assert.equal("cmd2", list[0].Command);
        assert.equal(20, list[0].Cost);
        assert.equal(35, list[0].TotalCost);
        assert.equal(19, list[0].Remain);
        assert.isNull(list[1].Prev);
        assert.equal("key4", list[1].To);
        assert.equal("cmd3", list[1].Command);
        assert.equal(1, list[1].Cost);
        assert.equal(16, list[1].TotalCost);
        assert.equal(0, list[1].Remain);
    })
    var SortAndJoin = (list: string[]) => {
        list.sort();
        return list.join(";");
    }
    it("TestDilate", () => {

        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var opt = new MapperOptions();
        var mapper = new Mapper(md.Current!, ctx, opt);
        md.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key1"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key3"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key4"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key5"
                return model
            })(),
        ]);
        ctx.WithPaths([
            ((): Path => {
                let model = new Path();
                model.From = "key1"
                model.To = "key2"
                model.Command = "1>2"
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key2"
                model.To = "key1"
                model.Command = "2>1"
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key2"
                model.To = "key3"
                model.Command = "2>3"
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key3"
                model.To = "key2"
                model.Command = "3>2"
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key3"
                model.To = "key4"
                model.Command = "3>4"
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key4"
                model.To = "key3"
                model.Command = "4>3"
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key4"
                model.To = "key5"
                model.Command = "4>5"
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key5"
                model.To = "key4"
                model.Command = "5>4"
                return model
            })(),
        ]);
        assert.equal("key3", SortAndJoin(new Walking(mapper).Dilate(["key3"], -1)));
        assert.equal("key3", SortAndJoin(new Walking(mapper).Dilate(["key3"], 0)));
        assert.equal("key2;key3;key4", SortAndJoin(new Walking(mapper).Dilate(["key3"], 1)));
        assert.equal("key1;key2;key3;key4;key5", SortAndJoin(new Walking(mapper).Dilate(["key3"], 2)));
        assert.equal("key1;key2;key3;key4;key5", SortAndJoin(new Walking(mapper).Dilate(["key3"], 99)));
    })

    it("TestQueryPathAny", () => {

        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var opt = new MapperOptions();
        var mapper = new Mapper(md.Current!, ctx, opt);
        md.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key1"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key3"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key4"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key5"
                return model
            })(),
        ]);
        ctx.WithPaths([
            ((): Path => {
                let model = new Path();
                model.From = "key1"
                model.To = "key2"
                model.Command = "1>2"
                model.Cost = 2
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key2"
                model.To = "key1"
                model.Command = "2>1"
                model.Cost = 5
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key2"
                model.To = "key3"
                model.Command = "2>3"
                model.Cost = 5
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key3"
                model.To = "key2"
                model.Command = "3>2"
                model.Cost = 0
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key3"
                model.To = "key4"
                model.Command = "3>4"
                model.Cost = 1
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key4"
                model.To = "key3"
                model.Command = "4>3"
                model.Cost = 2
                return model
            })(),
        ]);
        var result = new Walking(mapper).QueryPathAny([], [], 0);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathAny([""], ["key1"], 0);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathAny(["key1"], [""], 0);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathAny(["key1"], ["key4"], 0);
        assert.isTrue(result.IsSuccess());
        assert.equal(3, result.Steps.length);
        assert.equal("1>2;2>3;3>4", Step.JoinCommands(";", result.Steps));
        assert.equal(8, result.Cost);
        assert.equal("key1", result.From);
        assert.equal("key4", result.To);
        assert.isEmpty(result.Unvisited);
        result = new Walking(mapper).QueryPathAny(["key1", "key2", "key3", "key4"], ["key5"], 0);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathAny(["key1", "key2", "key3"], ["key3", "key4", "key5"], 10);
        assert.isTrue(result.IsSuccess());
        assert.isEmpty(result.Steps);
        assert.equal(10, result.Cost);
        assert.equal("key3", result.From);
        assert.equal("key3", result.To);
        assert.equal("key4;key5", SortAndJoin(result.Unvisited));
        result = new Walking(mapper).QueryPathAny(["key1"], ["key3", "key4", "key5"], 10);
        assert.isTrue(result.IsSuccess());
        assert.equal("1>2;2>3", Step.JoinCommands(";", result.Steps));
        assert.equal(17, result.Cost);
        assert.equal("key1", result.From);
        assert.equal("key3", result.To);
        assert.equal("key4;key5", SortAndJoin(result.Unvisited));
    })

    it("TestQueryPathAll", () => {
        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var opt = new MapperOptions();
        var mapper = new Mapper(md.Current!, ctx, opt);
        md.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key1"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key3"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key4"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key5"
                return model
            })(),
        ]);
        ctx.WithPaths([
            ((): Path => {
                let model = new Path();
                model.From = "key1"
                model.To = "key2"
                model.Command = "1>2"
                model.Cost = 2
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key2"
                model.To = "key1"
                model.Command = "2>1"
                model.Cost = 5
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key2"
                model.To = "key3"
                model.Command = "2>3"
                model.Cost = 5
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key3"
                model.To = "key2"
                model.Command = "3>2"
                model.Cost = 0
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key3"
                model.To = "key4"
                model.Command = "3>4"
                model.Cost = 1
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key4"
                model.To = "key3"
                model.Command = "4>3"
                model.Cost = 2
                return model
            })(),]);
        var result = new Walking(mapper).QueryPathAll("", []);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathAll("", ["key1"]);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathAll("key1", [""]);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathAll("key1", ["key1", "key2", "key3", "key4"]);
        assert.isTrue(result.IsSuccess());
        assert.equal(3, result.Steps.length);
        assert.equal("1>2;2>3;3>4", Step.JoinCommands(";", result.Steps));
        assert.equal(8, result.Cost);
        assert.equal("key1", result.From);
        assert.equal("key4", result.To);
        assert.isEmpty(result.Unvisited);
        result = new Walking(mapper).QueryPathAll("key1", ["key5"]);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathAll("key1", ["key5", "key1", "key4"]);
        assert.isTrue(result.IsSuccess());
        assert.equal(3, result.Steps.length);
        assert.equal("1>2;2>3;3>4", Step.JoinCommands(";", result.Steps));
        assert.equal(8, result.Cost);
        assert.equal("key1", result.From);
        assert.equal("key4", result.To);
        assert.equal(1, Object.keys(result.Unvisited).length);
        assert.equal("key5", result.Unvisited[0]);
    })

    it("TestQueryPathOrdered", () => {
        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var opt = new MapperOptions();
        var mapper = new Mapper(md.Current!, ctx, opt);
        md.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key1"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key3"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key4"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key5"
                return model
            })(),
        ]);
        ctx.WithPaths([
            ((): Path => {
                let model = new Path();
                model.From = "key1"
                model.To = "key2"
                model.Command = "1>2"
                model.Cost = 2
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key2"
                model.To = "key1"
                model.Command = "2>1"
                model.Cost = 5
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key2"
                model.To = "key3"
                model.Command = "2>3"
                model.Cost = 5
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key3"
                model.To = "key2"
                model.Command = "3>2"
                model.Cost = 0
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key3"
                model.To = "key4"
                model.Command = "3>4"
                model.Cost = 1
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key4"
                model.To = "key3"
                model.Command = "4>3"
                model.Cost = 2
                return model
            })(),
        ]);
        var result = new Walking(mapper).QueryPathOrdered("", []);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathOrdered("", ["key1"]);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathOrdered("key1", [""]);
        assert.isFalse(result.IsSuccess());
        result = new Walking(mapper).QueryPathOrdered("key1", ["key4", "key3", "key2", "key1"]);
        assert.isTrue(result.IsSuccess());
        assert.equal(6, result.Steps.length);
        assert.equal("1>2;2>3;3>4;4>3;3>2;2>1", Step.JoinCommands(";", result.Steps));
        assert.equal(15, result.Cost);
        assert.equal("key1", result.From);
        assert.equal("key1", result.To);
        assert.isEmpty(result.Unvisited);
        result = new Walking(mapper).QueryPathOrdered("key1", ["key5", "key4", "key3", "key2", "key1"]);
        assert.isTrue(result.IsSuccess());
        assert.equal(6, result.Steps.length);
        assert.equal("1>2;2>3;3>4;4>3;3>2;2>1", Step.JoinCommands(";", result.Steps));
        assert.equal(15, result.Cost);
        assert.equal("key1", result.From);
        assert.equal("key1", result.To);
        assert.equal(1, Object.keys(result.Unvisited).length);
        assert.equal("key5", result.Unvisited[0]);
        result = new Walking(mapper).QueryPathOrdered("key1", ["key4", "key3", "key5", "key2", "key6", "key1"]);
        assert.isTrue(result.IsSuccess());
        assert.equal(6, result.Steps.length);
        assert.equal("1>2;2>3;3>4;4>3;3>2;2>1", Step.JoinCommands(";", result.Steps));
        assert.equal(15, result.Cost);
        assert.equal("key1", result.From);
        assert.equal("key1", result.To);
        assert.equal(2, result.Unvisited.length);
        assert.equal("key5", result.Unvisited[0]);
        assert.equal("key6", result.Unvisited[1]);
        result = new Walking(mapper).QueryPathOrdered("key1", ["key5", "key6"]);
        assert.isFalse(result.IsSuccess());
    })

    it("TestShortestWay", () => {
        var md = new MapDatabase();
        md.NewMap();
        var ctx = new Context();
        var opt = new MapperOptions();
        var mapper = new Mapper(md.Current!, ctx, opt);
        md.APIInsertRooms([
            ((): Room => {
                let model = new Room();
                model.Key = "key1"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key2"
                return model
            })(),
            ((): Room => {
                let model = new Room();
                model.Key = "key3"
                return model
            })(),
        ]);
        ctx.WithPaths([
            ((): Path => {
                let model = new Path();
                model.From = "key1"
                model.To = "key2"
                model.Command = "1>2"
                model.Cost = 1
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key2"
                model.To = "key3"
                model.Command = "2>3"
                model.Cost = 1
                return model
            })(),
            ((): Path => {
                let model = new Path();
                model.From = "key1"
                model.To = "key3"
                model.Command = "1>3"
                model.Cost = 10
                return model
            })(),
        ]);
        var result = new Walking(mapper).QueryPathAny(["key1"], ["key3"], 0);
        assert.isTrue(result.IsSuccess());
        assert.equal(2, result.Steps.length);
        assert.equal("1>2;2>3", Step.JoinCommands(";", result.Steps));
        ctx.WithPaths([
            ((): Path => {
                let model = new Path();
                model.From = "key1"
                model.To = "key3"
                model.Command = "1>3b"
                model.Cost = 1
                return model
            })(),
        ]);
        result = new Walking(mapper).QueryPathAny(["key1"], ["key3"], 0);
        assert.isTrue(result.IsSuccess());
        assert.equal(1, Object.keys(result.Steps).length);
        assert.equal("1>3b", Step.JoinCommands(";", result.Steps));
    })
})

