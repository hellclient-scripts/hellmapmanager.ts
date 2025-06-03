
import { assert } from "chai";
import { RegionItem, RegionItemType, Condition } from '../src/models/base';
import { HMMFormatter, KeyValue, ToggleKeyValues, ToggleKeyValue, ToggleValue } from '../src/models/formatter';


describe("Formtter Test", () => {
    it("TestBasic", () => {
        assert.equal("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n\\^\\`", HMMFormatter.Escaper.Pack(HMMFormatter.Escape(">:=@!;\\,&!\n^`")));
        assert.equal(">:=@!;\\,&!\n>:=@!;,&!\n^`", HMMFormatter.Unescape(HMMFormatter.Escaper.Unpack("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n>:=@!;,&!\n\\^\\`")));
        assert.equal(">:=@!;,&!\n^`", HMMFormatter.Escaper.Pack(HMMFormatter.Unescape(HMMFormatter.Escape(">:=@!;,&!\n^`"))));
    })
    function IsListEqual(src: string[], dst: string[]) {
        assert.equal(src.length, dst.length);

        for (var i = 0; i < src.length; i++) {
            assert.equal(src[i], dst[i]);
        }
    }
    it("TestList", () => {

        let list: string[] = ["1", "2", "\n", "", "", "|", ",", ";", "&", "^", "`", "\\"].map(d => HMMFormatter.Escaper.Unpack(d)).map(d=>HMMFormatter.Escape(d));
        var unescapedList = HMMFormatter.UnescapeList(list);
        assert.equal(HMMFormatter.Level1.SepToken.EncodedCode, HMMFormatter.At(list, 5));
        assert.equal("", HMMFormatter.At(list, -1));
        assert.equal("", HMMFormatter.At(list, 99));
        assert.equal("|", HMMFormatter.UnescapeAt(list, 5));
        assert.equal("", HMMFormatter.UnescapeAt(list, -1));
        assert.equal("", HMMFormatter.UnescapeAt(list, 99));
        IsListEqual(list, HMMFormatter.EscapeList(unescapedList));
        IsListEqual(list, HMMFormatter.DecodeList(HMMFormatter.Level1, HMMFormatter.EncodeList(HMMFormatter.Level1, list)));
        IsListEqual([], HMMFormatter.DecodeList(HMMFormatter.Level1, ""));
        IsListEqual(list, HMMFormatter.DecodeList(HMMFormatter.Level2, HMMFormatter.EncodeList(HMMFormatter.Level2, list)));
        IsListEqual([], HMMFormatter.DecodeList(HMMFormatter.Level2, ""));
        IsListEqual(list, HMMFormatter.DecodeList(HMMFormatter.Level3, HMMFormatter.EncodeList(HMMFormatter.Level3, list)));
        IsListEqual([], HMMFormatter.DecodeList(HMMFormatter.Level3, ""));
        IsListEqual(list, HMMFormatter.DecodeList(HMMFormatter.Level4, HMMFormatter.EncodeList(HMMFormatter.Level4, list)));
        IsListEqual([], HMMFormatter.DecodeList(HMMFormatter.Level4, ""));

        assert.notEqual(HMMFormatter.EncodeList(HMMFormatter.Level1, list), HMMFormatter.EncodeList(HMMFormatter.Level2, list));
        assert.notEqual(HMMFormatter.EncodeList(HMMFormatter.Level1, list), HMMFormatter.EncodeList(HMMFormatter.Level3, list));
        assert.notEqual(HMMFormatter.EncodeList(HMMFormatter.Level1, list), HMMFormatter.EncodeList(HMMFormatter.Level4, list));
        assert.notEqual(HMMFormatter.EncodeList(HMMFormatter.Level2, list), HMMFormatter.EncodeList(HMMFormatter.Level3, list));
        assert.notEqual(HMMFormatter.EncodeList(HMMFormatter.Level2, list), HMMFormatter.EncodeList(HMMFormatter.Level4, list));
        assert.notEqual(HMMFormatter.EncodeList(HMMFormatter.Level3, list), HMMFormatter.EncodeList(HMMFormatter.Level4, list));
    })
    function IsKeyValueEqual(src: KeyValue, dst: KeyValue) {
        assert.equal(src.Key, dst.Key);
        assert.equal(src.Value, dst.Value);
    }

    it("TestKeyValue", () => {

        var kv = new KeyValue(HMMFormatter.Escaper.Unpack("\\>\\!\\=\\@\\^"), HMMFormatter.Escaper.Unpack("\\^\\@\\=\\!\\>"));
        var kv2 = new KeyValue("key", "");
        assert.equal(">!=@^", kv.UnescapeKey());
        assert.equal("^@=!>", kv.UnescapeValue());
        var data = kv.ToData();
        assert.equal(">!=@^", data.Key);
        assert.equal("^@=!>", data.Value);
        IsKeyValueEqual(kv, KeyValue.FromData(data));

        IsKeyValueEqual(kv, HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, HMMFormatter.EncodeKeyValue(HMMFormatter.Level1, kv)));
        assert.equal(HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level1, kv.Key, kv.Value), HMMFormatter.EncodeKeyValue(HMMFormatter.Level1, kv));
        assert.equal(`key${HMMFormatter.Level1.KeyToken.Raw}`, HMMFormatter.EncodeKeyValue(HMMFormatter.Level1, kv2));
        IsKeyValueEqual(kv2, HMMFormatter.DecodeKeyValue(HMMFormatter.Level1, "key"));

        IsKeyValueEqual(kv, HMMFormatter.DecodeKeyValue(HMMFormatter.Level2, HMMFormatter.EncodeKeyValue(HMMFormatter.Level2, kv)));
        assert.equal(HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level2, kv.Key, kv.Value), HMMFormatter.EncodeKeyValue(HMMFormatter.Level2, kv));
        assert.equal(`key${HMMFormatter.Level2.KeyToken.Raw}`, HMMFormatter.EncodeKeyValue(HMMFormatter.Level2, kv2));
        IsKeyValueEqual(kv2, HMMFormatter.DecodeKeyValue(HMMFormatter.Level2, "key"));

        IsKeyValueEqual(kv, HMMFormatter.DecodeKeyValue(HMMFormatter.Level3, HMMFormatter.EncodeKeyValue(HMMFormatter.Level3, kv)));
        assert.equal(HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level3, kv.Key, kv.Value), HMMFormatter.EncodeKeyValue(HMMFormatter.Level3, kv));
        assert.equal(`key${HMMFormatter.Level3.KeyToken.Raw}`, HMMFormatter.EncodeKeyValue(HMMFormatter.Level3, kv2));
        IsKeyValueEqual(kv2, HMMFormatter.DecodeKeyValue(HMMFormatter.Level3, "key"));

        IsKeyValueEqual(kv, HMMFormatter.DecodeKeyValue(HMMFormatter.Level4, HMMFormatter.EncodeKeyValue(HMMFormatter.Level4, kv)));
        assert.equal(HMMFormatter.EncodeKeyAndValue(HMMFormatter.Level4, kv.Key, kv.Value), HMMFormatter.EncodeKeyValue(HMMFormatter.Level4, kv));
        assert.equal(`key${HMMFormatter.Level4.KeyToken.Raw}`, HMMFormatter.EncodeKeyValue(HMMFormatter.Level4, kv2));
        IsKeyValueEqual(kv2, HMMFormatter.DecodeKeyValue(HMMFormatter.Level4, "key"));

        assert.notEqual(HMMFormatter.EncodeKeyValue(HMMFormatter.Level1, kv), HMMFormatter.EncodeKeyValue(HMMFormatter.Level2, kv));
        assert.notEqual(HMMFormatter.EncodeKeyValue(HMMFormatter.Level1, kv), HMMFormatter.EncodeKeyValue(HMMFormatter.Level3, kv));
        assert.notEqual(HMMFormatter.EncodeKeyValue(HMMFormatter.Level1, kv), HMMFormatter.EncodeKeyValue(HMMFormatter.Level4, kv));
        assert.notEqual(HMMFormatter.EncodeKeyValue(HMMFormatter.Level2, kv), HMMFormatter.EncodeKeyValue(HMMFormatter.Level3, kv));
        assert.notEqual(HMMFormatter.EncodeKeyValue(HMMFormatter.Level2, kv), HMMFormatter.EncodeKeyValue(HMMFormatter.Level4, kv));
        assert.notEqual(HMMFormatter.EncodeKeyValue(HMMFormatter.Level3, kv), HMMFormatter.EncodeKeyValue(HMMFormatter.Level4, kv));

    })

    function IsToggleKeyValuesEqual(src: ToggleKeyValues, dst: ToggleKeyValues) {
        assert.equal(src.Key, dst.Key);
        assert.equal(src.Not, dst.Not);
        IsListEqual(src.Values, dst.Values);
    }

    it("TestToggleKeyValues", () => {
        var tkv = new ToggleKeyValues(HMMFormatter.Escaper.Unpack("\\>\\:\\=\\@\\|\\;\\,\\&\\!\\^\\`"),
            [
                HMMFormatter.Escaper.Unpack(""), HMMFormatter.Escaper.Unpack("\\>"), HMMFormatter.Escaper.Unpack("\\:"), HMMFormatter.Escaper.Unpack("\\="), HMMFormatter.Escaper.Unpack("\\@"),
                HMMFormatter.Escaper.Unpack("\\|"), HMMFormatter.Escaper.Unpack("\\;"), HMMFormatter.Escaper.Unpack("\\,"), HMMFormatter.Escaper.Unpack("\\&"), HMMFormatter.Escaper.Unpack("\\!"),
                HMMFormatter.Escaper.Unpack("\\^"), HMMFormatter.Escaper.Unpack("\\`")
            ],
            true);
        assert.equal(">:=@|;,&!^`", tkv.ToTypedConditions().Key);
        IsListEqual(["", ">", ":", "=", "@", "|", ";", ",", "&", "!", "^", "`"], tkv.ToTypedConditions().Conditions);
        assert.isTrue(tkv.ToTypedConditions().Not);

        var tkv2 = new ToggleKeyValues("", [], false);
        assert.equal("", tkv2.ToTypedConditions().Key);
        IsListEqual([], tkv2.ToTypedConditions().Conditions);
        assert.isFalse(tkv2.ToTypedConditions().Not);

        IsToggleKeyValuesEqual(tkv, ToggleKeyValues.FromTypedConditions(tkv.ToTypedConditions()));

        IsToggleKeyValuesEqual(tkv, HMMFormatter.DecodeToggleKeyValues(HMMFormatter.Level1, HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level1, tkv)));
        IsToggleKeyValuesEqual(tkv, HMMFormatter.DecodeToggleKeyValues(HMMFormatter.Level2, HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level2, tkv)));
        IsToggleKeyValuesEqual(tkv, HMMFormatter.DecodeToggleKeyValues(HMMFormatter.Level3, HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level3, tkv)));
        IsToggleKeyValuesEqual(tkv, HMMFormatter.DecodeToggleKeyValues(HMMFormatter.Level4, HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level4, tkv)));

        assert.notEqual(HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level1, tkv), HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level2, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level1, tkv), HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level3, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level1, tkv), HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level4, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level2, tkv), HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level3, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level2, tkv), HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level4, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level3, tkv), HMMFormatter.EncodeToggleKeyValues(HMMFormatter.Level4, tkv));
    })

    function IsToggleKeyValueEqual(src: ToggleKeyValue, dst: ToggleKeyValue) {
        assert.equal(src.Key, dst.Key);
        assert.equal(src.Not, dst.Not);
        assert.equal(src.Value, dst.Value);
    }


    it("TestToggleKeyValue", () => {
        var tkv = new ToggleKeyValue(
            HMMFormatter.Escaper.Unpack("\\>\\:\\=\\@\\|\\;\\,\\&\\!\\^\\`"),
            HMMFormatter.Escaper.Unpack("\\`\\^\\!\\&\\,\\;\\|\\@\\=\\:\\>"),
            true
        );
        assert.equal(">:=@|;,&!^`", tkv.UnescapeKey());
        assert.equal("`^!&,;|@=:>", tkv.UnescapeValue());
        assert.isTrue(tkv.Not);
        var tkv2 = new ToggleKeyValue("", "", false);
        assert.equal("", tkv2.UnescapeKey());
        assert.equal("", tkv2.UnescapeValue());
        assert.isFalse(tkv2.Not);
        let ri: RegionItem;
        let tkvri: ToggleKeyValue;
        ri = new ToggleKeyValue("Room", "RoomValue", true).ToRegionItem();
        assert.equal(RegionItemType.Room, ri.Type);
        assert.equal("RoomValue", ri.Value);
        assert.isTrue(ri.Not);

        tkvri = ToggleKeyValue.FromRegionItem(ri);
        assert.equal("Room", tkvri.UnescapeKey());
        assert.equal("RoomValue", tkvri.UnescapeValue());
        assert.isTrue(tkvri.Not);

        ri = new ToggleKeyValue("Zone", "ZoneValue", false).ToRegionItem();
        assert.equal(RegionItemType.Zone, ri.Type);
        assert.equal("ZoneValue", ri.Value);
        assert.isFalse(ri.Not);

        tkvri = ToggleKeyValue.FromRegionItem(ri);
        assert.equal("Zone", tkvri.UnescapeKey());
        assert.equal("ZoneValue", tkvri.UnescapeValue());
        assert.isFalse(tkvri.Not);


        ri = new ToggleKeyValue("Other", "OtherValue", true).ToRegionItem();
        assert.equal(RegionItemType.Zone, ri.Type);
        assert.equal("OtherValue", ri.Value);
        assert.isTrue(ri.Not);

        tkvri = ToggleKeyValue.FromRegionItem(ri);
        assert.equal("Zone", tkvri.UnescapeKey());
        assert.equal("OtherValue", tkvri.UnescapeValue());
        assert.isTrue(tkvri.Not);


        IsToggleKeyValueEqual(tkv, HMMFormatter.DecodeToggleKeyValue(HMMFormatter.Level1, HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level1, tkv)));
        IsToggleKeyValueEqual(tkv, HMMFormatter.DecodeToggleKeyValue(HMMFormatter.Level2, HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level2, tkv)));
        IsToggleKeyValueEqual(tkv, HMMFormatter.DecodeToggleKeyValue(HMMFormatter.Level3, HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level3, tkv)));
        IsToggleKeyValueEqual(tkv, HMMFormatter.DecodeToggleKeyValue(HMMFormatter.Level4, HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level4, tkv)));

        assert.notEqual(HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level1, tkv), HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level2, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level1, tkv), HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level3, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level1, tkv), HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level4, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level2, tkv), HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level3, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level2, tkv), HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level4, tkv));
        assert.notEqual(HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level3, tkv), HMMFormatter.EncodeToggleKeyValue(HMMFormatter.Level4, tkv));
    })
    it("TestInt", () => {
        assert.equal(1, HMMFormatter.UnescapeInt("1", 0));
        assert.equal(-1, HMMFormatter.UnescapeInt("-1", 0));
        assert.equal(1, HMMFormatter.UnescapeInt("a", 1));
        assert.equal(2, HMMFormatter.UnescapeInt("0.1", 2));
        let list: string[] = ["1", "-1", "a", "0.1"];
        assert.equal(99, HMMFormatter.UnescapeIntAt(list, -1, 99));
        assert.equal(99, HMMFormatter.UnescapeIntAt(list, 100, 99));
        assert.equal(1, HMMFormatter.UnescapeIntAt(list, 0, 99));
        assert.equal(-1, HMMFormatter.UnescapeIntAt(list, 1, 99));
        assert.equal(99, HMMFormatter.UnescapeIntAt(list, 2, 99));
        assert.equal(99, HMMFormatter.UnescapeIntAt(list, 3, 99));
    })
    function IsToggleValueEqual(src: ToggleValue, dst: ToggleValue) {
        assert.equal(src.Not, dst.Not);
        assert.equal(src.Value, dst.Value);
    }
    it("TestToggleValue", () => {
        var tv = new ToggleValue(HMMFormatter.Escaper.Unpack("\\>\\:\\=\\@\\|\\;\\,\\&\\!\\^\\`"), true);
        assert.equal(">:=@|;,&!^`", tv.UnescapeValue());
        assert.isTrue(tv.Not);
        IsToggleValueEqual(tv, HMMFormatter.DecodeToggleValue(HMMFormatter.EncodeToggleValue(tv)));

        var tv2 = new ToggleValue(HMMFormatter.Escaper.Unpack(""), false);
        assert.equal("", tv2.UnescapeValue());
        assert.isFalse(tv2.Not);
        IsToggleValueEqual(tv2, HMMFormatter.DecodeToggleValue(HMMFormatter.EncodeToggleValue(tv2)));
        let co: Condition;
        co = tv.ToCondition();
        assert.equal(">:=@|;,&!^`", co.Key);
        assert.isTrue(co.Not);
        var tvco = ToggleValue.FromCondition(co);
        assert.equal(">:=@|;,&!^`", tvco.UnescapeValue());
        assert.isTrue(tvco.Not);
    })
})

