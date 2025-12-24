# API变更记录

## Version 1002

* MapperOptions加入 CommandWhitelist属性和WithCommandWhitelist,ClearCommandWhitelist方法
* CommandCost允许以空字符串To作为通配符
* AddLocations中的空格会被忽略
* SnapshotFilter 加入MaxCount属性和WithMaxCount方法

## Version 1001

* RoomFilter 中加入 HasAnyGroup

## Version 1000

* 加入接口APIGetVersion