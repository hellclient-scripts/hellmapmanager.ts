local lu = require('luatests/luaunit')
require('luatests/controlcode-test')
require('luatests/formatter-test')

os.exit(lu.LuaUnit.run())
