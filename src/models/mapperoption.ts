export class MapperOptions {
    MaxExitCost: number = 0;
    MaxTotalCost: number = 0;
    DisableShortcuts: boolean = false;
    CommandWhitelist: { [key: string]: boolean } = {};
    CommandNotContains: string[] = [];
    static New(): MapperOptions {
        return new MapperOptions();
    }
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
    WithCommandWhitelist(list: string[]): MapperOptions {
        list.forEach(cmd => {
            this.CommandWhitelist[cmd] = true;
        });
        return this;
    }
    ClearCommandWhitelist(): MapperOptions {
        this.CommandWhitelist = {};
        return this;
    }
    WithCommandNotContains(list: string[]): MapperOptions {
        this.CommandNotContains = list;
        return this;
    }
    ClearCommandNotContains(): MapperOptions {
        this.CommandNotContains = [];
        return this;
    }
    ValidateCommand(cmd: string): boolean {
        if (Object.keys(this.CommandWhitelist).length !== 0) {
            if (this.CommandWhitelist[cmd] === undefined) {
                return false;
            }
        }
        if (this.CommandNotContains.length > 0) {
            for (const str of this.CommandNotContains) {
                if (cmd.includes(str)) {
                    return false;
                }
            }
        }
        return true;
    }
}