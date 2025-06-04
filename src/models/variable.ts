import { ItemKey } from "./base";
import { HMMFormatter } from "./formatter";


export class Variable {
    Key: string = "";
    Value: string = "";
    Group: string = "";
    Desc: string = "";
    static New(): Variable { return new Variable(); }
    Validated(): boolean {
        return ItemKey.Validate(this.Key);
    }
    static EncodeKey: string = "Variable";

    public Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, Variable.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Key),//0
                HMMFormatter.Escape(this.Value),//1
                HMMFormatter.Escape(this.Group),//2
                HMMFormatter.Escape(this.Desc),//3
            ])
        );
    }
    static Decode(val: string): Variable {
        let result = new Variable();
        let kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        let list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Key = HMMFormatter.UnescapeAt(list, 0);
        result.Value = HMMFormatter.UnescapeAt(list, 1);
        result.Group = HMMFormatter.UnescapeAt(list, 2);
        result.Desc = HMMFormatter.UnescapeAt(list, 3);
        return result;
    }
    public Clone(): Variable {
        let result = new Variable();

        result.Key = this.Key
        result.Value = this.Value
        result.Group = this.Group
        result.Desc = this.Desc
        return result;
    }
    public Equal(model: Variable): boolean {
        if (this.Key === model.Key && this.Value === model.Value && this.Group === model.Group && this.Desc === model.Desc) {
            return true;
        }
        return false;
    }
    public Arrange() { }
    static Sort(list: Variable[]) {
        list.sort((x, y) => x.Group != y.Group ? (x.Group < y.Group ? -1 : 1) : (x.Key < y.Key ? -1 : 1));
    }
}