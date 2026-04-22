
import { Exit } from "../models/exit"
import { Step, QueryResult } from "../models/step"
import { Context } from "../models/context"
import { MapperOptions } from "../models/mapperoption"
import { MapFile } from "../models/mapfile"
import { Room } from "../models/room"
import { ValueTag } from "../models/base"
import { Shortcut, RoomConditionExit } from "../models/shortcut";

export class WalkingStep {
    static FromExit(prev: WalkingStep | null, from: string, exit: Exit, cost: number, TotalCost: number): WalkingStep {
        let result = new WalkingStep()
        result.Prev = prev
        result.From = from
        result.To = exit.To
        result.Command = exit.Command
        result.Cost = cost
        result.TotalCost = TotalCost + cost
        result.Remain = cost - 1
        result.Exit = exit;
        return result;
    }
    ToStep(): Step {
        return new Step(this.Command, this.To, this.Cost);
    }
    Prev: WalkingStep | null = null;
    From: string = "";
    To: string = "";
    Command: string = "";
    Cost: number = 0;
    TotalCost: number = 0;
    Remain: number = 0;
    Exit: Exit | null = null;
}

export class Walking {
    constructor(mapper: Mapper) {
        this.Mapper = mapper;
    }
    private Walked: { [key: string]: WalkingStep } = {};
    public InitShortcuts() {
        for (let key of Object.keys(this.Mapper.MapFile.Records.Shortcuts)) {
            let s = this.Mapper.MapFile.Records.Shortcuts[key];
            if (this.Mapper.ValidateExitStatic(s)) {
                this.Shortcuts.push(s);
            }
        };
        this.Mapper.Context.Shortcuts.forEach(s => {
            if (this.Mapper.ValidateExitStatic(s)) {
                this.Shortcuts.push(s);
            }
        });
    }

