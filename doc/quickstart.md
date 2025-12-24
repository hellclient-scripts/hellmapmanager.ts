# 快速上手

本文档介绍了怎么在脚本里快事使用hellmapmanager.ts(hmmts)的库

## 引入

在你的脚本和合适位置引入hmmts的脚本库

例:

```js
var hmm=requie("hmm.js")
```

```lua
local hmm=require("hmm")
```

建议在你脚本的合适位置，建立一个全局变量保存hmm库，因为大部分操作会用到库中的类

### 初始化

使用hmm的第一步是建立一个Database实例

```js
var database=hmm.MapDatabase.New();
```

```lua
local database=hmm.MapDatabase:New();
```

所有的数据管理和查询计算都是以数据库为单位的，所以database正常也需要放在全局变量中。由于hmm库本身和database需要一起使用，所以建议放在相关性较强的位置

### 新建/导入地图

初始化后的database的地图\(database.Current\)是空的，所以需要新建或导入地图

建立新地图
```js
database.NewMap()
database.Current.Map.Encoding=hmm.MapEncoding.GB18030
```

```lua
database:NewMap()
database.Current.Map.Encoding=hmm.MapEncoding.GB18030
```
注意，示例设置了gb18030编码。如果你的客户端的默认编码是utf-8,那么无需设置，地图的默认编码就是utf8

编码本身对脚本并没哟有作用，只是供使用HellMapManager(hmm)打开文件时使用正确的编码解析和保存文件。

如果你有现在的地图文件，则无需建立新地图，直接将地图文件的内容读入字符串变量，代码里Import即可
```js
//map.hmm代表文件路径，在hmmts里无实际意义
database.Import(data, "map.hmm");
```
```lua
--map.hmm代表文件路径，在hmmts里无实际意义
database:Import(data, "map.hmm");
```
### 计算地图

计算类接口一般都需要制定Context和MapperOption来使用。

```js
var ctx=hmm.Context.New()
var option=hmm.MapperOptions.New()
```
```lua
local ctx=hmm.Context:New()
local option=hmm.MapperOptions:New()
```
从示例中可以很明显的发现，新建hmmts库的类并不是直接用语言的new方法创建，而是通过类库中类型的静态方法创建的。因为hmmts本身是TypeScript写然后转译到js/lua的，所以使用上会比较特殊。

Context变量需要在代码里进行维护，可能在整个移动过程中需要复用。

MapperOption一般和单次计算有关。

查询多到多路线的API,一般是移动,最为常用
```js
var result = MapDatabase.APIQueryPathAny(["start"], ["target1","target2"], ctx, option);
```
```lua
local result = MapDatabase:APIQueryPathAny({"start"}, {"target1","target2"}, ctx, option);
```

如果路线查询成功，范围的是一个QueryResult对象。如果查询失败，返回null

查询经过所有Target路线(多次移动模拟)的API,一般是范围遍历
```js
var result = MapDatabase.APIQueryPathAll("start", ["target1","target2"], ctx, option);
```
```lua
local result = MapDatabase:APIQueryPath("start", {"target1","target2"}, ctx, option);
```

如果路线查询成功，范围的是一个QueryResult对象。如果查询失败，返回null

查询顺序经过所有Target路线的API,一般是固定房间遍历
```js
var result = MapDatabase.APIQueryPathOrdered("start", ["target1","target2"], ctx, option);
```
```lua
local result = MapDatabase:APIQueryPathOrdered("start", {"target1","target2"}, ctx, option);
```

如果路线查询成功，范围的是一个QueryResult对象。如果查询失败，返回null

## 维护数据

维护数据有两种操作。

每个基本类型都有一套Insert,Remove,List接口进行操作，比如
* APIInsertRooms
* APIRemoveRooms
* APIListRooms

一般用于导入数据或者手动绘制地图

另一类是标记型接口，比如
* APIGroupRoom
* APITagRoom
* APISetRoomData
* APITracLocation
* 
* 这些一般是对房间信息进行细节维护

## 导出数据

导出数据较为简单，调用Export方法即可

```js
var output=database.Export("path")
```
```lua
local output=database:Export("path")
```
Export的参数为文件名，无实际意义