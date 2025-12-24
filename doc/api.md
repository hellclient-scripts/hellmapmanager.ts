# API文档

hellmapmanager.ts(hmmts)中的API是意义对应HellMapManager(HMM)中的API接口的。

具体的接口功能请参考[HMM的API部分](https://github.com/hellclient-scripts/hellmapmanager/blob/main/doc/api/index.md)

## 信息接口

### 版本信息
```javascript
MapDatabase.APIVersion():Number
```
**参数:**

无

**返回值:**

代表版本数字

**代码范例**

```javascript
var version=database.APIVersion();
```

### 地图信息
```javascript
MapDatabase.APIInfo(): MapInfo | null 
```

**参数:**

无

**返回值:**

当前地图的MapInfo，如果未打开地图返回null

**代码范例**
```javascript
var info=database.APIInfo();
```

## 数据接口

批量查询和管理地图的基础数据的接口

### 批量插入房间接口

```javascript
MapDatabase.APIInsertRooms(models: Room[])
```

**参数**

需要插入的房间列表。

**返回值**

无

**代码范例**

```javascript
var room=hmm.Room.New()
room.Key="roomkey"
database.APIInsertRooms([room])
```

### 列出房间接口

```javascript
MapDatabase.APIListRooms(option: APIListOption): Room[]
```
**参数**

option:通用查询选项参数

**返回值**

Room列表

**代码范例**

```javascript
var opt=hmm.APIListOption.New()
var rooms=database.APIListRooms(opt)
```

### 批量删除房间接口
```javascript
MapDatabase.APIRemoveRooms(keys: string[]) 
```

**参数**

要删除的房间主键列表

**返回值**

无

**代码范例**

```javascript
database.APIRemoveRooms(["room1","room2"])
```

### 批量插入标记接口

```javascript
MapDatabase.APIInsertMarkers(models: Marker[])
```

**参数**

需要插入的标记列表。

**返回值**

无

**代码范例**

```javascript
var marker=hmm.Marker.New()
marker.Key="markerkey"
database.APIInsertMarkers([marker])
```

### 列出标记接口

```javascript
MapDatabase.APIListMarkers(option: APIListOption): Marker[]
```
**参数**

option:通用查询选项参数

**返回值**

Marker列表

**代码范例**

```javascript
var opt=hmm.APIListOption.New()
var markers=database.APIListMarkers(opt)
```
### 批量删除标记接口
```javascript
MapDatabase.APIRemoveMarkers(keys: string[])
```

**参数**

要删除的标记主键列表

**返回值**

无

**代码范例**

```javascript
database.APIRemoveMarkers(["marker1","marker2"])
```

### 批量插入路线接口

```javascript
MapDatabase.APIInsertRoutes(models: Route[])
```

**参数**

需要插入的路线列表。

**返回值**

无

**代码范例**

```javascript
var route=hmm.Route.New()
route.Key="routekey"
route.Rooms=["roomkey","roomkey2"]
database.APIInsertRoutes([route])
```

### 列出路线接口

```javascript
MapDatabase.APIListRoutes(option: APIListOption): Route[]
```
**参数**

option:通用查询选项参数

**返回值**

Route列表

**代码范例**

```javascript
var opt=hmm.APIListOption.New()
var routes=database.APIListRoutes(opt)
```

### 批量删除路线接口
```javascript
MapDatabase.APIRemoveRoutes(keys: string[])
```

**参数**

要删除的路线主键列表

**返回值**

无

**代码范例**

```javascript
database.APIRemoveRoutes(["route1","route2"])
```

### 批量插入足迹接口

```javascript
MapDatabase.APIInsertTraces(models: Trace[])
```

**参数**

需要插入的足迹列表。

**返回值**

无

**代码范例**

```javascript
var trace=hmm.Trace.New()
trace.Key="tracekey"
trace.Locations=["roomkey","roomkey2"]
database.APIInsertTraces([trace])
```
### 列出足迹接口

```javascript
MapDatabase.APIListTraces(option: APIListOption): Trace[]
```

**参数**

option:通用查询选项参数

**返回值**

Trace列表

**代码范例**

```javascript
var opt=hmm.APIListOption.New()
var traces=database.APIListTraces(opt)
```

### 批量删除足迹接口
```javascript
MapDatabase.APIRemoveTraces(keys: string[])
```

**参数**

要删除的足迹主键列表

**返回值**

无

**代码范例**

```javascript
database.APIRemoveTraces(["trace1","trace2"])
```

### 批量插入地区接口

```javascript
MapDatabase.APIInsertRegions(models: Region[])
```

**参数**

需要插入的地区列表。

**返回值**

无

**代码范例**

```javascript
var region=hmm.Region.New()
region.Key="regionkey"
region.RegionItem=[
    hmm.RegionItem.New(hmm.RegionItemType.Room,"roomkey",false),
    hmm.RegionItem.New(hmm.RegionItemType.Zone,"zonekey",false),
]
database.APIInsertRegions([region])
```

### 列出地区接口

```javascript
MapDatabase.APIListRegions(option: APIListOption): Region[]
```

**参数**

option:通用查询选项参数

**返回值**

Region列表

**代码范例**

```javascript
var opt=hmm.APIListOption.New()
var regions=database.APIListRegions(opt)
```

### 批量删除地区接口
```javascript
MapDatabase.APIRemoveRegions(keys: string[])
```

**参数**

要删除的地区主键列表

**返回值**

无

**代码范例**

```javascript
database.APIRemoveRegions(["region1","region2"])
```

### 批量插入定位接口

```javascript
MapDatabase.APIInsertLandmarks(models: Landmark[])
```

**参数**

需要插入的定位列表。

**返回值**

无

**代码范例**

```javascript
var landmark=hmm.Landmark.New()
landmark.Key="roomkey"
landmark.Type="regexp"
landamrk.Value="^这里是测试房间一"
database.APIInsertLandmarks([landmark])
```

### 列出定位接口

```javascript
MapDatabase.APIListLandmarks(option: APIListOption): Landmark[]
```

**参数**

option:通用查询选项参数

**返回值**

Landmark列表

**代码范例**

```javascript
var opt=hmm.APIListOption.New()
var landmarks=database.APIListLandmarks(opt)
```

### 批量删除定位接口
```javascript
MapDatabase.APIRemoveLandmarks(keys: LandmarkKey[]) 
```

**参数**

要删除的地区主键(LandmarkKey类型)列表

**返回值**

无

**代码范例**

```javascript
var key1=hmm.LandmarkKey.New("key1","type1")
var key2=hmm.LandmarkKey.New("key1","type2")
database.APIRemoveRegions([key1,key2])
```

### 批量插入捷径接口

```javascript
MapDatabase.APIInsertShortcuts(models: Shortcut[])
```

**参数**

需要插入的捷径列表。

**返回值**

无

**代码范例**

```javascript
var shortcut=hmm.Shortcut.New()
shortcut.Key="roomkey"
shortcut.Command="rideto gc"
shortcut.To="0"
shortcut.Delay=1
database.APIInsertShortcuts([shortcut])
```

### 列出捷径接口

```javascript
MapDatabase.APIListShortcuts(option: APIListOption): Shortcut[]
```

**参数**

option:通用查询选项参数

**返回值**

Shortcut列表

**代码范例**

```javascript
var opt=hmm.APIListOption.New()
var shortcuts=database.APIListShortcuts(opt)
```

### 批量删除捷径接口
```javascript
MapDatabase.APIRemoveShortcuts(keys: string[])
```

**参数**

要删除的捷径主键列表

**返回值**

无

**代码范例**

```javascript
database.APIRemoveShortcuts(["shortcut1","shortcut2"])
```

### 批量插入变量接口

```javascript
MapDatabase.APIInsertVariables(models: Variable[])
```

**参数**

需要插入的变量列表。

**返回值**

无

**代码范例**

```javascript
var variable=hmm.Variable.New()
variable.Key="variablekey"
variable.Value="myvalue"
database.APIInsertVariables([variable])
```

### 列出变量接口

```javascript
MapDatabase.APIListVariables(option: APIListOption): Variable[]
```

**参数**

option:通用查询选项参数

**返回值**

Variable列表

**代码范例**

```javascript
var opt=hmm.APIListOption.New()
var variables=database.APIListVariables(opt)
```


### 批量删除变量接口
```javascript
MapDatabase.APIRemoveVariables(keys: string[])
```

**参数**

要删除的变量主键列表

**返回值**

无

**代码范例**

```javascript
database.APIRemoveVariables(["variable1","variable2"])
```

### 批量插入快照接口

```javascript
MapDatabase.APIInsertSnapshots(models: Snapshot[])
```

**参数**

需要插入的快照列表。

**返回值**

无

**代码范例**

```javascript
var snapshot=hmm.Snapshot.New()
snapshot.Key="roomkey"
snapshot.Type="desc"
variable.Value="roomDesc"
database.APIInsertSnapshots([snapshot])
```

### 列出快照接口

```javascript
MapDatabase.APIListSnapshots(option: APIListOption): Snapshot[]
```

**参数**

option:通用查询选项参数

**返回值**

Snapshot列表

**代码范例**

```javascript
var opt=hmm.APIListOption.New()
var snapshots=database.APIListSnapshots(opt)
```

### 批量删除快照接口
```javascript
MapDatabase.APIRemoveSnapshots(keys: SnapshotKey[])
```

**参数**

要删除的快照主键(SnapshotKey类型)列表

**返回值**

无

**代码范例**

```javascript
var key1=hmm.SnapshotKey.New("key1","type1","value1")
var key2=hmm.SnapshotKey.New("key1","type2","value2")
database.APIRemoveSnapshots([key1,key2])
```

## 计算查询接口

通过环境和选项，动态的对地图进行计算和查询操作

### 点对点规划接口

规划不定数量个起点到不定数量个终点之间的最近路线。

一般常见的是一个起点到一个终点，或者一个起点到多个终点的规划

```javascript
MapDatabase.APIQueryPathAny(from: string[], target: string[], context: Context, options: MapperOptions): QueryResult | null
```

**参数**

* from 出发地点列表
* target 目的地列表
* context 环境上下文
* options 地图选项

**返回值**

查询成功返回QueryResult

查询失败返回null

**代码范例**

```javascript
var ctx=hmm.Context.New()
var opt=hmm.MapperOption.New()
var queryresult=database.APIQueryPathAny(["0"],["799","1946"],ctx,opt)
```

### 范围遍历规划接口

规划一个起点到最终经过所有目标的路线

无法经过的目标会记录在查询结果的Unvisited里

```javascript
MapDatabase.APIQueryPathAll(start: string, target: string[], context: Context, options: MapperOptions): QueryResult | null 
```

**参数**

* start 起点
* target 目的地列表
* context 环境上下文
* options 地图选项

**返回值**

查询成功返回QueryResult

查询失败返回null

**代码范例**

```javascript
var ctx=hmm.Context.New()
var opt=hmm.MapperOption.New()
var queryresult=database.APIQueryPathAll(["0"],["0","1","2"，"3"],ctx,opt)
```

### 顺序遍历规划接口

规划一个起点，按顺序经过所有目标的路线

无法经过的目标会记录在查询结果的Unvisited里

```Javascript
MapDatabase.APIQueryPathOrdered(start: string, target: string[], context: Context, options: MapperOptions): QueryResult | null
```

**参数**

* start 起点
* target 目的地列表
* context 环境上下文
* options 地图选项

**返回值**

查询成功返回QueryResult

查询失败返回null

**代码范例**

```javascript
var ctx=hmm.Context.New()
var opt=hmm.MapperOption.New()
var queryresult=database.APIQueryPathAll(["0"],["0","1"，"2"，"3"],ctx,opt)
```
### 膨胀计算接口 

计算从初始房间列表膨胀指定次数后的新的房间列表。

一般用于获取地图上给点的房间，扩展几个房间后的区域。

```javascript
Mapdatabase.APIDilate(src: string[], iterations: number, context: Context, options: MapperOptions): string[] 
```
**参数**

* src 初始房间列表
* iterations 膨胀次数
* context 环境上下文
* options 地图选项

**返回值**

膨胀后的房间列表

**代码范例**

```javascript
var ctx=hmm.Context.New()
var opt=hmm.MapperOption.New()
var rooms=database.APIDilate(["0","1","2"],3,ctx,opt)
```

### 跟踪出口 

追踪从制定的起点，通过Command指令能到的房间。

成功返回房间Key

失败返回空字符串

```javascript
MapDatabase.APITrackExit(start: string, command: string, context: Context, options: MapperOptions): string 
```

**参数**

* start 起点房间
* command 移动指令
* context 环境上下文
* options 地图选项

**返回值**

移动后的房间Key,移动失败的话返回空字符串

**代码范例**

```javascript
var ctx=hmm.Context.New()
var opt=hmm.MapperOption.New()
var roomkey=database.APITrackExit("0","north",ctx,opt)
```

### 获取房间 

获取指定Key的房间。

包含环境中的临时房间。

成功返回房间对象，失败返回空。

```javascript
APIGetRoom(key: string, context: Context, options: MapperOptions): Room | null
```
**参数**

* key 房间Key
* context 环境上下文
* options 地图选项

**返回值**

对应的Room对象，无对应房间则返回null

**代码范例**

```javascript
var ctx=hmm.Context.New()
var opt=hmm.MapperOption.New()
var room=database.APIGetRoom("0",ctx,opt)
```
### 获取房间

获取指定Key的房间的出口。

包含环境中的临时房间，捷径和临时路径。

可以通过Options的DisableShortcuts排除捷径

成功返回出口列表，失败返回空列表。

```javascript
MapDatabase.APIGetRoomExits(key: string, context: Context, options: MapperOptions): Exit[]
```

**参数**

* key 房间主键
* context 环境上下文
* options 地图选项

**返回值**

对应房间的出口对象列表，找不到房间则返回空数组，

**代码范例**

```javascript
var ctx=hmm.Context.New()
var opt=hmm.MapperOption.New()
var exits=database.APIGetRoomExits("0",ctx,opt)
```


## 标记接口

对房间进行各种细节维护的接口。

###  设置房间标签接口

设置制定房间的分组

```javascript
MapDatabase.APITagRoom(key: string, tag: string, value: number)
```

**参数**

* key 房间主键
* tag 标记名
* value 标记值,为0会清楚标签。

**返回值**

无

**代码范例**

```javascript
database.APITagRoom("roomkey","tagname",1)
```

### 设置房间数据接口

设置制定房间的数据。

可以用来记录一些不会变化的数据，比如带色彩的房间名之类。

理论上，房间的非核心数据更适合使用快照的方式处理。

```javascript
MapDatabase.APISetRoomData(roomkey: string, datakey: string, datavalue: string)
```

**参数**

* roomkey 房间主键
* datakey 数据主键
* datavalue 数据值,为空会删除数据

**返回结果**

无

**代码范例**

```javascript
database.APISetRoomData("roomkey","datakey","datavalue")
```
### 设置追踪

将房间加入足迹中。

一般用于在特定对象出现后对足迹进行维护。

```javascript
MapDatabase.APITraceLocation(key: string, location: string)
```

**参数**

* key 足迹的主键
* location 房间主键。重复添加不会有效果。

**返回值**

无

**代码范例**

```javascript
database.APITraceLocation("npc","15")
```

## 快照接口

快照相关的操作接口。

### 抓快照接口

抓快照接口用于把当前的房间制定内容的快照加入系统中。

快照如果重复，不会创建新快照，会把快照的Count加1,然后更新快照时间。

```javascript
MapDatabase.APITakeSnapshot(key: string, type: string, value: string, group: string)
```

**参数**

* key 快照主键(房间主键)
* type 快照类型
* value 快照值
* group 快照分组

**返回值**

无

**代码范例**

```javascript
database.APITakeSnapshot("roomkey","snapshottype","snapshotvalue","groupa")
```

### 搜索快照 

根据给到的限制搜索快照

```javascript
MapDatabase.APISearchSnapshots(search: SnapshotSearch): SnapshotSearchResult[]
```

**参数**

SnapshotSearch对象

**返回值**

SnapshotSearchResult列表

**代码范例**

```javascript
var search=hmm.SnapshotSearch.New()
search.Keywords=["这里","好像"]
search.Type="roomdesc"
var results=MapDatabase.APISearchSnapshots(search)
```

### 清除快照 

批量清除快照

```javascript
MapDatabase.APIClearSnapshots(filter: SnapshotFilter)
```

**参数**

SnapshotFilter快照过滤器对象

**返回值**

无

**代码范例**

```javascript
var filter=hmm.SnapshotFilter.New()
filter.Type="roomdesc"
database.APIClearSnapshots(filter)
```

## 房间搜索接口

根据条件或者预设搜索房间信息的接口。

### 搜索房间接口 

根据给到的过滤器搜索符合条件的房间。

```javascript
MapDatabase.APISearchRooms(filter: RoomFilter): Room[] 
```

**参数**

房间过滤器对象

**返回值**

房间对象列表

**范例代码**

```javascript
var filter=hmm.RoomFilter.New()
var rc=hmm.ValueCondition.New()
rc.Key="室外"
rc.Not=false
rc.value=1
filter.RoomConditions=[rc]
filter.HasAnyExitTo=["0"]
var data=hmm.Data.New()
data.Key="datakey"
data.Value="datavalue"
filter.HasAnyData= [data];
filter.HasAnyName = ["目标房间名"];
filter.HasAnyGroup=["扬州"];
var data2=hmm.Data.New()
data2.Key="datakey"
data2.Value="datavalue"
filter.ContainsAnyData=[data2];
filter.ContainsAnyName=["广场"];
filter.ContainsAnyKey=["gc"]
var rooms=database.APISearchRooms(filter)
```

## 过滤房间接口 

根据给到的过滤器搜索，过滤给到的的房间

一般用来对搜索结果或者Trace/Region的房间进行再过滤

```javascript
APIFilterRooms(src: string[], filter: RoomFilter): Room[]
```

**参数**

* src 待过滤房间key列表
* filter 过滤器对象

**返回值**

房间对象列表

**范例代码**

```javascript
var filter=hmm.RoomFilter.New()
var rc=hmm.ValueCondition.New()
rc.Key="室外"
rc.Not=false
rc.value=1
filter.RoomConditions=[rc]
filter.HasAnyExitTo=["0"]
var data=hmm.Data.New()
data.Key="datakey"
data.Value="datavalue"
filter.HasAnyData= [data];
filter.HasAnyName = ["目标房间名"];
filter.HasAnyGroup=["扬州"];
var data2=hmm.Data.New()
data2.Key="datakey"
data2.Value="datavalue"
filter.ContainsAnyData=[data2];
filter.ContainsAnyName=["广场"];
filter.ContainsAnyKey=["gc"]
var rooms=database.APIFilterRooms(["0","1","2","3"],filter)
```

## 其他接口

### 获取地图变量

获取地图指定变量

一般用于获取和地图相关的信息

```javascript
MapDatabase.APIGetVariable(key: string): string
```

**参数**

* key 变量主键

**返回值**

变量值,未设置变量返回空字符串

**代码范例**

```javascript
var value=database.APIGetVariable("myvar")
```

### 获取地区对应房间

获取地区对应的房间信息。

因为要进行依次计算，一般应该对获取的数据进行缓存。

```javascript
MapDatabase.APIQueryRegionRooms(key: string): string[]
```

**参数**

* key 地区主键

**返回值**

房间主键列表


**范例代码**
```javascript
var roomkeys=database.APIQueryRegionRooms("qusetregiona")
```