    private Shortcuts: RoomConditionExit[] = [];
    Mapper: Mapper;
    private static BuildResult(last: WalkingStep, targets: string[]): QueryResult {
        let result = new QueryResult();
        let current: WalkingStep = last;
        while (current.Prev != null) {
            result.Steps.push(current.ToStep());
            current = current.Prev;
        }
        result.Steps.push(current.ToStep());
        result.Steps.reverse();
        result.From = current.From;
        result.To = last.To;
        for (let target of targets) {
            if (target != result.To) {
                result.Unvisited.push(target);
            }
        }
        result.Cost = last.TotalCost;
        return result;
    }
    QueryPathAny(from: string[], target: string[], initTotalCost: number): QueryResult {
        this.InitShortcuts();
        from = from.filter(x => x !== "");
        target = target.filter(x => x !== "");
        if (from.length == 0 || target.length == 0) {
            return QueryResult.Fail;
        }
        this.Walked = {};
        let targets: { [key: string]: boolean } = {};
        let current: WalkingStep[];
        let pending: WalkingStep[] = [];
        for (let t of target) {
            targets[t] = true;
        }
        for (let f of from) {
            if (targets[f] != null) {
                let result = new QueryResult();
                result.From = f;
                result.To = f;
                result.Cost = initTotalCost;
                for (let to of target) {
                    if (to != f) {
                        result.Unvisited.push(to);
                    }
                }
                return result;
            }
            let step = new WalkingStep()
            step.From = "";
            step.Command = "";
            this.Walked[f] = step
            this.AddRoomWalkingSteps(null, pending, f, initTotalCost);
        }
        while (pending.length > 0) {
            current = pending;
            pending = [];
            for (let step of current) {
                if (this.Walked[step.To] == null) {
                    if (step.Remain <= 1) {
                        if (targets[step.To] != null) {
                            return Walking.BuildResult(step, target);
                        }
                        this.Walked[step.To] = step;
                        this.AddRoomWalkingSteps(step, pending, step.To, step.TotalCost);
                        let sc = step.Exit as RoomConditionExit;
                        if (sc != null) {
                            this.Shortcuts = this.Shortcuts.filter(s => s !== sc);
                        }
                    }
                    else {
                        step.Remain--;
                        pending.push(step);
                    }
                }
            }
        }
        return QueryResult.Fail;
    }
    Dilate(src: string[], iterations: number): string[] {
        this.InitShortcuts();
        this.Walked = {};
        let current: WalkingStep[];
        let pending: WalkingStep[] = [];
        for (let f of src) {
            if (this.Mapper.GetRoom(f) != null) {
                let step = new WalkingStep()
                step.From = "";
                step.Command = "";
                this.Walked[f] = step;
                this.AddRoomWalkingSteps(null, pending, f, 0);
            }
        }
        let i = 0;
        while (pending.length > 0 && i < iterations) {
            current = pending;
            pending = [];
            for (let step of current) {
                if (this.Walked[step.To] == null) {
                    this.Walked[step.To] = step;
                    let sc = step.Exit as RoomConditionExit;
                    if (sc != null) {
                        this.Shortcuts = this.Shortcuts.filter(s => s !== sc);
                    }
                    this.AddRoomWalkingSteps(step, pending, step.To, step.TotalCost);
                }
            }
            i++;
        }
        return Object.keys(this.Walked);
    }
    QueryPathAll(start: string, target: string[]): QueryResult {
        target = target.filter(x => x !== "");
        if (target.length == 0 || start == "") {
            return QueryResult.Fail;
        }
        let result = new QueryResult()
        result.From = start;
        result.To = start;
        let pending = target;
        while (pending.length > 0) {
            let next = this.QueryPathAny([result.To], pending, result.Cost);
            if (next.IsSuccess()) {
                result.Steps = result.Steps.concat(next.Steps);
                result.Cost = next.Cost;
                result.Unvisited = next.Unvisited;
                pending = result.Unvisited;
                result.To = next.To;
            }
            else {
                pending = [];
            }

        }
        if (result.Steps.length == 0) {
            return QueryResult.Fail;
        }
        return result;
    }
    QueryPathOrdered(start: string, target: string[]): QueryResult {
        target = target.filter(x => x !== "");
        if (target.length == 0 || start == "") {
            return QueryResult.Fail;
        }
        let result = new QueryResult()
        result.From = start;
        result.To = start;
        for (let i = 0; i < target.length; i++) {
            let next = this.QueryPathAny([result.To], [target[i]], result.Cost);
            if (next.IsSuccess()) {
                result.Steps = result.Steps.concat(next.Steps);
                result.Cost = next.Cost;
                result.To = next.To;
            }
            else {
                result.Unvisited.push(target[i]);
            }
        }
        if (result.Steps.length == 0) {
            return QueryResult.Fail;
        }
        return result;
    }
    private GetRoomExitsWithoutShortcuts(room: Room): Exit[] {
        let result: Exit[] = [...room.Exits];
        //加入上下文中的临时出口
        let list = this.Mapper.Context.Paths[room.Key]
        if (list != null) {
            result = result.concat(list);
        }
        return result;
    }
    //验证并转换路径
    //如果路径无效，返回空
    private ValidateToWalkingStep(prev: WalkingStep | null, from: string, exit: Exit, TotalCost: number): WalkingStep | null {
        if (exit.To == "" || exit.To == from) {
            return null;
        }
        let cost = this.Mapper.GetExitCost(exit);
        //验证出口
        if (!this.Mapper.ValidateExit(from, exit, cost)) {
            return null;
        }
        //判断最大消耗
        if (this.Mapper.Options.MaxTotalCost > 0 && this.Mapper.Options.MaxTotalCost < (cost + TotalCost)) {
            return null;
        }
        //转换
        return WalkingStep.FromExit(prev, from, exit, cost, TotalCost);
    }
    private ValidateShortcutToWalkingStep(prev: WalkingStep | null, from: string, shortcut: RoomConditionExit, TotalCost: number): WalkingStep | null {
        if (shortcut.To == "" || shortcut.To == from) {
            return null;
        }
        let cost = this.Mapper.GetExitCost(shortcut);
        //验证出口
        if (!this.Mapper.ValidateExitDynamic(from, shortcut, cost)) {
            return null;
        }
        //判断最大消耗
        if (this.Mapper.Options.MaxTotalCost > 0 && this.Mapper.Options.MaxTotalCost < (cost + TotalCost)) {
            return null;
        }
        //转换
        return WalkingStep.FromExit(prev, from, shortcut, cost, TotalCost);
    }
    private AddRoomWalkingSteps(prev: WalkingStep | null, list: WalkingStep[], from: string, TotalCost: number) {
        let room = this.Mapper.GetRoom(from);
        if (room != null) {
            for (let exit of this.GetRoomExitsWithoutShortcuts(room)) {
                let step = this.ValidateToWalkingStep(prev, from, exit, TotalCost);
                if (step != null) {
                    list.push(step);
                }
            }
            //判断是否禁用捷径(飞行)出口
            if (!this.Mapper.Options.DisableShortcuts) {
                for (let shortcut of this.Shortcuts) {
                    if (ValueTag.ValidateConditions(this.Mapper.GetRoomTags(room), shortcut.RoomConditions)) {
                        let step = this.ValidateShortcutToWalkingStep(prev, from, shortcut, TotalCost);
                        if (step != null) {
                            list.push(step);
                        }
                    }
                }
            }
        }
    }
}

