export class MapperOptions {
    MaxExitCost: number = 0;
    MaxTotalCost: number = 0;
    DisableShortcuts: boolean = false;
    WithMaxExitCost(cost: number): MapperOptions {
        this.MaxExitCost = cost;
        return this;
    }
    WithMaxTotalCost(cost: number): MapperOptions {
        this.MaxTotalCost = cost;
        return this;
    }
    WithDisableShortcuts(disable: boolean): MapperOptions {
        this.DisableShortcuts = disable;
        return this;
    }
}