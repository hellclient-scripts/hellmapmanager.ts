import { assert } from "chai";

import { ControlCode, Command } from '../src/utils/controlcode/controlcode';


describe("ControlCode Test", () => {
    it("TestEscape", () => {
        var cc = new ControlCode();
        cc.WithCommand(new Command("\\", "0", "\\\\"));
        cc.WithCommand(new Command("\n", "1", "\\n"));
        cc.WithCommand(new Command("", "2", "\\"));
        //转义保留符号
        assert.equal("This is a test \x02 string.", cc.Escape("This is a test \x02 string."));
        assert.equal("This is a test \x02 string.", cc.Unescape("This is a test \x02 string."));
        assert.equal("This is a test \x03 string.", cc.Escape("This is a test \x03 string."));
        assert.equal("This is a test \x03 string.", cc.Unescape("This is a test \x03 string."));
        assert.equal("This is a test \x04 string.", cc.Escape("This is a test \x04 string."));
        assert.equal("This is a test \x04 string.", cc.Unescape("This is a test \x04 string."));

        //转义斜杠
        assert.equal("This is a test \\\\ string.", cc.Escape("This is a test \\ string."));
        assert.equal("This is a test \\ string.", cc.Unescape("This is a test \\\\ string."));
        //测试转义
        assert.equal("This is a test \\n string.", cc.Escape("This is a test \n string."));
        //测试解转义
        assert.equal("This is a test \n string.", cc.Unescape("This is a test \\n string."));
        //测试一致性
        assert.equal("This is a test \\ string.", cc.Unescape(cc.Escape("This is a test \\ string.")));
        //测试独立的斜杠转解意会被去除
        assert.equal("This is a test  string.", cc.Unescape("This is a test \\ string."));
    });
    it("TestInternal", () => {
        var cc = new ControlCode()
            .WithCommand(new Command("\x02", "a", "\\2"))
            .WithCommand(new Command("\x03", "b", "\\3"))
            .WithCommand(new Command("\x04", "c", "\\4"))
            ;
        assert.equal("\x02", cc.Unescape("\\2"));
        assert.equal("\x03", cc.Unescape("\\3"));
        assert.equal("\x04", cc.Unescape("\\4"));

        assert.equal("\\2", cc.Escape("\x02"));
        assert.equal("\\3", cc.Escape("\x03"));
        assert.equal("\\4", cc.Escape("\x04"));

        assert.equal("\x04\x02", cc.Unescape("\\4\\2"));
        assert.equal("\\4\\2", cc.Escape("\x04\x02"));
        assert.equal("\x04\x03", cc.Unescape("\\4\\3"));
        assert.equal("\\4\\3", cc.Escape("\x04\x03"));
        assert.equal("\x04\x04", cc.Unescape("\\4\\4"));
        assert.equal("\\4\\4", cc.Escape("\x04\x04"));
    });
    it("TestMulti", () => {
        var cc = new ControlCode()
            .WithCommand(new Command("\\", "0", "\\\\"))
            .WithCommand(new Command("\n", "1", "\\n"))
            .WithCommand(new Command("%", "2", "\\%"))
            .WithCommand(new Command("$", "3", "\\$"))
            .WithCommand(new Command("", "4", "\\"))

        assert.equal("a\n%$b\\n\\%\\$$0$1\\$0\\$1", cc.Unescape("a\\n\\%\\$b\\\\n\\\\%\\\\$\\$0\\$1\\\\$0\\\\$1"));
        assert.equal("\\n", cc.Unescape("\\\\n"));
    });
});