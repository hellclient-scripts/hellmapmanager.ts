export class Step {
    constructor(command: string, target: string, cost: number) {
        this.Command = command
        this.Target = target
        this.Cost = cost
    }
    Command: string
    Target: string
    Cost: Number
    static New(command: string, target: string, cost: number): Step {
        return new Step(command, target, cost)
    }
    static JoinCommands(sep: string, steps: Step[]): string {
        return steps.map(x => x.Command).join(sep);
    }
}

export class QueryResult {
    From: string = "";
    To: string = "";
    Cost: number = 0;
    Steps: Step[] = [];
    Unvisited: string[] = [];
    static New(): QueryResult {
        return new QueryResult();
    }
    IsSuccess(): boolean {
        return this.From !== "" && this.To !== "";
    }
    static Fail: QueryResult = new QueryResult();

    SuccessOrNull(): QueryResult | null {
        if (this.IsSuccess()) {
            return this;
        }
        return null;
    }
}