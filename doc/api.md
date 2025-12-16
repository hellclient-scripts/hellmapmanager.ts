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
var version=database.APIVersion():
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
MapDatabse.APIInsertRooms(models: Room[])
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
MapDatabse.APIListRooms(option: APIListOption): Room[]
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
MapDatabse.APIRemoveRooms(keys: string[]) 
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
MapDatabse.APIInsertMarkers(models: Marker[])
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
MapDatabse.APIListMarkers(option: APIListOption): Marker[]
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
MapDatabse.APIRemoveMarkers(keys: string[])
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
MapDatabse.APIInsertRoutes(models: Route[])
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
MapDatabse.APIListRoutes(option: APIListOption): Route[]
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
MapDatabse.APIRemoveRoutes(keys: string[])
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
MapDatabse.APIInsertTraces(models: Trace[])
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
MapDatabse.APIListTraces(option: APIListOption): Trace[]
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
MapDatabse.APIRemoveTraces(keys: string[])
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
MapDatabse.APIInsertRegions(models: Region[])
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
database.APIInsertTraces([region])
```

### 列出地区接口

```javascript
MapDatabse.APIListRegions(option: APIListOption): Region[]
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
MapDatabse.APIRemoveRegions(keys: string[])
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
MapDatabse.APIInsertLandmarks(models: Landmark[])
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
landamrk.Type="^这里是测试房间一"
database.APIInsertLandmarks([landmark])
```

### 列出定位接口

```javascript
MapDatabse.APIListLandmarks(option: APIListOption): Landmark[]
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
MapDatabse.APIRemoveLandmarks(keys: LandmarkKey[]) 
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
MapDatabse.APIInsertShortcuts(models: Shortcut[])
```

**参数**

需要插入的捷径列表。

**返回值**

无

**代码范例**

```javascript
var shortcut=hmm.Shortcut.New()
Shortcut.Key="roomkey"
Shortcut.Command="rideto gc"
Shortcut.To="0"
Shortcut.Delay=1
database.APIInsertShortcuts([shortcut])
```

### 列出捷径接口

```javascript
MapDatabse.APIListShortcuts(option: APIListOption): Shortcut[]
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
MapDatabse.APIRemoveShortcuts(keys: string[])
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
MapDatabse.APIInsertVariables(models: Variable[])
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
MapDatabse.APIListVariables(option: APIListOption): Variable[]
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
MapDatabse.APIRemoveVariables(keys: string[])
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
MapDatabse.APIInsertSnapshots(models: Snapshot[])
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
MapDatabse.APIListSnapshots(option: APIListOption): Snapshot[]
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
MapDatabse.APIRemoveSnapshots(keys: SnapshotKey[])
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
