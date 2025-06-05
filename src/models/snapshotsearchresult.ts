import { Snapshot } from "./snapshot"
export class SnapshotFilter {
    constructor(key: string | null, type: string | null, group: string | null) {
        this.Key = key
        this.Type = type
        this.Group = group
    }
    Key: string | null
    Type: string | null
    Group: string | null
    static New(key: string | null, type: string | null, group: string | null): SnapshotFilter {
        return new SnapshotFilter(key, type, group)
    }
    Validate(model: Snapshot): boolean {
        if (this.Key !== null && model.Key !== this.Key) {
            return false;
        }
        if (this.Type !== null && model.Type !== this.Type) {
            return false;
        }
        if (this.Group !== null && model.Group !== this.Group) {
            return false;
        }
        return true;
    }
}

export class SnapshotSearch {
    Type: string | null = null
    Group: string | null = null
    Keywords: string[] = [];
    PartialMatch: boolean = true;
    Any: boolean = false;
    static New(): SnapshotSearch {
        return new SnapshotSearch()
    }
    private match(keyword: string, model: Snapshot): boolean {

        if (this.PartialMatch) {
            return model.Value.includes(keyword);
        }
        else {
            return model.Value === keyword;
        }
    }
    Validate(model: Snapshot): boolean {
        if (this.Type !== null && model.Type !== this.Type) {
            return false;
        }
        if (this.Group !== null && model.Group !== this.Group) {
            return false;
        }
        if (this.Keywords.length === 0) {
            return true;
        }

        for (let keyword of this.Keywords) {
            if (keyword !== "") {
                if (this.match(keyword, model) == this.Any) {
                    return this.Any;
                }
            }
        }
        return !this.Any;
    }
}

export class SnapshotSearchResult {
    Key: string = "";
    Sum: number = 0;
    Count: number = 0;
    Items: Snapshot[] = [];
    static New(): SnapshotSearchResult {
        return new SnapshotSearchResult()
    }
    Add(model: Snapshot, match: boolean) {
        this.Sum += model.Count;
        if (match) {
            this.Items.push(model);
            this.Count += model.Count;
        }
    }
}