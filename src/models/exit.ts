import { ValueCondition } from "./base";
export class Exit {
    public Exit() { }
    //路径指令
    public Command: string = "";
    //目标房间
    public To: string = "";
    public Conditions: ValueCondition[] = [];
    public Cost: number = 1;
    Validated(): boolean {
        return this.Command != "";
    }
    public Clone(): Exit {
        let model: Exit = new Exit();
        model.Command = this.Command;
        model.To = this.To;
        model.Conditions = this.Conditions.map(m => m.Clone());
        model.Cost = this.Cost;
        return model;
    }

    Equal(model: Exit): boolean {
        if (this.Command !== model.Command || this.To !== model.To || this.Cost !== model.Cost) {
            return false;
        }
        if (this.Conditions.length != model.Conditions.length) {
            return false;
        }
        for (var i = 0; i < this.Conditions.length; i++) {
            if (!this.Conditions[i].Equal(model.Conditions[i])) {
                return false;
            }
        }
        return true;
    }
    Arrange() {
        this.Conditions.sort(((x, y) => {
            if (x.Not == y.Not) {
                return x.Key < y.Key ? -1 : 1;
            }
            else {
                return x.Not < y.Not ? -1 : 1;
            }
        }));
    }
}
