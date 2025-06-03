export class Condition {
    constructor(key: string, not: boolean) {
        this.Key = key;
        this.Not = not;
    }
    Key: string;
    Not: boolean;
    static New(key: string, not: boolean): Condition {
        return new Condition(key, not);
    }
    public Validated(): boolean {
        return this.Key !== "";
    }
    public Equal(model: Condition): boolean {
        return this.Key === model.Key && this.Not === model.Not;
    }
    public Clone(): Condition {
        return new Condition(this.Key, this.Not);
    }
}

export class ValueTag {
    constructor(key: string, value: number) {
        this.Key = key;
        this.Value = value;
    }
    Key: string;
    Value: number;
    static New(key: string, value: number) { return new ValueTag(key, value); }
    Validated(): boolean {
        return this.Key !== "";
    }
    Equal(model: ValueTag): boolean {
        return this.Key == model.Key && this.Value == model.Value;
    }
    Clone(): ValueTag {
        return new ValueTag(this.Key, this.Value);
    }
    ToString(): string {
        return this.Value === 0 ? this.Key : `${this.Key}:${this.Value}`;
    }
    Match(key: string, value: number): boolean {
        return this.Key === key && this.Value >= value;
    }
    static HasTag(tags: ValueTag[], key: string, value: number): boolean {
        for (let tag of tags) {
            if (tag.Match(key, value)) {
                return true;
            }
        }
        return value < 1;
    }
    public static ValidteConditions(tags: ValueTag[], conditions: ValueCondition[]): boolean {
        for (let rcondition of conditions) {
            if (ValueTag.HasTag(tags, rcondition.Key, rcondition.Value) == rcondition.Not) {
                return false;
            }
        }
        return true;

    }

}
export class ValueCondition {
    constructor(key: string, value: number, not: boolean) {
        this.Key = key;
        this.Value = value;
        this.Not = not;
    }
    static New(key: string, value: number, not: boolean): ValueCondition {
        return new ValueCondition(key, value, not);
    }
    Key: string;
    Not: boolean;
    Value: number;
    Validated(): boolean {
        return this.Key !== "";
    }
    Equal(model: ValueCondition): boolean {
        return this.Key == model.Key && this.Not == model.Not && this.Value == model.Value;
    }
    Clone(): ValueCondition {
        return new ValueCondition(this.Key, this.Value, this.Not);
    }
    ToString(): string {
        let label = this.Not ? `!${this.Key}` : this.Key;
        return this.Value == 0 ? label : `${label}:${this.Value}`;
    }
}


export class TypedConditions {
    constructor(key: string, conditions: string[], not: boolean) {
        this.Key = key;
        this.Conditions = conditions;
        this.Not = not;
    }
    static New(key: string, conditions: string[], not: boolean): TypedConditions {
        return new TypedConditions(key, conditions, not);
    }
    Key: string;
    Conditions: string[];
    Not: boolean;
    Validated(): boolean {
        return this.Key !== "";
    }
    Equal(model: TypedConditions): boolean {
        if (this.Key !== model.Key || this.Not !== model.Not) {
            return false;
        }
        if (this.Conditions.length !== model.Conditions.length) {
            return false;
        }
        for (let i = 0; i < this.Conditions.length; i++) {
            if (this.Conditions[i] != model.Conditions[i]) {
                return false;
            }
        }
        return true;
    }
    Clone(): TypedConditions {
        return new TypedConditions(this.Key, [...this.Conditions], this.Not);
    }

}
export class Data {
    constructor(key: string, value: string) {
        this.Key = key;
        this.Value = value;
    }
    static New(key: string, value: string): Data {
        return new Data(key, value);
    }
    public Key: string;
    public Value: string;
    public Validated(): boolean {
        return this.Key !== "" && this.Value !== "";
    }
    public Clone(): Data {
        return new Data(this.Key, this.Value);
    }
    public Equal(model: Data): boolean {
        return this.Key === model.Key && this.Value === model.Value;
    }
}

export enum RegionItemType {
    Room,
    Zone,
}
export class RegionItem {
    constructor(type: RegionItemType, value: string, not: boolean) {
        this.Type = type;
        this.Value = value;
        this.Not = not;
    }
    static New(type: RegionItemType, value: string, not: boolean): RegionItem {
        return new RegionItem(type, value, not);
    }
    Not: boolean;
    Type: RegionItemType;
    Value: string;
    Validated(): boolean {
        return this.Value !== "";
    }
    Clone(): RegionItem {
        return new RegionItem(this.Type, this.Value, this.Not);
    }
    public Equal(model: RegionItem): boolean {
        if (this.Type !== model.Type) return false;
        if (this.Value !== model.Value) return false;
        if (this.Not !== model.Not) return false;
        return true;
    }
}
export class ItemKey {
    public static Validate(key: string): boolean {
        return key != "" && key.indexOf('\n') !== -1;
    }
}