import { assert } from "chai";
import { RoomTag, Path, MapDatabase, Context, MapperOptions, Room, Exit, Shortcut, Step, ValueTag, ValueCondition, Link, CommandCost } from '../src/index';
describe("MapTest", () => {

    let InitMapDatabase = (md: MapDatabase) => {
        md.NewMap();
        md.APIInsertRooms([
            ((): Room => {
                let result = new Room();
                result.Key = "key1"
                result.Tags = []
                result.Exits = [
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key2"
                        exit.Command = "1>2"
                        exit.Cost = 1
                        return exit;
                    })(),
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key3"
                        exit.Command = "1>3"
                        exit.Cost = 1
                        return exit;
                    })(),
                ]
                return result;
            })(),
            ((): Room => {
                let result = new Room();
                result.Key = "key2"
                result.Tags = []
                result.Exits = [
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key1"
                        exit.Command = "2>1"
                        exit.Cost = 1
                        return exit;
                    })(),
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key3"
                        exit.Command = "2>3"
                        exit.Cost = 1
                        return exit;
                    })(),
                ]
                return result;
            })(),
            ((): Room => {
                let result = new Room();
                result.Key = "key3"
                result.Tags = []
                result.Exits = [
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key1"
                        exit.Command = "3>1"
                        exit.Cost = 1
                        return exit;
                    })(),
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key3"
                        exit.Command = "3>3"
                        exit.Cost = 1
                        return exit;
                    })(),
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key4"
                        exit.Command = "3>4"
                        exit.Cost = 1
                        return exit;
                    })(),
                ]
                return result;
            })(),
            ((): Room => {
                let result = new Room();
                result.Key = "key4"
                result.Tags = []
                result.Exits = [
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key3"
                        exit.Command = "4>3"
                        exit.Cost = 1
                        return exit;
                    })(),
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key5"
                        exit.Command = "4>5"
                        exit.Cost = 1
                        return exit;
                    })(),
                ]
                return result;
            })(),
            ((): Room => {
                let result = new Room();
                result.Key = "key5"
                result.Tags = []
                result.Exits = [
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key3"
                        exit.Command = "5>3"
                        exit.Cost = 1
                        return exit;
                    })(),
                ]

                return result;
            })(),
            ((): Room => {
                let result = new Room();
                result.Key = "key7"
                result.Tags = []
                result.Exits = []
                return result;
            })(),

        ]);
        md.APIInsertShortcuts([
            ((): Shortcut => {
                let result = new Shortcut();
                result.Key = "shortcut1";
                result.To = "key1";
                result.Command = "A>1";
                result.Cost = 2;
                return result;
            })(),
        ]);
    }
    let InitContext = (ctx: Context) => {
        ctx.ClearTags().WithTags([]);
        ctx.ClearRoomConditions().WithRoomConditions([]);
        ctx.ClearRooms().WithRooms([
            ((): Room => {
                let room = new Room();
                room.Key = "key6"
                room.Tags = [new ValueTag("ctxroom", 1)]
                room.Exits = [
                    ((): Exit => {
                        let exit = new Exit();
                        exit.To = "key3"
                        exit.Command = "6>3"
                        exit.Cost = 1
                        return exit;
                    })(),

                ]
                return room
            })()

        ]);
        ctx.ClearShortcuts().WithShortcuts([
            ((): Shortcut => {
                let result = new Shortcut();
                result.To = "key6"
                result.Command = "A>6C"
                result.Conditions = [new ValueCondition("noctxpath", 1, true)]
                result.Cost = 2
                return result;
            })(),
            ((): Shortcut => {
                let result = new Shortcut();
                result.To = "key5"
                result.Command = "1>5C"
                result.Conditions = [new ValueCondition("rt1", 1, false)]
                result.Cost = 2
                return result;
            })(),
        ]);
        ctx.ClearPaths().WithPaths([
            ((): Path => {
                let result = new Path();
                result.From = "key5"
                result.To = "key6"
                result.Command = "5>6C"
                result.Conditions = [new ValueCondition("noctxpath", 1, true)]
                result.Cost = 1
                return result;
            })(),

            ((): Path => {
                let result = new Path();
                result.From = "key1"
                result.To = "key2"
                result.Conditions = [new ValueCondition("noctxpath", 1, true)]
                result.Command = "1>2C"
                result.Cost = 1
                return result;
            })(),
        ]);
        ctx.ClearWhitelist().WithWhitelist([]);
        ctx.ClearBlacklist().WithBlacklist([]);
        ctx.ClearBlockedLinks().WithBlockedLinks([]);
        ctx.ClearCommandCosts().WithCommandCosts([]);
    }
    it("TestMap", () => {
        var mapDatabase = new MapDatabase();
        var ctx = new Context();
        var opt = new MapperOptions();
        var qr = mapDatabase.APIQueryPathAll("key1", ["key2"], ctx, opt);
        assert.isNull(qr);
        qr = mapDatabase.APIQueryPathAny(["key1"], ["key2"], ctx, opt);
        assert.isNull(qr);
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key2"], ctx, opt);
        assert.isNull(qr);
        var rooms = mapDatabase.APIDilate(["key1", "key6"], 2, ctx, opt);
        assert.isEmpty(rooms);
        var exit = mapDatabase.APITrackExit("key1", "1>2", ctx, opt);
        assert.equal("", exit);
        InitMapDatabase(mapDatabase);
        InitContext(ctx);
        qr = mapDatabase.APIQueryPathAll("key1", ["key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>2", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key1"], ["key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>2", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>2", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key1", "key6"], 2, ctx, opt);
        rooms.sort();
        assert.equal("key1;key2;key3;key4;key6", rooms.join(";"));
        exit = mapDatabase.APITrackExit("key1", "1>2", ctx, opt);
        assert.equal("key2", exit);
        exit = mapDatabase.APITrackExit("notfound", "1>2", ctx, opt);
        assert.equal("", exit);
        exit = mapDatabase.APITrackExit("key1", "notfound", ctx, opt);
        assert.equal("", exit);
        //shortcut
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        exit = mapDatabase.APITrackExit("key1", "A>6C", ctx, opt);
        assert.equal("key6", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>2", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>2", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));

        opt.WithDisableShortcuts(true);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("", exit);
        exit = mapDatabase.APITrackExit("key1", "A>6C", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1;1>2", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1;1>2", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key3;key6", rooms.join(";"));

        //tag
        opt = new MapperOptions();
        InitContext(ctx);
        exit = mapDatabase.APITrackExit("key1", "A>6C", ctx, opt);
        assert.equal("key6", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key3", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;A>6C", Step.JoinCommands(";", qr.Steps));

        qr = mapDatabase.APIQueryPathAny(["key1"], ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));

        qr = mapDatabase.APIQueryPathOrdered("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;3>4;4>5;5>6C", Step.JoinCommands(";", qr.Steps));

        rooms = mapDatabase.APIDilate(["key1"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key2;key3;key6", rooms.join(";"));

        ctx.WithTags([new ValueTag("noctxpath", 1)]);
        exit = mapDatabase.APITrackExit("key1", "A>6C", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key3", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3", Step.JoinCommands(";", qr.Steps));

        qr = mapDatabase.APIQueryPathAny(["key1"], ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));

        rooms = mapDatabase.APIDilate(["key1"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key2;key3", rooms.join(";"));
        //RoomConditions
        opt = new MapperOptions();
        InitContext(ctx);
        exit = mapDatabase.APITrackExit("key1", "A>6C", ctx, opt);
        assert.equal("key6", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key3", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;A>6C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key1"], ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;3>4;4>5;5>6C", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key1"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key2;key3;key6", rooms.join(";"));

        ctx.WithRoomConditions([new ValueCondition("ctxroom", 1, true)]);
        exit = mapDatabase.APITrackExit("key1", "A>6C", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key3", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key1"], ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key1"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key2;key3", rooms.join(";"));

        //Whitelist
        opt = new MapperOptions();
        InitContext(ctx);

        exit = mapDatabase.APITrackExit("key3", "3>4", ctx, opt);
        assert.equal("key4", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C;6>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key3"], ["key6", "key4"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("3>4", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;3>4;4>5;5>6C", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key3"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key4;key6", rooms.join(";"));

        ctx.WithWhitelist(["key1", "key2", "key3", "key5", "key6"]);
        exit = mapDatabase.APITrackExit("key3", "3>4", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key3"], ["key6", "key4"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key3"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));

        //blacklist
        opt = new MapperOptions();
        InitContext(ctx);
        exit = mapDatabase.APITrackExit("key1", "1>3", ctx, opt);
        assert.equal("key3", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key4", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C;6>3;3>4", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key4"], ["key6", "key3"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("4>3", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>3;3>4;4>5;5>6C", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key4"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key4;key5;key6", rooms.join(";"));

        ctx.WithBlacklist(["key3"]);
        exit = mapDatabase.APITrackExit("key1", "1>3", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key4", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key4"], ["key6", "key3"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key4"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key4;key5;key6", rooms.join(";"));
        //BlockedLinks
        opt = new MapperOptions();
        InitContext(ctx);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));

        ctx.WithBlockedLinks([new Link("key6", "key1")]);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key3;key6", rooms.join(";"));

        //CommandCosts
        opt = new MapperOptions();
        InitContext(ctx);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        assert.equal(5, qr.Cost);
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        assert.equal(2, qr.Cost);
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));

        ctx.WithCommandCosts([new CommandCost("A>1", "key1", 99)]);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        assert.equal(5, qr.Cost);
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal(2, qr.Cost);
        assert.equal("6>3;3>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal(5, qr.Cost);
        assert.equal("6>3;3>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));

        //MaxExitCost
        opt = new MapperOptions();
        InitContext(ctx);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));

        opt.MaxExitCost = 1;
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key3;key6", rooms.join(";"));

        //MaxTotalCost
        opt = new MapperOptions();
        InitContext(ctx);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));
        opt.MaxTotalCost = 3;
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));


        //CommandWhitelist
        opt = new MapperOptions();
        InitContext(ctx);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));
        opt.WithCommandWhitelist(["1>2", "1>3", "2>1", "2>3", "3>1", "3>3", "3>4", "4>3", "4>5", "5>3", "6>3", "A>6C"]);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("6>3;3>1;1>3;3>4;4>5", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key3;key6", rooms.join(";"));

        //CommandNotContains
        opt = new MapperOptions();
        InitContext(ctx);
        opt.WithCommandNotContains([">3"]);
        exit = mapDatabase.APITrackExit("key1", "1>3", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key4", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key4"], ["key6", "key3"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key5", "key6"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>6C", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key4"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key4;key5;key6", rooms.join(";"));


        //RoomTags
        opt = new MapperOptions();
        InitContext(ctx);
        ctx.WithRoomTags([new RoomTag("key3", "rt1", 1)]);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;1>5C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>3;1>5C", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key6", rooms.join(";"));

        //RoomTags public
        opt = new MapperOptions();
        InitContext(ctx);
        ctx.WithRoomTags([new RoomTag("", "rt1", 1)]);
        exit = mapDatabase.APITrackExit("key6", "A>1", ctx, opt);
        assert.equal("key1", exit);
        qr = mapDatabase.APIQueryPathAll("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>5C", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key6"], ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key6", ["key1", "key5"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("A>1;1>5C", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key6"], 1, ctx, opt);
        rooms.sort();
        assert.equal("key1;key3;key5;key6", rooms.join(";"));


    })
    it("TestNullableAPI", () => {

        var mapDatabase = new MapDatabase();
        var ctx = new Context();
        var opt = new MapperOptions();
        var qr = mapDatabase.APIQueryPathAll("key1", ["key2"], ctx, opt);
        assert.isNull(qr);
        qr = mapDatabase.APIQueryPathAny(["key1"], ["key2"], ctx, opt);
        assert.isNull(qr);
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key2"], ctx, opt);
        assert.isNull(qr);
        var rooms = mapDatabase.APIDilate(["key1", "key6"], 2, ctx, opt);
        assert.isEmpty(rooms);
        var exit = mapDatabase.APITrackExit("key1", "1>2", ctx, opt);
        assert.equal("", exit);
        qr = mapDatabase.APIQueryPathAll("key1", ["key2"], null, null);
        assert.isNull(qr);
        qr = mapDatabase.APIQueryPathAny(["key1"], ["key2"], null, null);
        assert.isNull(qr);
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key2"], null, null);
        assert.isNull(qr);
        rooms = mapDatabase.APIDilate(["key1", "key6"], 2, null, null);
        assert.isEmpty(rooms);
        exit = mapDatabase.APITrackExit("key1", "1>2", null, null);
        assert.equal("", exit);

        InitMapDatabase(mapDatabase);
        qr = mapDatabase.APIQueryPathAll("key1", ["key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>2", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key1"], ["key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>2", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key2"], ctx, opt);
        assert.isNotNull(qr);
        assert.equal("1>2", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key1", "key6"], 2, ctx, opt);
        rooms.sort();
        assert.equal("key1;key2;key3;key4", rooms.join(";"));
        exit = mapDatabase.APITrackExit("key1", "1>2", ctx, opt);
        assert.equal("key2", exit);
        exit = mapDatabase.APITrackExit("notfound", "1>2", ctx, opt);
        assert.equal("", exit);
        exit = mapDatabase.APITrackExit("key1", "notfound", ctx, opt);
        assert.equal("", exit);

        qr = mapDatabase.APIQueryPathAll("key1", ["key2"], null, null);
        assert.isNotNull(qr);
        assert.equal("1>2", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathAny(["key1"], ["key2"], null, null);
        assert.isNotNull(qr);
        assert.equal("1>2", Step.JoinCommands(";", qr.Steps));
        qr = mapDatabase.APIQueryPathOrdered("key1", ["key2"], null, null);
        assert.isNotNull(qr);
        assert.equal("1>2", Step.JoinCommands(";", qr.Steps));
        rooms = mapDatabase.APIDilate(["key1", "key6"], 2, null, null);
        rooms.sort();
        assert.equal("key1;key2;key3;key4", rooms.join(";"));
        exit = mapDatabase.APITrackExit("key1", "1>2", null, null);
        assert.equal("key2", exit);
        exit = mapDatabase.APITrackExit("notfound", "1>2", null, null);
        assert.equal("", exit);
        exit = mapDatabase.APITrackExit("key1", "notfound", null, null);
        assert.equal("", exit);

    })
})