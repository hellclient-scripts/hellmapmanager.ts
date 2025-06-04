import { Exit } from "./exit";
import { ValueCondition, ItemKey } from "./base";
import { HMMFormatter, ToggleKeyValue } from "./formatter";

export class RoomConditionExit extends Exit {
    RoomConditions: ValueCondition[] = [];
    static New(): RoomConditionExit {
        return new RoomConditionExit();
    }
}
export class Shortcut extends RoomConditionExit {
    Key: string = "";
    Group: string = "";
    Desc: string = "";
    static New(): Shortcut {
        return new Shortcut();
    }
    Validated(): boolean {
        return ItemKey.Validate(this.Key) && super.Validated();
    }
    static EncodeKey: string = "Shortcut";

    Clone(): Shortcut {
        let result = new Shortcut()
        result.Key = this.Key
        result.Command = this.Command
        result.To = this.To
        result.RoomConditions = this.RoomConditions.map(d => d.Clone())
        result.Conditions = this.Conditions.map(d => d.Clone())
        result.Cost = this.Cost
        result.Group = this.Group
        result.Desc = this.Desc
        return result;
    }
    Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, Shortcut.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Key),//0
                HMMFormatter.Escape(this.Group),//1
                HMMFormatter.Escape(this.Desc),//2
                HMMFormatter.EncodeList(HMMFormatter.Level2, this.RoomConditions.map(d => HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level3, ToggleKeyValue.FromValueCondition(d)))),//3
                HMMFormatter.Escape(this.Command),//4
                HMMFormatter.Escape(this.To),//5
                HMMFormatter.EncodeList(HMMFormatter.Level2, this.Conditions.map(d => HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level3, ToggleKeyValue.FromValueCondition(d)))),//6
                HMMFormatter.Escape(HMMFormatter.Escape(this.Cost.toString())),//7
            ])
        );
    }
    static Decode(val: string): Shortcut {
        let result = new Shortcut();
        let kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        let list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Key = HMMFormatter.UnescapeAt(list, 0);
        result.Group = HMMFormatter.UnescapeAt(list, 1);
        result.Desc = HMMFormatter.UnescapeAt(list, 2);
        result.RoomConditions = HMMFormatter.DecodeList(HMMFormatter.Level2, HMMFormatter.At(list, 3)).map(d => HMMFormatter.DecodeToggleKeyValue(HMMFormatter.Level3, d).ToValueCondition());
        result.Command = HMMFormatter.UnescapeAt(list, 4);
        result.To = HMMFormatter.UnescapeAt(list, 5);
        result.Conditions = HMMFormatter.DecodeList(HMMFormatter.Level2, HMMFormatter.At(list, 6)).map(d => HMMFormatter.DecodeToggleKeyValue(HMMFormatter.Level3, d).ToValueCondition());
        result.Cost = HMMFormatter.UnescapeIntAt(list, 7, 0);
        return result;
    }
    Equal(model: Shortcut): boolean {
        if (this.Key !== model.Key || this.Command !== model.Command || this.To !== model.To || this.Group !== model.Group || this.Desc !== model.Desc || this.Cost !== model.Cost) {
            return false;
        }
        if (this.RoomConditions.length != model.RoomConditions.length) {
            return false;
        }
        for (let i = 0; i < this.RoomConditions.length; i++) {
            if (!this.RoomConditions[i].Equal(model.RoomConditions[i])) {
                return false;
            }
        }
        if (this.Conditions.length != model.Conditions.length) {
            return false;
        }
        for (let i = 0; i < this.Conditions.length; i++) {
            if (!this.Conditions[i].Equal(model.Conditions[i])) {
                return false;
            }
        }
        return true;
    }
    Arrange() {
        super.Arrange();
        this.RoomConditions.sort(((x, y) => {
            if (x.Not == y.Not) {
                return x.Key < y.Key ? -1 : 1;
            }
            else {
                return x.Not < y.Not ? -1 : 1;
            }
        }));
    }
    static Sort(list: Shortcut[]) {
        list.sort((x, y) => x.Group != y.Group ? (x.Group < y.Group ? -1 : 1) : x.Key < y.Key ? -1 : 1);
    }
}