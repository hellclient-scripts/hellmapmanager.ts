

import { RegionItem, RegionItemType, ItemKey } from "./base";
import { ToggleKeyValue, HMMFormatter } from "./formatter";

export class Region {

    Key: string = "";
    Group: string = "";
    Desc: string = "";
    Message: string = "";
    Items: RegionItem[] = [];
    static New(): Region { return new Region() }
    Validated(): boolean {
        return ItemKey.Validate(this.Key);
    }
    Clone(): Region {
        let result = new Region()
        result.Key = this.Key
        result.Group = this.Group
        result.Desc = this.Desc
        result.Items = this.Items.map(d => d.Clone())
        result.Message = this.Message
        return result;
    }
    static EncodeKey: string = "Region";

    public Encode(): string {
        return HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, Region.EncodeKey,
            HMMFormatter.EncodeList(HMMFormatter.Level1, [
                HMMFormatter.Escape(this.Key),//0
                HMMFormatter.Escape(this.Group),//1
                HMMFormatter.Escape(this.Desc),//2
                HMMFormatter.EncodeList(HMMFormatter.Level2, this.Items.map(d => HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level2, ToggleKeyValue.FromRegionItem(d)))),//3
                HMMFormatter.Escape(this.Message),//4
            ])
        );
    }
    public static Decode(val: string): Region {
        let result = new Region();
        let kv = HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, val);
        let list = HMMFormatter.DecodeList(HMMFormatter.Level1, kv.Value);
        result.Key = HMMFormatter.UnescapeAt(list, 0);
        result.Group = HMMFormatter.UnescapeAt(list, 1);
        result.Desc = HMMFormatter.UnescapeAt(list, 2);
        result.Items = HMMFormatter.DecodeList(HMMFormatter.Level2, HMMFormatter.At(list, 3)).map(d => HMMFormatter.DecodeToggleKeyValue(HMMFormatter.Level2, d).ToRegionItem());
        result.Message = HMMFormatter.UnescapeAt(list, 4);
        return result;
    }
    Arrange() {

    }
    static Sort(list: Region[]) {
        list.sort((x, y) => x.Group != y.Group ? (x.Group < y.Group ? -1 : 1) : (x.Key < y.Key ? -1 : 1));
    }

    Equal(model: Region): boolean {
        if (this.Key != model.Key) return false;
        if (this.Group != model.Group) return false;
        if (this.Desc != model.Desc) return false;
        if (this.Message != model.Message) return false;
        if (this.Items.length != model.Items.length) return false;
        for (let i: number = 0; i < this.Items.length; i++) {
            if (!this.Items[i].Equal(model.Items[i])) return false;
        }
        return true;

    }
}