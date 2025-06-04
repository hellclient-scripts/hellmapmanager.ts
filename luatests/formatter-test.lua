local lu = require('luatests/luaunit')
local hmm = require('dist/hmm')


function TestBasic()
    lu.assertEquals("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n\\^\\`",
        hmm.HMMFormatter.Escaper:Pack(hmm.HMMFormatter:Escape(">:=@!;\\,&!\n^`")));
    lu.assertEquals(">:=@!;\\,&!\n>:=@!;,&!\n^`",
        hmm.HMMFormatter:Unescape(hmm.HMMFormatter.Escaper:Unpack("\\>\\:\\=\\@\\!\\;\\\\\\,\\&\\!\\n>:=@!;,&!\n\\^\\`")));
    lu.assertEquals(">:=@!;,&!\n^`",
        hmm.HMMFormatter.Escaper:Pack(hmm.HMMFormatter:Unescape(hmm.HMMFormatter:Escape(">:=@!;,&!\n^`"))));
end

function IsListEqual(src, dst)
    lu.assertEquals(src.length, dst.length);

    for i = 0, #src - 1, 1 do
        lu.assertEquals(src[i], dst[i]);
    end
end

function TestList()
    local list = { "1", "2", "\n", "", "", "|", ",", ";", "&", "^", "`", "\\" }
    for index, value in ipairs(list) do
        list[index] = hmm.HMMFormatter.Escaper:Unpack(value)
    end
    for index, value in ipairs(list) do
        list[index] = hmm.HMMFormatter:Escape(value)
    end
    local unescapedList = hmm.HMMFormatter:UnescapeList(list);
    lu.assertEquals(hmm.HMMFormatter.Level1.SepToken.EncodedCode, hmm.HMMFormatter:At(list, 5));
    lu.assertEquals("", hmm.HMMFormatter:At(list, -1));
    lu.assertEquals("", hmm.HMMFormatter:At(list, 99));
    lu.assertEquals("|", hmm.HMMFormatter:UnescapeAt(list, 5));
    lu.assertEquals("", hmm.HMMFormatter:UnescapeAt(list, -1));
    lu.assertEquals("", hmm.HMMFormatter:UnescapeAt(list, 99));
    IsListEqual(list, hmm.HMMFormatter:EscapeList(unescapedList));
    IsListEqual(list,
        hmm.HMMFormatter:DecodeList(hmm.HMMFormatter.Level1, hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level1, list)));
    IsListEqual({}, hmm.HMMFormatter:DecodeList(hmm.HMMFormatter.Level1, ""));
    IsListEqual(list,
        hmm.HMMFormatter:DecodeList(hmm.HMMFormatter.Level2, hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level2, list)));
    IsListEqual({}, hmm.HMMFormatter:DecodeList(hmm.HMMFormatter.Level2, ""));
    IsListEqual(list,
        hmm.HMMFormatter:DecodeList(hmm.HMMFormatter.Level3, hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level3, list)));
    IsListEqual({}, hmm.HMMFormatter:DecodeList(hmm.HMMFormatter.Level3, ""));
    IsListEqual(list,
        hmm.HMMFormatter:DecodeList(hmm.HMMFormatter.Level4, hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level4, list)));
    IsListEqual({}, hmm.HMMFormatter:DecodeList(hmm.HMMFormatter.Level4, ""));

    lu.assertNotEquals(hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level1, list),
        hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level2, list));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level1, list),
        hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level3, list));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level1, list),
        hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level4, list));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level2, list),
        hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level3, list));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level2, list),
        hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level4, list));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level3, list),
        hmm.HMMFormatter:EncodeList(hmm.HMMFormatter.Level4, list));
end

function IsKeyValueEqual(src, dst)
    lu.assertEquals(src.Key, dst.Key);
    lu.assertEquals(src.Value, dst.Value);
end

