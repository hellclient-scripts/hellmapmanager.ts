# API变更记录

## Version 1006

* Environment 加入RoomTags属性
* Context 加入RoomsTags属性，WithRoomsTags方法和RoomsTags方法

## Version 1005

* MapperOptions加入 CommandNotContains 属性 和 WithCommandNotContains , Clear CommandNotContains方法

## Version 1004

* APIQueryPathAny 接口context和options参数变为可选。
* APIQueryPathAll 接口context和options参数变为可选。
* APIQueryPathOrdered 接口context和options参数变为可选。
* APIDilate 接口context和options参数变为可选。
* APITrackExit 接口context和options参数变为可选。
* APIGetRoom 接口context和options参数变为可选。
* APIGetRoomExits 接口context和options参数变为可选。

## Version 1003

* SnapshotSearch 加入 MaxNoise 属性

## Version 1002

* MapperOptions加入 CommandWhitelist属性和WithCommandWhitelist,ClearCommandWhitelist方法
* CommandCost允许以空字符串To作为通配符
* AddLocations中的空格会被忽略
* SnapshotFilter 加入MaxCount属性和WithMaxCount方法

## Version 1001

* RoomFilter 中加入 HasAnyGroup

## Version 1000

* 加入接口APIGetVersion