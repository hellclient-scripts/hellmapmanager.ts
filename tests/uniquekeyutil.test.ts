import { UniqueKeyUtil } from "../src/utils/uniquekeyutil";
import { assert } from "chai";

describe("UniqueKeyUtilTest", () => {
    it("TestBasic", () => {
        assert.equal(`a\n${UniqueKeyUtil.EscapedSep}\n${UniqueKeyUtil.EscapedEscapeToken}`, UniqueKeyUtil.Join(["a", "\n", UniqueKeyUtil.EscapeToken]));
    })
})