
import { Exit } from "./exit";
import { ValueCondition, ValueTag } from "./base";
import { Room } from "./room";
import { RoomConditionExit } from "./shortcut";
export class Path extends Exit {
    From: string = "";
    static New(): Path {
        return new Path();
    }
}
export class Link {
    constructor(from: string, to: string) {
        this.From = from;
        this.To = to;
    }
    From: string = "";
    To: string = "";
    static New(from: string, to: string): Link {
        return new Link(from, to);
    }
}
export class CommandCost {
    constructor(command: string, to: string, cost: number) {
        this.Command = command;
        this.To = to;
        this.Cost = cost;
    }
    Command: string;
    To: string;
    Cost: number;
    static New(command: string, to: string, cost: number): CommandCost {
        return new CommandCost(command, to, cost);
    }
}
export class Environment {
    Tags: ValueTag[] = [];
    RoomConditions: ValueCondition[] = [];
    Rooms: Room[] = [];
    Paths: Path[] = [];
    Shortcuts: RoomConditionExit[] = [];
    Whitelist: string[] = [];
    Blacklist: string[] = [];
    BlockedLinks: Link[] = [];
    CommandCosts: CommandCost[] = [];
    static New(): Environment {
        return new Environment();
    }
}

export class Context {
    Tags: { [key: string]: number } = {};
    RoomConditions: ValueCondition[] = [];
    Rooms: { [key: string]: Room } = {};
    Whitelist: { [key: string]: boolean } = {};
    Blacklist: { [key: string]: boolean } = {};
    Shortcuts: RoomConditionExit[] = [];
    Paths: { [key: string]: Path[] } = {};
    BlockedLinks: { [key: string]: { [key: string]: boolean } } = {};
    CommandCosts: { [key: string]: { [key: string]: number } } = {};
    static New(): Context {
        return new Context();
    }
    ClearTags(): Context {
        this.Tags = {};
        return this;
    }
    WithTags(tags: ValueTag[]): Context {
        for (let tag of tags) {
            this.Tags[tag.Key] = tag.Value;
        }
        return this;
    }
    ClearRoomConditions(): Context {
        this.RoomConditions = [];
        return this;
    }
    WithRoomConditions(conditions: ValueCondition[]): Context {
        this.RoomConditions = this.RoomConditions.concat(conditions);
        return this;
    }
    ClearRooms(): Context {
        this.Rooms = {}
        return this;
    }
    WithRooms(rooms: Room[]): Context {
        for (let room of rooms) {
            this.Rooms[room.Key] = room;
        }
        return this;
    }
    ClearWhitelist(): Context {
        this.Whitelist = {};
        return this;
    }
    WithWhitelist(list: string[]): Context {
        for (let item of list) {
            this.Whitelist[item] = true;
        }
        return this;
    }
    ClearBlacklist(): Context {
        this.Blacklist = {};
        return this;
    }
    WithBlacklist(list: string[]): Context {
        for (let item of list) {
            this.Blacklist[item] = true;
        }
        return this;
    }
    ClearShortcuts(): Context {
        this.Shortcuts = [];
        return this;
    }
    WithShortcuts(list: RoomConditionExit[]): Context {
        this.Shortcuts = this.Shortcuts.concat(list);
        return this;
    }
    ClearPaths(): Context {
        this.Paths = {};
        return this;
    }
    WithPaths(list: Path[]): Context {
        for (let item of list) {
            if (this.Paths[item.From]) {
                this.Paths[item.From].push(item);
            } else {
                this.Paths[item.From] = [item]
            }
        }
        return this;
    }
    ClearBlockedLinks(): Context {
        this.BlockedLinks = {};
        return this;
    }
    WithBlockedLinks(list: Link[]): Context {
        for (let link of list) {
            if (this.BlockedLinks[link.From] == null) {
                this.BlockedLinks[link.From] = {};
            }
            this.BlockedLinks[link.From][link.To] = true;
        }
        return this;
    }
    ClearCommandCosts(): Context {
        this.CommandCosts = {};
        return this;
    }
    WithCommandCosts(list: CommandCost[]): Context {
        for (let item of list) {
            if (this.CommandCosts[item.Command] == null) {
                this.CommandCosts[item.Command] = {};
            }
            this.CommandCosts[item.Command][item.To] = item.Cost;
        }
        return this;
    }
    IsBlocked(from: string, to: string): boolean {
        return this.BlockedLinks[from] != null && this.BlockedLinks[from][to] != null;
    }
    static FromEnvironment(env: Environment): Context {
        let context = new Context();
        context.WithTags(env.Tags);
        context.WithRoomConditions(env.RoomConditions);
        context.WithRooms(env.Rooms);
        context.WithWhitelist(env.Whitelist);
        context.WithBlacklist(env.Blacklist);
        context.WithShortcuts(env.Shortcuts);
        context.WithPaths(env.Paths);
        context.WithBlockedLinks(env.BlockedLinks);
        context.WithCommandCosts(env.CommandCosts);
        return context;
    }
    ToEnvironment(): Environment {
        let env = new Environment();
        env.Tags = [...Object.keys(this.Tags).map(key => new ValueTag(key, this.Tags[key]))];
        env.RoomConditions = this.RoomConditions;
        env.Rooms = Object.values(this.Rooms);
        env.Whitelist = Object.keys(this.Whitelist);
        env.Blacklist = Object.keys(this.Blacklist);
        env.Shortcuts = this.Shortcuts;
        for (let pathitem in this.Paths) {
            for (let item of this.Paths[pathitem]) {
                env.Paths.push(item);
            }
        }
        for (let f in this.BlockedLinks) {
            for (let t in this.BlockedLinks[f]) {
                if (this.BlockedLinks[f][t]) {
                    env.BlockedLinks.push(new Link(f, t));
                }
            }
        }
        for (let c in this.CommandCosts) {
            for (let t in this.CommandCosts[c]) {
                env.CommandCosts.push(new CommandCost(c, t, this.CommandCosts[c][t]));
            }
        }
        return env;
    }
    HasTag(key: string, value: number): boolean {
        if (this.Tags[key]) {
            return value <= this.Tags[key];
        }
        return value <= 0;
    }
    ValidteConditions(conditions: ValueCondition[]): boolean {
        for (let rcondition of conditions) {
            if (this.HasTag(rcondition.Key, rcondition.Value) == rcondition.Not) {
                return false;
            }
        }
        return true;
    }
}