function TestKeyValue()
    local kv = hmm.KeyValue:New(hmm.HMMFormatter.Escaper:Unpack("\\>\\!\\=\\@\\^"),
        hmm.HMMFormatter.Escaper:Unpack("\\^\\@\\=\\!\\>"));
    local kv2 = hmm.KeyValue:New("key", "");
    lu.assertEquals(">!=@^", kv:UnescapeKey());
    lu.assertEquals("^@=!>", kv:UnescapeValue());
    local data = kv:ToData();
    lu.assertEquals(">!=@^", data.Key);
    lu.assertEquals("^@=!>", data.Value);
    IsKeyValueEqual(kv, hmm.KeyValue:FromData(data));

    IsKeyValueEqual(kv,
        hmm.HMMFormatter:DecodeKeyValue(hmm.HMMFormatter.Level1,
            hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level1, kv)));
    lu.assertEquals(hmm.HMMFormatter:EncodeKeyAndValue(hmm.HMMFormatter.Level1, kv.Key, kv.Value),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level1, kv));
    lu.assertEquals("key" .. hmm.HMMFormatter.Level1.KeyToken.Raw,
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level1, kv2));
    IsKeyValueEqual(kv2, hmm.HMMFormatter:DecodeKeyValue(hmm.HMMFormatter.Level1, "key"));

    IsKeyValueEqual(kv,
        hmm.HMMFormatter:DecodeKeyValue(hmm.HMMFormatter.Level2,
            hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level2, kv)));
    lu.assertEquals(hmm.HMMFormatter:EncodeKeyAndValue(hmm.HMMFormatter.Level2, kv.Key, kv.Value),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level2, kv));
    lu.assertEquals("key" .. hmm.HMMFormatter.Level2.KeyToken.Raw,
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level2, kv2));
    IsKeyValueEqual(kv2, hmm.HMMFormatter:DecodeKeyValue(hmm.HMMFormatter.Level2, "key"));

    IsKeyValueEqual(kv,
        hmm.HMMFormatter:DecodeKeyValue(hmm.HMMFormatter.Level3,
            hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level3, kv)));
    lu.assertEquals(hmm.HMMFormatter:EncodeKeyAndValue(hmm.HMMFormatter.Level3, kv.Key, kv.Value),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level3, kv));
    lu.assertEquals("key" .. hmm.HMMFormatter.Level3.KeyToken.Raw,
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level3, kv2));
    IsKeyValueEqual(kv2, hmm.HMMFormatter:DecodeKeyValue(hmm.HMMFormatter.Level3, "key"));

    IsKeyValueEqual(kv,
        hmm.HMMFormatter:DecodeKeyValue(hmm.HMMFormatter.Level4,
            hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level4, kv)));
    lu.assertEquals(hmm.HMMFormatter:EncodeKeyAndValue(hmm.HMMFormatter.Level4, kv.Key, kv.Value),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level4, kv));
    lu.assertEquals("key" .. hmm.HMMFormatter.Level4.KeyToken.Raw,
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level4, kv2));
    IsKeyValueEqual(kv2, hmm.HMMFormatter:DecodeKeyValue(hmm.HMMFormatter.Level4, "key"));

    lu.assertNotEquals(hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level1, kv),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level2, kv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level1, kv),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level3, kv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level1, kv),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level4, kv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level2, kv),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level3, kv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level2, kv),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level4, kv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level3, kv),
        hmm.HMMFormatter:EncodeKeyValue(hmm.HMMFormatter.Level4, kv));
end

function IsToggleKeyValuesEqual(src, dst)
    lu.assertEquals(src.Key, dst.Key);
    lu.assertEquals(src.Not, dst.Not);
    IsListEqual(src.Values, dst.Values);
end