export class Mapper {
    constructor(mapFile: MapFile, context: Context, options: MapperOptions) {
        this.MapFile = mapFile;
        this.Context = context;
        this.Options = options;
    }
    Context: Context
    MapFile: MapFile
    Options: MapperOptions
    static New(mapFile: MapFile, context: Context, options: MapperOptions) {
        return new Mapper(mapFile, context, options);
    }
    GetRoom(key: string): Room | null {
        let room = this.Context.Rooms[key];
        if (room == null) {
            return this.MapFile.Records.Rooms[key] || null;
        }
        return room;
    }
    GetExitCost(exit: Exit): number {
        let costs = this.Context.CommandCosts[exit.Command]
        if (costs != null) {
            let cost = costs[exit.To]
            if (cost != null) {
                return cost;
            }
            let cost2 = costs[""]
            if (cost2 != null) {
                return cost2;
            }
        }
        return exit.Cost;
    }
    GetRoomTags(room: Room): ValueTag[] {
        let result: ValueTag[] = [...room.Tags];
        let tags = this.Context.RoomTags[room.Key] || [];
        result = result.concat(tags.map(x => new ValueTag(x.Key, x.Value)));
        let publictags = this.Context.RoomTags[""] || [];
        result = result.concat(publictags.map(x => new ValueTag(x.Key, x.Value)));
        return result;
    }
    GetRoomExits(room: Room): Exit[] {
        let result: Exit[] = [...room.Exits];
        let list = this.Context.Paths[room.Key];
        if (list != null) {
            result = result.concat(list);
        }
        if (!this.Options.DisableShortcuts) {
            for (let key of Object.keys(this.MapFile.Records.Shortcuts)) {
                if (ValueTag.ValidateConditions(this.GetRoomTags(room), this.MapFile.Records.Shortcuts[key].RoomConditions)) {
                    result.push(this.MapFile.Records.Shortcuts[key]);
                }
            }
            for (let shortcut of this.Context.Shortcuts) {
                if (ValueTag.ValidateConditions(this.GetRoomTags(room), shortcut.RoomConditions)) {
                    result.push(shortcut);
                }
            }
        }
        return result;
    }
    ValidateExit(start: string, exit: Exit, cost: number): boolean {

        let room = this.GetRoom(exit.To);
        if (room == null) {
            return false;
        }
        if (!this.ValidateRoom(room)) {
            return false;
        }

        if (this.Context.IsBlocked(start, exit.To)) {
            return false;
        }
        if (this.Options.MaxExitCost > 0 && cost > this.Options.MaxExitCost) {
            return false;
        }
        if (this.Options.MaxTotalCost > 0 && cost > this.Options.MaxTotalCost) {
            return false;
        }
        if (!this.Context.ValidateConditions(exit.Conditions)) {
            return false;
        }
        if (!this.Options.ValidateCommand(exit.Command)) {
            return false;
        }

        return true;
    }
    public ValidateExitStatic(exit: Exit): boolean {
        let room = this.GetRoom(exit.To);
        if (room == null) {
            return false;
        }
        //验证房间符合当前移动的上下文设置
        if (!this.ValidateRoom(room)) {
            return false;
        }
        //判断出口的条件是否匹配当前上下文
        if (!this.Context.ValidateConditions(exit.Conditions)) {
            return false;
        }
        if (!this.Options.ValidateCommand(exit.Command)) {
            return false;
        }
        return true;
    }
    public ValidateExitDynamic(start: string, exit: Exit, cost: number): boolean {
        //判断房间不在上下文中的拦截名单里
        if (this.Context.IsBlocked(start, exit.To)) {
            return false;
        }
        //判断出口不超时
        if (this.Options.MaxExitCost > 0 && cost > this.Options.MaxExitCost) {
            return false;
        }
        //判断出口不超过整个移动的最大消耗
        if (this.Options.MaxTotalCost > 0 && cost > this.Options.MaxTotalCost) {
            return false;
        }
        return true;
    }

    ValidateRoom(room: Room): boolean {
        if (this.Context.Blacklist[room.Key] == true) {
            return false;
        }
        if (Object.keys(this.Context.Whitelist).length > 0 && this.Context.Whitelist[room.Key] == null) {
            return false;
        }
        if (!ValueTag.ValidateConditions(room.Tags, this.Context.RoomConditions)) {
            return false;
        }
        return true;
    }
    ValidatePath(start: string, exit: Exit): boolean {
        if (this.Context.IsBlocked(start, exit.To)) {
            return false;
        }
        return this.ValidateExit(start, exit, this.GetExitCost(exit));
    }
}