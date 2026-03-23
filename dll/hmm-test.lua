local lu = require('luaunit')
local hmm = require('hmmlua')
local json = require('json')

function TestDLL()
    local closed = json.decode(hmm.close("", 0))
    lu.assertEquals(closed, false)
    local created = json.decode(hmm.create("", 0))
    lu.assertEquals(created, true)
end

function TestImport()
    local closed = json.decode(hmm.close("", 0))
    lu.assertEquals(closed, true)
    local data = [[HMM1.0>UTF8
Info>Test地图|1773938371|]]
    local imported = json.decode(hmm.import(data, 0))
    lu.assertEquals(imported, true)
end

function TestVersion()
    hmm.close("", 0)
    hmm.create("", 0)
    local result = json.decode(hmm.version("", 0))
    lu.assertEquals(result, 1006)
end

function TestInfo()
    hmm.close("", 0)
    local created = json.decode(hmm.create("", 0))
    lu.assertEquals(created, true)
    local result = json.decode(hmm.info("", 0))
    lu.assertEquals(result.Name, "")
    lu.assertEquals(result.Desc, "")
end

-- function TestEscape()
--     local cc = hmm.ControlCode:New();
--     cc:WithCommand(hmm.Command:New("\\", "0", "\\\\"));
--     cc:WithCommand(hmm.Command:New("\n", "1", "\\n"));
--     cc:WithCommand(hmm.Command:New("", "2", "\\"));
--     --转义保留符号
--     lu.assertEquals("This is a test \x02 string.", cc:Escape("This is a test \x02 string."));
--     lu.assertEquals("This is a test \x02 string.", cc:Unescape("This is a test \x02 string."));
--     lu.assertEquals("This is a test \x03 string.", cc:Escape("This is a test \x03 string."));
--     lu.assertEquals("This is a test \x03 string.", cc:Unescape("This is a test \x03 string."));
--     lu.assertEquals("This is a test \x04 string.", cc:Escape("This is a test \x04 string."));
--     lu.assertEquals("This is a test \x04 string.", cc:Unescape("This is a test \x04 string."));

--     --转义斜杠
--     lu.assertEquals("This is a test \\\\ string.", cc:Escape("This is a test \\ string."));
--     lu.assertEquals("This is a test \\ string.", cc:Unescape("This is a test \\\\ string."));
--     --测试转义
--     lu.assertEquals("This is a test \\n string.", cc:Escape("This is a test \n string."));
--     --测试解转义
--     lu.assertEquals("This is a test \n string.", cc:Unescape("This is a test \\n string."));
--     --测试一致性
--     lu.assertEquals("This is a test \\ string.", cc:Unescape(cc:Escape("This is a test \\ string.")));
--     --测试独立的斜杠转解意会被去除
--     lu.assertEquals("This is a test  string.", cc:Unescape("This is a test \\ string."));
-- end

-- function TestInternal()
--     local cc = hmm.ControlCode:New()
--         :WithCommand(hmm.Command:New("\x02", "a", "\\2"))
--         :WithCommand(hmm.Command:New("\x03", "b", "\\3"))
--         :WithCommand(hmm.Command:New("\x04", "c", "\\4"))
--     ;
--     lu.assertEquals("\x02", cc:Unescape("\\2"));
--     lu.assertEquals("\x03", cc:Unescape("\\3"));
--     lu.assertEquals("\x04", cc:Unescape("\\4"));

--     lu.assertEquals("\\2", cc:Escape("\x02"));
--     lu.assertEquals("\\3", cc:Escape("\x03"));
--     lu.assertEquals("\\4", cc:Escape("\x04"));

--     lu.assertEquals("\x04\x02", cc:Unescape("\\4\\2"));
--     lu.assertEquals("\\4\\2", cc:Escape("\x04\x02"));
--     lu.assertEquals("\x04\x03", cc:Unescape("\\4\\3"));
--     lu.assertEquals("\\4\\3", cc:Escape("\x04\x03"));
--     lu.assertEquals("\x04\x04", cc:Unescape("\\4\\4"));
--     lu.assertEquals("\\4\\4", cc:Escape("\x04\x04"));
-- end

-- function TestMulti()
--     local cc = hmm.ControlCode:New()
--         :WithCommand(hmm.Command:New("\\", "0", "\\\\"))
--         :WithCommand(hmm.Command:New("\n", "1", "\\n"))
--         :WithCommand(hmm.Command:New("%", "2", "\\%"))
--         :WithCommand(hmm.Command:New("$", "3", "\\$"))
--         :WithCommand(hmm.Command:New("", "4", "\\"))
--     lu.assertEquals("a\n%$b\\n\\%\\$$0$1\\$0\\$1", cc:Unescape("a\\n\\%\\$b\\\\n\\\\%\\\\$\\$0\\$1\\\\$0\\\\$1"));
--     lu.assertEquals("\\n", cc:Unescape("\\\\n"));
-- end

-- os.exit(lu.LuaUnit.run())