function TestToggleKeyValues()
    local tkv = hmm.ToggleKeyValues:New(hmm.HMMFormatter.Escaper:Unpack("\\>\\:\\=\\@\\|\\;\\,\\&\\!\\^\\`"),
        {
            hmm.HMMFormatter.Escaper:Unpack(""), hmm.HMMFormatter.Escaper:Unpack("\\>"), hmm.HMMFormatter.Escaper:Unpack(
        "\\:"), hmm.HMMFormatter.Escaper:Unpack("\\="), hmm.HMMFormatter.Escaper:Unpack("\\@"),
            hmm.HMMFormatter.Escaper:Unpack("\\|"), hmm.HMMFormatter.Escaper:Unpack("\\;"), hmm.HMMFormatter.Escaper
            :Unpack("\\,"), hmm.HMMFormatter.Escaper:Unpack("\\&"), hmm.HMMFormatter.Escaper:Unpack("\\!"),
            hmm.HMMFormatter.Escaper:Unpack("\\^"), hmm.HMMFormatter.Escaper:Unpack("\\`")
        },
        true);
    lu.assertEquals(">:=@|;,&!^`", tkv:ToTypedConditions().Key);
    IsListEqual({ "", ">", ":", "=", "@", "|", ";", ",", "&", "!", "^", "`" }, tkv:ToTypedConditions().Conditions);
    lu.assertTrue(tkv:ToTypedConditions().Not);

    local tkv2 = hmm.ToggleKeyValues:New("", {}, false);
    lu.assertEquals("", tkv2:ToTypedConditions().Key);
    IsListEqual({}, tkv2:ToTypedConditions().Conditions);
    lu.assertFalse(tkv2:ToTypedConditions().Not);

    IsToggleKeyValuesEqual(tkv, hmm.ToggleKeyValues:FromTypedConditions(tkv:ToTypedConditions()));

    IsToggleKeyValuesEqual(tkv,
        hmm.HMMFormatter:DecodeToggleKeyValues(hmm.HMMFormatter.Level1,
            hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level1, tkv)));
    IsToggleKeyValuesEqual(tkv,
        hmm.HMMFormatter:DecodeToggleKeyValues(hmm.HMMFormatter.Level2,
            hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level2, tkv)));
    IsToggleKeyValuesEqual(tkv,
        hmm.HMMFormatter:DecodeToggleKeyValues(hmm.HMMFormatter.Level3,
            hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level3, tkv)));
    IsToggleKeyValuesEqual(tkv,
        hmm.HMMFormatter:DecodeToggleKeyValues(hmm.HMMFormatter.Level4,
            hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level4, tkv)));

    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level1, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level2, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level1, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level3, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level1, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level4, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level2, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level3, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level2, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level4, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level3, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValues(hmm.HMMFormatter.Level4, tkv));
end

function IsToggleKeyValueEqual(src, dst)
    lu.assertEquals(src.Key, dst.Key);
    lu.assertEquals(src.Not, dst.Not);
    lu.assertEquals(src.Value, dst.Value);
end

function TestToggleKeyValue()
    local tkv = hmm.ToggleKeyValue:New(
        hmm.HMMFormatter.Escaper:Unpack("\\>\\:\\=\\@\\|\\;\\,\\&\\!\\^\\`"),
        hmm.HMMFormatter.Escaper:Unpack("\\`\\^\\!\\&\\,\\;\\|\\@\\=\\:\\>"),
        true
    );
    lu.assertEquals(">:=@|;,&!^`", tkv:UnescapeKey());
    lu.assertEquals("`^!&,;|@=:>", tkv:UnescapeValue());
    lu.assertTrue(tkv.Not);
    local tkv2 = hmm.ToggleKeyValue:New("", "", false);
    lu.assertEquals("", tkv2:UnescapeKey());
    lu.assertEquals("", tkv2:UnescapeValue());
    lu.assertFalse(tkv2.Not);
    local ri
    local tkvri
    ri = hmm.ToggleKeyValue:New("Room", "RoomValue", true):ToRegionItem();
    lu.assertEquals(hmm.RegionItemType.Room, ri.Type);
    lu.assertEquals("RoomValue", ri.Value);
    lu.assertTrue(ri.Not);

    tkvri = hmm.ToggleKeyValue:FromRegionItem(ri);
    lu.assertEquals("Room", tkvri:UnescapeKey());
    lu.assertEquals("RoomValue", tkvri:UnescapeValue());
    lu.assertTrue(tkvri.Not);

    ri = hmm.ToggleKeyValue:New("Zone", "ZoneValue", false):ToRegionItem();
    lu.assertEquals(hmm.RegionItemType.Zone, ri.Type);
    lu.assertEquals("ZoneValue", ri.Value);
    lu.assertFalse(ri.Not);

    tkvri = hmm.ToggleKeyValue:FromRegionItem(ri);
    lu.assertEquals("Zone", tkvri:UnescapeKey());
    lu.assertEquals("ZoneValue", tkvri:UnescapeValue());
    lu.assertFalse(tkvri.Not);


    ri = hmm.ToggleKeyValue:New("Other", "OtherValue", true):ToRegionItem();
    lu.assertEquals(hmm.RegionItemType.Zone, ri.Type);
    lu.assertEquals("OtherValue", ri.Value);
    lu.assertTrue(ri.Not);

    tkvri = hmm.ToggleKeyValue:FromRegionItem(ri);
    lu.assertEquals("Zone", tkvri:UnescapeKey());
    lu.assertEquals("OtherValue", tkvri:UnescapeValue());
    lu.assertTrue(tkvri.Not);


    IsToggleKeyValueEqual(tkv,
        hmm.HMMFormatter:DecodeToggleKeyValue(hmm.HMMFormatter.Level1,
            hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level1, tkv)));
    IsToggleKeyValueEqual(tkv,
        hmm.HMMFormatter:DecodeToggleKeyValue(hmm.HMMFormatter.Level2,
            hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level2, tkv)));
    IsToggleKeyValueEqual(tkv,
        hmm.HMMFormatter:DecodeToggleKeyValue(hmm.HMMFormatter.Level3,
            hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level3, tkv)));
    IsToggleKeyValueEqual(tkv,
        hmm.HMMFormatter:DecodeToggleKeyValue(hmm.HMMFormatter.Level4,
            hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level4, tkv)));

    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level1, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level2, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level1, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level3, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level1, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level4, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level2, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level3, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level2, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level4, tkv));
    lu.assertNotEquals(hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level3, tkv),
        hmm.HMMFormatter:EncodeToggleKeyValue(hmm.HMMFormatter.Level4, tkv));
end

function TestInt()
    lu.assertEquals(1, hmm.HMMFormatter:UnescapeInt("1", 0));
    lu.assertEquals(-1, hmm.HMMFormatter:UnescapeInt("-1", 0));
    lu.assertEquals(1, hmm.HMMFormatter:UnescapeInt("a", 1));
    lu.assertEquals(2, hmm.HMMFormatter:UnescapeInt("0.1", 2));
    local list = { "1", "-1", "a", "0.1" };
    lu.assertEquals(99, hmm.HMMFormatter:UnescapeIntAt(list, -1, 99));
    lu.assertEquals(99, hmm.HMMFormatter:UnescapeIntAt(list, 100, 99));
    lu.assertEquals(1, hmm.HMMFormatter:UnescapeIntAt(list, 0, 99));
    lu.assertEquals(-1, hmm.HMMFormatter:UnescapeIntAt(list, 1, 99));
    lu.assertEquals(99, hmm.HMMFormatter:UnescapeIntAt(list, 2, 99));
    lu.assertEquals(99, hmm.HMMFormatter:UnescapeIntAt(list, 3, 99));
end

function IsToggleValueEqual(src, dst)
    lu.assertEquals(src.Not, dst.Not);
    lu.assertEquals(src.Value, dst.Value);
end

function TestToggleValu()
    local tv = hmm.ToggleValue:New(hmm.HMMFormatter.Escaper:Unpack("\\>\\:\\=\\@\\|\\;\\,\\&\\!\\^\\`"), true);
    lu.assertEquals(">:=@|;,&!^`", tv:UnescapeValue());
    lu.assertTrue(tv.Not);
    IsToggleValueEqual(tv, hmm.HMMFormatter:DecodeToggleValue(hmm.HMMFormatter:EncodeToggleValue(tv)));

    local tv2 = hmm.ToggleValue:New(hmm.HMMFormatter.Escaper:Unpack(""), false);
    lu.assertEquals("", tv2:UnescapeValue());
    lu.assertFalse(tv2.Not);
    IsToggleValueEqual(tv2, hmm.HMMFormatter:DecodeToggleValue(hmm.HMMFormatter:EncodeToggleValue(tv2)));
    local co
    co = tv:ToCondition();
    lu.assertEquals(">:=@|;,&!^`", co.Key);
    lu.assertTrue(co.Not);
    local tvco = hmm.ToggleValue:FromCondition(co);
    lu.assertEquals(">:=@|;,&!^`", tvco:UnescapeValue());
    lu.assertTrue(tvco.Not);
end