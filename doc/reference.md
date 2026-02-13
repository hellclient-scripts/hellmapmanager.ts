# 参考文档 Reference

在hellmapmanager.ts(hmmts)中提供的类的参考文档。

本文档仅介绍适合在脚本中公共使用的部分。

文档中未提到的代码不保证长期兼容性。

## 说明

hmmts需要把库本身和实际使用的数据库放在合适的全局变量中。本文档中，hmmts会放在全局变量hmm中，数据库会放在全局变量Database中。

Javascript:
```javascript
//hmmts库
var hmm=require("hmm.js")
//hmmts的当前数据库
var database=hmm.MapDatabase.New()
```

Lua:
```lua
--hmmts库
hmm=require(hmm)
--hmmts的当前数据库
database=hmm.MapDatabase:New()
```

## 地图数据库类 MapDatabase

MapDatabase是整个 hmmts的功能的合计。所有的功能都是通过MapDatabase类来使用的

### 创建方式

Javascript:
```javascript
var database=hmm.MapDatabase.New()
```

Lua:
```lua
local database=hmm.MapDatabase:New()
```

### 属性

| 属性名  | 类型            | 说明         |
| ------- | --------------- | ------------ |
| Current | MapFile \| null | 当前地图文件 |

#### Current 属性

Current 是MapDatabase最重要的属性。当前打开的地图文件，如果为空，说明没有打开任何地图文件

### 方法

| 方法名       | 参数                       | 返回值 | 说明            |
| ------------ | -------------------------- | ------ | --------------- |
| NewMap       | 无                         | 无     | 创建新的MapFile |
| Import       | body: string, path: string | 无     | 导入MapFile     |
| Export       | path: string               | string | 导出MapFile     |
| CloseCurrent | 无                         | 无     | 关闭当前MapFile |

#### NewMap 方法

NewMap方法会在当前的MapDatabase中创建一个新MapFile,相当于一般应用的新建功能。

使用NewMap后，MapDatabase的Current属性将设置为空的MapFile。

新建MapFile后，建议设置正确的MapFile编码

**代码范例**

Javascript:
```javascript
database.NewMap()
//database.Current.Map.Encoding=hmm.MapEncoding.GB18030
```

Lua:
```lua
database:NewMap()
--database.Current.Map.Encoding=hmm.MapEncoding.GB18030
```

#### Import 方法

将给到的hmm文件正文字符串导入到当前的MapDatabase中。

会创建新的MapFile。

注意，导入时不会根据hmm文件进行转码，需要在保存hmm文件时就设置正确的编码。

**参数**

* body hmm文件正文
* path 设置MapFile的文件位置属性，无实际用途

**代码范例**

Javascript:
```javascript
database.Import(hmmbody,"map.hmm")
```

Lua:
```lua
database:Import(hmmbody,"map.hmm")
```

#### Export 方法

将当前的MapFile到处为hmm文件正文以便保存。

注意，到处时不会自动设置编码，需要在创建MapFile或者导出前手动指定。

**参数**

* path 文件保存位置，无实际意义

**返回值**

HMM文件正文。如果没有打开或新建MapFile,则返回空字符串

**代码范例**

Javascript:
```javascript
var hmmToSave=database.Export("map.hmm")
```

Lua:
```lua
local hmmToSave=database:Export("map.hmm")
```

### CloseCurrent 方法

关闭当前MapFile。将Current属性设置为空。

**代码范例**

Javascript:
```javascript
database.CloseCurrent()
```

Lua:
```lua
database:CloseCurrent()
```

## 地图数据封装类 MapFile

地图数据封装类 MapFile是对整体数据的一个封装，API接口的实际实现都在MapFile类上，起到隔离数据和操作的作用。

一般不应该直接使用或操作MapFile类

### 属性

| 属性名 | 类型   | 说明     |
| ------ | ------ | -------- |
| Map    | Map    | 地图     |
| Path   | string | 地图路径 |

#### Map 属性

Map属性中包含的是实际的地图信息，会在 MapDatabase的NewMap和Import方法调用时，随着MapFile自动创建

#### Path 属性

使用MapDatabse的Import和Export时自动设置。为了保持代码与HMM完全一致而保留，没有实际用途

## 地图对象 Map

Map是地图本身信息的对象。

### 属性

| 属性名   | 类型        | 说明         |
| -------- | ----------- | ------------ |
| Encoding | MapEncoding | 地图编码     |
| Info     | MapInfo     | 地图基本信息 |

#### Encoding 属性

地图的编码，一个MapEncoding对象，可以设置为 MapEncoding.Default (utf8) 或 MapEncoding.GB18030

#### Info 属性

地图基本信息

## 地图基本信息 MapInfo

地图的基本信息，名字和描述

### 属性

| 属性名      | 类型   | 说明                         |
| ----------- | ------ | ---------------------------- |
| Name        | string | 地图名字                     |
| Desc        | string | 地图描述                     |
| UpdatedTime | number | 地图最后更新时间，unix时间戳 |

## 值标签 ValueTag

值标签代表环境中的一个标签值，与值条件(ValueCondition)成对使用。

### 创建方式

依次将主键(Key)和值(Value)传入创建函数创建。

Javascript:
```javascript
var tag=hmm.ValueTag.New("tagkey",1)
```

Lua:
```lua
local tag=hmm.ValueTag:New("tagkey",1)
```

### 属性

| 属性名 | 类型   | 说明     |
| ------ | ------ | -------- |
| Key    | string | 标签主键 |
| Value  | number | 标签值   |

#### Key 属性

主键值，不可为空

#### Value 属性

标签值。

如果标签代表真，则标签值为1。如果标签代表假，则标签值为0。

与值标签匹配时，会判断同键值的值条件的值。如果条件值大于等于标签值，则匹配，否则不匹配。

### 方法

| 方法名             | 参数                         | 返回值   | 说明                         |
| ------------------ | ---------------------------- | -------- | ---------------------------- |
| Validated          | 无                           | bool     | 判断ValueTag是否有效         |
| Clone              | 无                           | ValueTag | 克隆一个ValueTag             |
| Equal              | ValueTag                     | bool     | 判断是否和另一个ValueTag相等 |
| ValidateConditions | []ValueTag, []ValueCondition | boolean  | 批量匹配                     |

#### Validated 方法

判断ValueTag是否有效。ValueTag的Key不可为空。

Javascript:
```javascript
var validated=tag.Validated()
```

Lua:
```lua
local validated=tag:Validated()
```

#### Clone 方法

复制一个独立的ValueTag

Javascript:
```javascript
var newtag=tag.Clone()
```

Lua:
```lua
local newtag=tag:Clone()
```

#### Equal 方法

判断是否和另一个ValueTag相等

Javascript:
```javascript
var same=tag.Equal(hmm.ValueTag.New("key",1))
```

Lua:
```lua
local same=tag:Equal(hmm.ValueTag:New("key",1))
```

#### ValidateConditions 方法

静态方法

批量匹配传入的值标签列表和值条件列表。

如果有任何一个不匹配，返回false,否则返回true

Javascript:
```javascript
var matched=ValueTag.ValidateConditions(
    [hmm.ValueTag.New("Key1",1),hmm.ValueTag.New("Key2",2)],
    [hmm.ValueCondition.New("Key1",1,false),hmm.ValueCondition.New("Key2",1,true)]
)
```

Lua:
```lua
local matched=ValueTag:ValidateConditions(
    {hmm.ValueTag:New("Key1",1),hmm.ValueTag:New("Key2",2)},
    {hmm.ValueCondition.New("Key1",1,false),hmm.ValueCondition.New("Key2",1,true)}
)
```

## 值条件 ValueCondition

条件值，与值标签(ValueTag)成对使用

### 创建方式

依次将主键(Key)，值(Value)，取否(Not)传入创建函数创建。

Javascript:
```javascript
var vc=hmm.ValueCondition.New("tagkey",1,false)
```

Lua:
```lua
local vc=hmm.ValueCondition:New("tagkey",1,false)
```

### 属性

| 属性名 | 类型   | 说明 |
| ------ | ------ | ---- |
| Key    | string | 主键 |
| Value  | number | 值   |
| Not    | bool   | 取否 |

#### Key 属性

匹配的主键，与ValueTag的Key对应


#### Value 值

需要满足的Tag值，ValueTag的值在没有取否时必须大于等于这个值才能匹配

#### Not 值

取否，对匹配的结果做逻辑否操作

### 方法

| 方法名    | 参数           | 返回值         | 说明                               |
| --------- | -------------- | -------------- | ---------------------------------- |
| Validated | 无             | bool           | 判断ValueCondition是否有效         |
| Clone     | 无             | ValueCondition | 克隆一个ValueCondition             |
| Equal     | ValueCondition | bool           | 判断是否和另一个ValueCondition相等 |

#### Validated 方法

判断ValueCondition是否有效。ValueCondition的Key不可为空。

Javascript:
```javascript
var validated=vc.Validated()
```

Lua:
```lua
local validated=vc:Validated()
```

#### Clone 方法

复制一个独立的ValueCondition

Javascript:
```javascript
var newvc=vc.Clone()
```

Lua:
```lua
local newvc=vc:Clone()
```

#### Equal 方法

判断是否和另一个ValueCondition相等

Javascript:
```javascript
var same=vc.Equal(hmm.ValueCondition.New("key",1,false))
```

Lua:
```lua
local same=vc:Equal(hmm.ValueCondition:New("key",1,false))
```

## 房间数据 Data

Data对象是房间附属的房间数据的结构

### 创建方式

将数据的键和值一次传入New函数

Javascript:
```javascript
var data=hmm.Data.New("datakey","datavalue")
```

Lua:
```lua
local data=hmm.Data:New("datakey","datavalue")
```

### 属性

| 属性名 | 类型   | 说明     |
| ------ | ------ | -------- |
| Key    | string | 数据主键 |
| Value  | string | 数据值   |


### 方法

| 方法名    | 参数 | 返回值 | 说明                     |
| --------- | ---- | ------ | ------------------------ |
| Validated | 无   | bool   | 判断Data是否有效         |
| Clone     | 无   | Data   | 克隆一个Data             |
| Equal     | Data | bool   | 判断是否和另一个data相等 |

#### Validated 方法

判断Data是否有效。Data的Key和Value不可为空。

Javascript:
```javascript
var validated=data.Validated()
```

Lua:
```lua
local validated=data:Validated()
```

#### Clone 方法

复制一个独立的Data

Javascript:
```javascript
var newdata=data.Clone()
```

Lua:
```lua
local newdata=data:Clone()
```

#### Equal 方法

判断是否和另一个Data相等

Javascript:
```javascript
var same=data.Equal(hmm.Data.New("key","value"))
```

Lua:
```lua
local same=data:Equal(hmm.Data:New("key","value"))
```

## Exit 出口对象

Exit代表通向一个房间的出口信息。

Exit作为HMM最重要的基础结构，会被很多类继承。

### 创建方式

Javascript:
```javascript
var exit=hmm.Exit.New()
exit.Command="north"
exit.To="0"
exit.Conditions=[hmm.ValueCondition.New("gb",1,false)]
exit.Cost=1
```

Lua:
```lua
local exit=hmm.Exit:New()
exit.Command="north"
exit.To="0"
exit.Conditions={hmm.ValueCondition:New("gb",1,false)}
exit.Cost=1
```

### 属性

| 属性名     | 类型                | 说明         |
| ---------- | ------------------- | ------------ |
| Command    | string              | 出口的指令   |
| To         | string              | 出口目标     |
| Conditions | []ValueCondition=[] | 出口的值条件 |
| Cost       | number=1            | 出口的消耗   |

#### Command 属性

出口的实际指令，不可为空

#### To 属性

出口对应的房间。建议待处理的可以用 * 或 ？占位

#### Conditions 属性

值条件列表

必须在Context里满足所有Condition,才能使用出口

#### Cost 属性

出口的消耗，默认1.

计算路径时的出口消耗。小于1的值属于Undefined Behave

### 方法

| 方法名    | 参数 | 返回值 | 说明                     |
| --------- | ---- | ------ | ------------------------ |
| Validated | 无   | bool   | 判断Exit是否有效         |
| Clone     | 无   | Exit   | 克隆一个Exit             |
| Equal     | Exit | bool   | 判断是否和另一个Exit相等 |

#### Validated 方法

判断Exit是否有效。Exit的Command不可为空。

Javascript:
```javascript
var validated=exit.Validated()
```

Lua:
```lua
local validated=exit:Validated()
```

#### Clone 方法

复制一个独立的Exit

Javascript:
```javascript
var newexit=exit.Clone()
```

Lua:
```lua
local newexit=exit:Clone()
```

#### Equal 方法

判断是否和另一个Exit相等

Javascript:
```javascript
var same=exit.Equal(hmm.Exit.New("key",1,false))
```

Lua:
```lua
local same=exit:Equal(hmm.Exit:New("key",1,false))
```

## ItemKey 地图元素主键验证类

用于验证地图主键的类

### 方法

| 方法名   | 参数   | 返回值 | 说明                                       |
| -------- | ------ | ------ | ------------------------------------------ |
| Validate | string | bool   | 验证传入的字符串是否是有效的地图元素主键。 |

#### Validate 方法

验证传入的字符串是否是有效的地图元素主键。

主键需要符合以下条件

* 不为空字符串
* 不含空格

**参数**

* string 待验证的主键

**返回值**

是否有效

**代码范例**

Javascript:
```javascript
var validated=hmm.ItemKey.Validate("key")
```

Lua:
```lua
local validated=hmm.ItemKey:Validate("key")
```

## APIListOption 接口列出选项

标准维护接口的列出过滤选项

### 创建方式

Javascript:
```javascript
var lo=hmm.APIListOption.New()
lo.WithKeys(["gc","gd"]).WithGroups(["扬州","北京"])
```

Lua:
```lua
local lo=hmm.APIListOption:New()
lo:WithKeys({"gc","gd"}):WithGroups({"扬州","北京"})
```

### 方法
| 方法名     | 参数             | 返回值        | 说明                   |
| ---------- | ---------------- | ------------- | ---------------------- |
| Clear      | 无               | APIListOption | 链式调用，清除过滤条件 |
| WithKeys   | keys: string[]   | APIListOption | 链式调用，添加主键过滤 |
| WithGroups | groups: string[] | APIListOption | 链式调用，添加分组过滤 |
| Keys       | 无               | []string      | 返回当前的主键过滤列表 |
| Groups     | 无               | []string      | 返回当前的分组过滤列表 |
| IsEmpty    | 无               | bool          | 当前的过滤选项是否为空 |

Clear,WithKeys,WithGroups会返回APIListOption本身方便调用。

当Keys或者Groups任何一个为空时，调用接口时不限制对应的属性

## Room 房间对象

Room是hmmts里最基础的地图对象，代表了Mud里的一个一个抽象的位置以及对应的出口关系。

### 创建方式

Javascript:
```javascript
var room=hmm.Room.New()
room.Key="myroom"
room.Name="我的房间"
room.Desc="abcdefg"
room.Tags=[hmm.Tag.New("indoor",1)]
var exit=hmm.Exit.New()
exit.Command="out"
exit.To="chatroom"
exit.Conditions=[hmm.ValueCondition.New("isWiz",1,false)]
exit.Cost=1
room.Exits=[exit]
room.Data=[hmm.Data.New("datakey","datavalue")]
```

Lua:
```lua
local room=hmm.Room:New()
room.Key="myroom"
room.Name="我的房间"
room.Desc="abcdefg"
room.Tags={hmm.Tag:New("indoor",1)}
local exit=hmm.Exit:New()
exit.Command="out"
exit.To="chatroom"
exit.Conditions={hmm.ValueCondition:New("isWiz",1,false)}
exit.Cost=1
room.Exits={exit}
room.Data={hmm.Data:New("datakey","datavalue")}
```


### 属性

| 属性名 | 类型       | 说明     |
| ------ | ---------- | -------- |
| Key    | string     | 房间主键 |
| Name   | string     | 房间名   |
| Desc   | string     | 房间描述 |
| Group  | string     | 房间分组 |
| Tags   | []ValueTag | 房间标签 |
| Exits  | []Exit     | 房间出口 |
| Data   | []Data     | 房间数据 |

#### Key 属性

房间的主键，hmm中最核心的概念。

#### Name 属性

房间名，人类可阅读的房间名称。

除了阅读作用外，还会用于搜索/过滤房间，以及在hmm的关系地图中显示

#### Desc 属性

描述属性，备注用，无实际用途。

#### Group 属性

分组属性。在Room中一般可以记录城市所属的城市。

可以在List接口中使用

#### Tags 属性

房间本身的标签，一般用于匹配Context中的RoomConditions。

常见的可以用来设置是否为室外，是否为安全区等

#### Exits 属性

房间的出口列表，描述房间与房间之间的关联。

#### Data 属性

房间数据属性。可以用来存放需要的房间数据。比如特殊的NPC/任务道具等。

可以在搜索/过滤房间中使用

### 方法

| 方法名    | 参数                       | 返回值  | 说明                          |
| --------- | -------------------------- | ------- | ----------------------------- |
| Validated | 无                         | bool    | 判断Room是否有效              |
| Clone     | 无                         | Room    | 克隆一个Room                  |
| Equal     | Room                       | bool    | 判断是否和另一个Room相等      |
| HasTag    | key: string, value: number | bool    | 判断是否含有某个Tag           |
| GetData   | string                     | string  | 返回指定Key的房间数据         |
| HasExitTo | string                     | boolean | 返回知否有到制定Key房间的出口 |
| SetData   | Data                       | 无      | 为房间设置房间数据            |
| SetDatas  | []Data                     | 无      | 为房间批量设置房间数据        |

#### Validated 方法

判断Room是否有效。

主键不可为空，需要符合ItemKey验证


Javascript:
```javascript
var validated=room.Validated()
```

Lua:
```lua
local validated=room:Validated()
```

#### Clone 方法

复制一个独立的Room

Javascript:
```javascript
var newroom=room.Clone()
```

Lua:
```lua
local newroom=room:Clone()
```

#### Equal 方法

判断是否和另一个Room相等

Javascript:
```javascript
var same=room.Equal(hmm.Room.New())
```

Lua:
```lua
local same=room:Equal(hmm.Room:New())
```

#### HasTag 方法

判断 是否给到的Tag主键是否符合具体的Value值

**参数**

* key 标签主键
* value 标签值

**返回值**

是否符合

**代码范例**

Javascript:
```javascript
var match=room.HasTag("outdoor",1)
```

Lua:
```lua
local match=room:Hastag("outdoor",1)
```

#### GetData 方法

返回房间给定数据主键的数据值。


**参数**

* key 数据主键
  
**返回值**

房间对应数据主键的数据值。如果无对应值，返回空字符串


**代码范例**

Javascript:
```javascript
var datavalue=room.GetData("datakey")
```

Lua:
```lua
local datavalue=room:GetData("datakey")
```

#### SetData 方法

为房间设置具体的数据值,设置结束后房间数据会按照主键排序。

**参数**

* rd 房间数据，如果有同名会进行更新，如果Value为''则删除该Key对应数据

**返回值**

无

**代码范例**

Javascript:
```javascript
room.SetData(hmm.Data.New("datakey","datavalue"))
```

Lua:
```lua
room:SetData(hmm.Data:New("datakey","datavalue"))
```

#### SetDatas 方法

批量为房间设置具体的数据值,设置结束后房间数据会按照主键排序。

**参数**

* list 房间数据列表，会依次设置。如果有同名会进行更新，如果Value为空字符串则会只删除

**返回值**

无

**代码范例**

Javascript:
```javascript
room.SetDatas([hmm.Data.New("datakey","datavalue"),hmm.Data.New("datakey2","datavalue2")])
```

Lua:
```lua
room:SetDatas({hmm.Data:New("datakey","datavalue"),hmm.Data:New("datakey2","datavalue2")})
```

## RoomFilter 房间过滤器

由于搜索和过滤房间的个过滤器

### 创建方式

Javascript:
```javascript
var rf=hmm.RoomFilter.New()
rf.RoomConditions=[hmm.ValueCondition.New("outdoor",1,false)]
rf.HasAnyExitTo=["gc"]
rf.HasAnyData=[hmm.Data.New("datakey","datavalue")]
rf.HasAnyName=["中心广场"]
rf.HasAnyGroup=["扬州"]
rf.ContainsAnyData=[hmm.Data.New("datakey2","value2")]
rf.ContainsAnyName=["广场"]
rf.ContainsAnyKey=["yz"]
```

Lua:
```lua
local rf=hmm.RoomFilter:New()
rf.RoomConditions={hmm.ValueCondition:New("outdoor",1,false)}
rf.HasAnyExitTo={"gc"}
rf.HasAnyData={hmm.Data:New("datakey","datavalue")}
rf.HasAnyName={"中心广场"}
rf.HasAnyGroup={"扬州"}
rf.ContainsAnyData={hmm.Data.New("datakey2","value2")}
rf.ContainsAnyName={"广场"}
rf.ContainsAnyKey={"yz"}
```

### 属性

| 属性名          | 类型             | 说明               |
| --------------- | ---------------- | ------------------ |
| RoomConditions  | []ValueCondition | 匹配的房间条件     |
| HasAnyExitTo    | []string         | 匹配的出口房间Key  |
| HasAnyData      | []Data           | 完全匹配的房间数据 |
| HasAnyName      | []string         | 完全匹配的房间名   |
| HasAnyGroup     | []string         | 完全匹配的分组     |
| ContainsAnyData | []Data           | 部分匹配的房间数据 |
| ContainsAnyName | []string         | 部分匹配的房间名   |
| ContainsAnyKey  | []string         | 部分匹配的主键     |

不同的属性都是列表，代表不同的筛选条件。

空列表代表不做限制。

同一组的筛选条件，互相之间是 or 判定，任何一个符合既符合。

不同组的筛选条件，互相之间是 and 判定，必须全部符合才能符合。

#### RoomConditions 属性

不为空时，Room必须有和 RoomCondition 对应的Tag才能匹配

#### HasAnyExitTo 属性

不为空时，Room必须要有出口到给定的目标房间才能匹配。只判断原始房间信息，不包含Context。


#### HasAnyData 属性

不为空时，Room必须有给定的房间数据才能匹配，判断时对Data.Value进行完整匹配判断。

#### HasAnyName 属性

不为空时，Room只有有给定的房间名才能匹配，匹配时对Name属性进行完整匹配。

#### HasAnyGroup 属性

不为空时，Room只有有给定的分组才能匹配，匹配时对Group属性进行完整匹配。

#### ContainsAnyData 属性

不为空时，Room必须包含给定的房间数据才能匹配，判断时对Data.Value进行部分整匹配判断，只要包含条件即可。

#### ContainsAnyName 属性

不为空时，Room必须包含定的房间名据才能匹配，判断时对Name属性进行部分整匹配判断，只要包含条件即可。

## Marker 标记

标记是hmm中的一种重要属性，是处于业务对房间Key的一种别名或者映射。

### 创建方式

Javascript:
```javascript
var marker=hmm.Marker.New()
marker.Key="mykey"
marker.Value="gc"
marker.Desc="描述"
marker.Group="npc"
marker.Message="小混混(xiao hunhun)"
```

Lua:
```lua
local marker=hmm.Marker:New()
marker.Key="mykey"
marker.Value="gc"
marker.Desc="描述"
marker.Group="npc"
marker.Message="小混混(xiao hunhun)"
```


### 属性

| 属性名  | 类型   | 说明         |
| ------- | ------ | ------------ |
| Key     | string | 别名主键     |
| Value   | string | 别名目标房间 |
| Desc    | string | 描述         |
| Group   | string | 分组         |
| Message | string | 消息         |

#### Key 属性

标记主键

#### Value 属性

标记对应的房间ID

#### Desc 属性

描述，做备注，无实际作用

#### Group 属性

分组，可以用于筛选以及判断怎么处理Message

#### Message 属性

消息，传递给脚本的数据，可以附带标记对应的npc/道具/人物等

### 方法

| 方法名    | 参数   | 返回值 | 说明                     |
| --------- | ------ | ------ | ------------------------ |
| Validated | 无     | bool   | 判断Marker是否有效       |
| Clone     | 无     | Marker | 克隆一个Room             |
| Equal     | Marker | bool   | 判断是否和另一个Room相等 |

#### Validated 方法

判断Marker是否有效。

主键不可为空，需要符合ItemKey验证。

Value不可为空。

Javascript:
```javascript
var validated=marker.Validated()
```

Lua:
```lua
local validated=marker:Validated()
```

#### Clone 方法

复制一个独立的Marker

Javascript:
```javascript
var newmarker=marker.Clone()
```

Lua:
```lua
local newmarker=marker:Clone()
```

#### Equal 方法

判断是否和另一个Marker相等

Javascript:
```javascript
var same=marker.Equal(hmm.Marker.New())
```

Lua:
```lua
local same=marker:Equal(hmm.Marker:New())
```

## Route 路线

有顺序的房间列表

### 创建方式

Javascript:
```javascript
var route=hmm.Route.New()
route.Key="myroute"
route.Group="quest"
route.Desc="描述"
route.Message="zone:yz"
route.Rooms=["0","1","2","3"]
```

Lua:
```lua
local route=hmm.Route:New()
route.Key="myroute"
route.Group="quest"
route.Desc="描述"
route.Message="zone:yz"
route.Rooms={"0","1","2","3"}
```

### 属性

| 属性名  | 类型     | 说明     |
| ------- | -------- | -------- |
| Key     | string   | 主键     |
| Desc    | string   | 描述     |
| Group   | string   | 分组     |
| Message | string   | 消息     |
| Rooms   | []string | 房间列表 |

#### Key 属性

路线主键

#### Desc 属性

描述，做备注，无实际作用

#### Group  属性

分组，可以用于筛选以及判断怎么处理Message

#### Message  属性

消息，传递给脚本的数据，可以附带路线对应的npc/道具/人物等

#### Rooms  属性

房间列表

### 方法

| 方法名    | 参数 | 返回值 | 说明                     |
| --------- | ---- | ------ | ------------------------ |
| Validated | 无   | bool   | 判断Route是否有效        |
| Clone     | 无   | Route  | 克隆一个Room             |
| Equal     | Room | bool   | 判断是否和另一个Room相等 |

#### Validated 方法

判断Route是否有效。

主键不可为空，需要符合ItemKey验证


Javascript:
```javascript
var validated=route.Validated()
```

Lua:
```lua
local validated=route:Validated()
```

#### Clone 方法

复制一个独立的Route

Javascript:
```javascript
var newroute=route.Clone()
```

Lua:
```lua
local newroute=route:Clone()
```

#### Equal 方法

判断是否和另一个Route相等

Javascript:
```javascript
var same=route.Equal(hmm.Route.New())
```

Lua:
```lua
local same=route:Equal(hmm.Route:New())
```

## Trace 足迹

Npc或者人物对象出现的分布


### 创建方式

Javascript:
```javascript
var trace=hmm.Trace.New()
trace.Key="questnpc"
trace.Group="quest"
trace.Desc="描述"
trace.Message="托钵僧(tuobo seng)"
trace.Locations=["1","2","3"]
```

Lua:
```lua
local trace=hmm.Trace:New()
trace.Key="questnpc"
trace.Group="quest"
trace.Desc="描述"
trace.Message="托钵僧(tuobo seng)"
trace.Locations={"1","2","3"}
```

### 属性

| 属性名    | 类型     | 说明     |
| --------- | -------- | -------- |
| Key       | string   | 主键     |
| Desc      | string   | 描述     |
| Group     | string   | 分组     |
| Message   | string   | 消息     |
| Locations | []string | 位置列表 |

#### Key 属性

足迹主键

#### Desc 属性

描述，做备注，无实际作用

#### Group 属性

分组，可以用于筛选以及判断怎么处理Message

#### Message 属性

消息，传递给脚本的数据，可以附带路线对应的npc/道具/人物等

#### Locations 属性

位置列表

### 方法

| 方法名          | 参数               | 返回值 | 说明                      |
| --------------- | ------------------ | ------ | ------------------------- |
| Validated       | 无                 | bool   | 判断Trace是否有效         |
| Clone           | 无                 | Trace  | 克隆一个Trace             |
| Equal           | Trace              | bool   | 判断是否和另一个Trace相等 |
| RemoveLocations | loctions: string[] | 无     | 移除多个位置              |
| AddLocations    | loctions: string[] | 无     | 添加多个位置              |

#### Validated 方法

判断Trace是否有效。

主键不可为空，需要符合ItemKey验证


Javascript:
```javascript
var validated=trace.Validated()
```

Lua:
```lua
local validated=trace:Validated()
```

#### Clone 方法

复制一个独立的Trace

Javascript:
```javascript
var newtrace=trace.Clone()
```

Lua:
```lua
local newtrace=trace:Clone()
```

#### Equal 方法

判断是否和另一个Trace相等

Javascript:
```javascript
var same=trace.Equal(hmm.Trace.New())
```

Lua:
```lua
local same=trace:Equal(hmm.Trace:New())
```

#### RemoveLocations 方法

移除多个位置

**参数**

* locations 需要移除的位置列表

**返回值**

无

**范例代码**

Javascript:
```javascript
trace.RemoveLocations(["1","2","3"])
```

Lua:
```lua
trace:RemoveLocations({"1","2","3"})
```

#### AddLocations 方法

批量添加位置

添加后位置会升序排序

**参数**

* locations 需要添加的位置列表


**返回值**

无

**范例代码**

Javascript:
```javascript
trace.AddLocations(["1","2","3"])
```

Lua:
```lua
trace:AddLocations({"1","2","3"})
```

## RegionItem 地区元素

地区元素，指组成地区的基本元素。

可以理解为地区的一个个零件，通过 加入某个地区/房间或者排除某个地区/房间，最后计算出地区的实际房间。

### 创建方式

Javascript:
```javascript
var regionitem=hmm.RegionItem.New(hmm.RegionItemType.Zone,"yz",false)
```

Lua:
```lua
local regionitem=hmm.RegionItem:New(hmm.RegionItemType.Zone,"yz",false)
```
### 属性

| 属性名 | 类型           | 说明     |
| ------ | -------------- | -------- |
| Type   | RegionItemType | 元素类型 |
| Value  | string         | 元素值   |
| Not    | bool           | 取否     |

#### Type 属性

地区元素的类型。可使用的值为

* RegionItemType.Room 单个房间类型
* RegionItemType.Zone 房间组类型

#### Value 属性

元素值，对应不同的Type.意义不同

* RegionItemType.Room 状态：单个房间的主键
* RegionItemType.Zone 状态: 房间的group名

#### Not 属性

取否。为false的话，对应的房间会添加到地区内，否则会从地区内排除。

### 方法

| 方法名    | 参数       | 返回值     | 说明                           |
| --------- | ---------- | ---------- | ------------------------------ |
| Validated | 无         | bool       | 判断RegionItem是否有效         |
| Clone     | 无         | RegionItem | 克隆一个RegionItem             |
| Equal     | RegionItem | bool       | 判断是否和另一个RegionItem相等 |

#### Validated 方法

判断RegionItem是否有效。

值不可为空


Javascript:
```javascript
var validated=regionitem.Validated()
```

Lua:
```lua
local validated=regionitem:Validated()
```

#### Clone 方法

复制一个独立的RegionItem

Javascript:
```javascript
var newregionitem=regionitem.Clone()
```

Lua:
```lua
local newregionitem=regionitem:Clone()
```

#### Equal 方法

判断是否和另一个RegionItem相等

Javascript:
```javascript
var same=regionitem.Equal(hmm.RegionItem.New(hmm.RegionItemType.Zone,"yz",false))
```

Lua:
```lua
local same=regionitem:Equal(hmm.RegionItem:New(hmm.RegionItemType.Zone,"yz",false))
```



## Region 地区

地区是用户预先定义的一系列的地图元素。

地图元素分为 Room类型和Zone类型，分别对应Room的Key和Group。

地区的设计目的是让用户方便的维护一个抽象地区，在地图发生变化时能一定程度自适应。

### 创建方式

Javascript:
```javascript
var region=hmm.Region.New()
region.Key="yz"
region.Group="quest"
region.Desc="描述"
region.Message="questcmd:finish"
region.Items=[hmm.RegionItem.New(hmm.RegionItemType.Zone,"yz",false)]
```

Lua:
```lua
local region=hmm.Region:New()
region.Key="yz"
region.Group="quest"
region.Desc="描述"
region.Message="questcmd:finish"
region.Items={hmm.RegionItem:New(hmm.RegionItemType.Zone,"yz",false)}
```

### 属性

| 属性名  | 类型     | 说明     |
| ------- | -------- | -------- |
| Key     | string   | 主键     |
| Desc    | string   | 描述     |
| Group   | string   | 分组     |
| Message | string   | 消息     |
| Items   | []string | 元素列表 |

#### Key 属性

地区主键

#### Desc 属性

描述，做备注，无实际作用

#### Group 属性

分组，可以用于筛选以及判断怎么处理Message

#### Message 属性

消息，传递给脚本的数据，可以附带地区对应的npc/道具/人物等

#### Items 属性

地区元素列表

### 方法

| 方法名    | 参数   | 返回值 | 说明                       |
| --------- | ------ | ------ | -------------------------- |
| Validated | 无     | bool   | 判断Region是否有效         |
| Clone     | 无     | Region | 克隆一个Region             |
| Equal     | Region | bool   | 判断是否和另一个Region相等 |

#### Validated 方法

判断Region是否有效。

主键不可为空，需要符合ItemKey验证

Javascript:
```javascript
var validated=region.Validated()
```

Lua:
```lua
local validated=region:Validated()
```

#### Clone 方法

复制一个独立的Region

Javascript:
```javascript
var newregion=region.Clone()
```

Lua:
```lua
local newregion=region:Clone()
```

#### Equal 方法

判断是否和另一个Region相等

Javascript:
```javascript
var same=region.Equal(hmm.Region.New()
```

Lua:
```lua
local same=region:Equal(hmm.Region:New())
```


## LandmarkKey 地标主键

地标和一般的地图结构不一样，由于一个Room可以由多个地标定位，所以地标的唯一性是由Key和Type共同组成唯一主键的


### 创建方式

依次传入Key和Type

Javascript:
```javascript
var lk=hmm.LandmarkKey.New("key","type")
```

Lua:
```lua
local lk=hmm.LandmarkKey:New("key","type")
```

### 属性

| 属性名 | 类型   | 说明 |
| ------ | ------ | ---- |
| Key    | string | 主键 |
| Type   | string | 类型 |

#### Key 属性

地标的主键，一般为对应的房间Key

#### Type 属性

地标类型

### 方法

| 方法名   | 参数             | 返回值  | 说明                            |
| -------- | ---------------- | ------- | ------------------------------- |
| ToString | 无               | string  | 转换为字符串                    |
| Equal    | obj: LandmarkKey | boolean | 判断与另一个LandmarkKey是否相等 |

#### ToString 方法

将键和类型转义后，以回车符号拼接。

**参数**
无

**返回值**

拼接后的字符串

**代码范例**

Javascript:
```javascript
var str=lk.ToString()
```
Lua:
```lua
local str=lk:ToString()
```

#### Equal 方法

判断是否和另一个LandmarkKey相等

Javascript:
```javascript
var same=lk.Equal(hmm.LandmarkKey.New("key","type")
```

Lua:
```lua
local same=lk:Equal(hmm.LandmarkKey:New("key","type"))
```

## Landmark 地标

记录用于定位的数据。

同一个Key支持通过多种不同的Type进行定位

一般情况下，程序应该在加载时读取所有地标信息，生成所有的定位所需数据/代码

### 创建方式

Javascript:
```javascript
var landmark=hmm.Landmark.New()
landmark.Key="gc"
landmark.Type="regexp"
landmark.Value="^  这里是扬州的中心广场"
landmark.Group="常规定位"
landmark.Desc="描述"
```

Lua:
```lua
local landmark=hmm.Landmark:New()
landmark.Key="gc"
landmark.Type="regexp"
landmark.Value="^  这里是扬州的中心广场"
landmark.Group="常规定位"
landmark.Desc="描述"
```
### 属性

| 属性名 | 类型   | 说明 |
| ------ | ------ | ---- |
| Key    | string | 主键 |
| Type   | string | 类型 |
| Value  | string | 值   |
| Desc   | string | 描述 |
| Group  | string | 分组 |

#### Key 属性

地标主键

#### Value 属性

具体用来定位的数据

#### Desc 属性

描述，做备注，无实际作用
#### Type 属性

类型 判断怎么处理Value

#### Group 属性

分组，可以用于筛选

### 方法

| 方法名    | 参数     | 返回值      | 说明                         |
| --------- | -------- | ----------- | ---------------------------- |
| Validated | 无       | bool        | 判断Landmark是否有效         |
| Clone     | 无       | Landmark    | 克隆一个Landmark             |
| Equal     | Landmark | bool        | 判断是否和另一个Landmark相等 |
| UniqueKey | 无       | LandmarkKey | 返回地表对应的LandmarkKey    |

#### Validated 方法

判断Landmark是否有效。

主键不可为空，需要符合ItemKey验证

Javascript:
```javascript
var validated=landmark.Validated()
```

Lua:
```lua
local validated=landmark:Validated()
```

#### Clone 方法

复制一个独立的Landmark

Javascript:
```javascript
var newlandmark=landmark.Clone()
```

Lua:
```lua
local newlandmark=landmark:Clone()
```

#### Equal 方法

判断是否和另一个Landmark相等

Javascript:
```javascript
var same=landmark.Equal(hmm.Landmark.New()
```

Lua:
```lua
local same=landmark:Equal(hmm.Landmark:New())
```

#### UniqueKey  方法

获得Landmark对应的唯一标识LandmarkKey

**参数**

无

**返回值**

对应的LandmarkKey

**代码范例**

Javascript:
```javascript
var lk=landmark.UniqueKey()
```

Lua:
```lua
local lk=landmark:UniqueKey()
```
## RoomConditionExit 房间条件出口

带房间条件的出口，一般用于飞行类不定起点出口

### 创建方式

Javascript:
```javascript
var rce=hmm.RoomConditionExit.New()
rce.Command="rideto gc"
rce.To="yzzxgc"
rce.RoomConditions=[hmm.ValueCondition.New("outside",1,false)]
rce.Conditions=[hmm.ValueCondition.New("ride",1,false)]
rce.Cost=2
```

Lua:
```lua
local rce=hmm.RoomConditionExit:New()
rce.Command="rideto gc"
rce.To="yzzxgc"
rce.RoomConditions={hmm.ValueCondition:New("outside",1,false)}
rce.Conditions={hmm.ValueCondition:New("ride",1,false)}
rce.Cost=2
```
### 属性

| 属性名         | 类型                | 说明                 |
| -------------- | ------------------- | -------------------- |
| Command        | string              | 指令(继承自Exit)     |
| To             | string              | 目标(继承自Exit)     |
| RoomConditions | []ValueCondition=[] | 房间条件列表         |
| Conditions     | []ValueCondition=[] | 条件列表(继承自Exit) |
| Cost           | number=1            | 消耗 (继承自Exit)    |

#### Command 属性

出口的实际指令，不可为空，继承自Exit

#### To 属性

出口对应的房间。建议待处理的可以用 * 或 ？占位，继承自Exit

#### RoomConditions 属性

房间条件列表，房间Tag必须符合所有Condition，才能使用出口

#### Conditions 属性

值条件列表

必须在Context里满足所有Condition,才能使用出口，继承自Exit

#### Cost 属性

出口的消耗，默认1.

计算路径时的出口消耗。小于1的值属于Undefined Behave

继承自Exit


## Shortcut 捷径

捷径指能从任意符合条件的位置进入的出口。

继承自RoomConditionExit

### 创建方式

Javascript
```javascript
var shortcut=hmm.Shortcut.New()
shortcut.Key="rideyz"
shortcut.Group="ride"
shortcut.Desc="描述"
shortcut.Command="rideto gc"
shortcut.To="yzzxgc"
shortcut.RoomConditions=[hmm.ValueCondition.New("outside",1,false)]
shortcut.Conditions=[hmm.ValueCondition.New("ride",1,false)]
shortcut.Cost=2
```

Lua
```lua
local shortcut=hmm.Shortcut:New()
shortcut.Key="rideyz"
shortcut.Group="ride"
shortcut.Desc="描述"
shortcut.Command="rideto gc"
shortcut.To="yzzxgc"
shortcut.RoomConditions={hmm.ValueCondition:New("outside",1,false)}
shortcut.Conditions={hmm.ValueCondition:New("ride",1,false)}
shortcut.Cost=2
```

### 属性

| 属性名         | 类型                | 说明                                  |
| -------------- | ------------------- | ------------------------------------- |
| Key            | string              | 主键                                  |
| Group          | string              | 分组                                  |
| Desc           | string              | 描述                                  |
| Command        | string              | 指令(继承自Exit)                      |
| To             | string              | 目标(继承自Exit)                      |
| RoomConditions | []ValueCondition=[] | 房间条件列表(继承自RoomConditionExit) |
| Conditions     | []ValueCondition=[] | 条件列表(继承自Exit)                  |
| Cost           | number=1            | 消耗 (继承自Exit)                     |

#### Key 属性

捷径的主键

#### Group 属性

捷径的分组

#### Desc 属性

描述属性，备注用，无实际用途。

#### Command 属性

出口的实际指令，不可为空，继承自Exit

#### To 属性

出口对应的房间。建议待处理的可以用 * 或 ？占位，继承自Exit

#### RoomConditions 属性

房间条件列表，房间Tag必须符合所有Condition，才能使用出口，继承自RoomConditionExit

#### Conditions 属性

值条件列表

必须在Context里满足所有Condition,才能使用出口，继承自Exit

#### Cost 属性

出口的消耗，默认1.

计算路径时的出口消耗。小于1的值属于Undefined Behave

继承自Exit

### 方法

| 方法名    | 参数     | 返回值   | 说明                         |
| --------- | -------- | -------- | ---------------------------- |
| Validated | 无       | bool     | 判断Shortcut是否有效         |
| Clone     | 无       | Shortcut | 克隆一个Shortcut             |
| Equal     | Shortcut | bool     | 判断是否和另一个Shortcut相等 |

#### Validated 方法

判断Shortcut是否有效。

主键不可为空，需要符合ItemKey验证

Command不可为空(继承自Exit)

Javascript:
```javascript
var validated=shortcut.Validated()
```

Lua:
```lua
local validated=shrotcut:Validated()
```

#### Clone 方法

复制一个独立的Shortcut

Javascript:
```javascript
var newshortcut=shortcut.Clone()
```

Lua:
```lua
local newshortcut=shortcut:Clone()
```

#### Equal 方法

判断是否和另一个Shortcut相等

Javascript:
```javascript
var same=shortcut.Equal(hmm.Shortcut.New()
```

Lua:
```lua
local same=shortcut:Equal(hmm.Shortcut:New())
```

## Variable 变量

变量指存在地图文件中，脚本可以通过Key获取的属性，用于向脚本传递一些额外信息。

### 创建方式

Javascript:
```javascript
var variable=hmm.Variable.New()
variable.Key="myvar"
variable.Value="12345"
variable.Group="demovar"
variable.Desc="描述"
```

Lua:
```lua
var variable=hmm.Variable:New()
variable.Key="myvar"
variable.Value="12345"
variable.Group="demovar"
variable.Desc="描述"
```
### 属性

| 属性名 | 类型   | 说明   |
| ------ | ------ | ------ |
| Key    | string | 主键   |
| Value  | string | 变量值 |
| Group  | string | 分组   |
| Desc   | string | 描述   |

#### Key 属性

变量的主键

#### Value 属性

传递给脚本的值

#### Group 属性

分组

#### Desc 属性

描述属性，备注用，无实际用途。

### 方法

| 方法名    | 参数     | 返回值   | 说明                         |
| --------- | -------- | -------- | ---------------------------- |
| Validated | 无       | bool     | 判断Variable是否有效         |
| Clone     | 无       | Variable | 克隆一个Variable             |
| Equal     | Variable | bool     | 判断是否和另一个Variable相等 |

#### Validated 方法

判断Variable是否有效。

主键不可为空，需要符合ItemKey验证


Javascript:
```javascript
var validated=variable.Validated()
```

Lua:
```lua
local validated=variable:Validated()
```

#### Clone 方法

复制一个独立的Variable

Javascript:
```javascript
var newvariable=variable.Clone()
```

Lua:
```lua
local newvariable=variable:Clone()
```

#### Equal 方法

判断是否和另一个Variable相等

Javascript:
```javascript
var same=variable.Equal(hmm.Variable.New()
```

Lua:
```lua
local same=variable:Equal(hmm.Variable:New())
```

## SnapshotKey 快照主键


 快照和一般的地图结构不一样，由Key,Value,Type构成一组唯一主键


### 创建方式

依次传入Key，Type和Value

Javascript:
```javascript
var sk=hmm.SnapshotKey.New("key","type","value")
```

Lua:
```lua
local sk=hmm.SnapshotKey:New("key","type","value")
```

### 属性

| 属性名 | 类型   | 说明 |
| ------ | ------ | ---- |
| Key    | string | 主键 |
| Type   | string | 类型 |
| Value  | string | 值   |

#### Key 属性

快照的主键，一般为对应的房间Key

#### Type 属性

快照类型

#### Value 属性

具体的快照值

### 方法

| 方法名   | 参数             | 返回值  | 说明                            |
| -------- | ---------------- | ------- | ------------------------------- |
| ToString | 无               | string  | 转换为字符串                    |
| Equal    | obj: SnapshotKey | boolean | 判断与另一个SnapshotKey是否相等 |

#### ToString 方法

将键,类型，值转义后，以回车符号拼接。

**参数**
无

**返回值**

拼接后的字符串

**代码范例**

Javascript:
```javascript
var str=sk.ToString()
```
Lua:
```lua
local str=sk:ToString()
```

#### Equal 方法

判断是否和另一个SnapshotKey相等

Javascript:
```javascript
var same=sk.Equal(hmm.SnapshotKey.New("key","type","value")
```

Lua:
```lua
local same=sk:Equal(hmm.SnapshotKey:New("key","type","value"))
```

## Snapshot 快照

快照指对房间可能变化的环境变量进行的保存。

可以通过搜索快照的方式来快速定位快照

### 创建方式

Javascript:
```Javascript
//一般不会直接创建快照对象，通过APITakeSnapshot建立。
var snapshot=hmm.Snapshot.New()
snapshot.Key="yzgc"
snapshot.Type="desc"
snapshot.Value="这里是扬州广场"
snapshot.Timestamp=1700000000
snapshot.Group="mygroup"
snapshot.Count=1
```

Lua:
```lua
--一般不会直接创建快照对象，通过APITakeSnapshot建立。
local snapshot=hmm.Snapshot:New()
snapshot.Key="yzgc"
snapshot.Type="desc"
snapshot.Value="这里是扬州广场"
snapshot.Timestamp=1700000000
snapshot.Group="mygroup"
snapshot.Count=1
```

### 属性

| 属性名    | 类型     | 说明       |
| --------- | -------- | ---------- |
| Key       | string   | 快照主键   |
| Type      | string   | 快照类型   |
| Value     | string   | 快照值     |
| Timestamp | number   | Unix时间戳 |
| Count     | number=1 | 重复次数   |

#### Key 属性

快照主键，一般是对应的房间Key

#### Type 主键

快照类型，一般决定了Value中存的是什么信息

#### Value 主键

具体的快照值

#### Timestamp 时间戳

快照的更新时间

#### Count 重复次数

同一组 Key,Type,Value的重复次数

每次TakeSnapshot时会加1

### 方法

| 方法名    | 参数     | 返回值      | 说明                         |
| --------- | -------- | ----------- | ---------------------------- |
| Validated | 无       | bool        | 判断Snapshot是否有效         |
| Clone     | 无       | Snapshot    | 克隆一个Snapshot             |
| Equal     | Snapshot | bool        | 判断是否和另一个Snapshot相等 |
| UniqueKey | 无       | SnapshotKey | 获取对应的SnapshotKey        |
| Repeat    | 无       | 无          | Count自增1                   |

#### UniqueKey 方法

获取快照对应的 SnapshotKey属性

**参数**

无

**返回值**

SnapshotKey

**代码范例**

Javascipt:
```javascript
var sk=snapshot.UniqueKey()
```

Lua:
```lua
local sk=snapshot:UniqueKey()
```

#### Repeat 方法

重复的快照， Count属性自增1

**参数**

无

**返回值**

无

**代码范例**

Javascript:
```javascript
snapshot.Repeat()
```

Lua:
```lua
snapshot:Repeat()
```

#### Validated 方法

判断Snapshot是否有效。

主键不可为空，需要符合ItemKey验证


Javascript:
```javascript
var validated=snapshot.Validated()
```

Lua:
```lua
local validated=snapshot:Validated()
```

#### Clone 方法

复制一个独立的Snapshot

Javascript:
```javascript
var newsnapshot=snapshot.Clone()
```

Lua:
```lua
local newsnapshot=snapshot:Clone()
```

#### Equal 方法

判断是否和另一个Snapshot相等

Javascript:
```javascript
var same=snapshot.Equal(hmm.Snapshot.New()
```

Lua:
```lua
local same=snapshot:Equal(hmm.Snapshot:New())
```

## SnapshotFilter 快照过滤器

快照过滤器是用来批量删除快照的过滤器

### 创建方式

依次传入 Key,Type,Group

通过WithMaxCount 传入MaxCount

Javascript:
```javascript
var sf=hmm.SnapshotFilter.New("yzgc","regexp","mygroup").WithMaxCount(1)
```

Lua:
```lua
local sf=hmm.SnapshotFilter:New("yzgc","regexp","mygroup"):WithMaxCount(1)
```

### 属性

| 属性名   | 类型         | 说明                |
| -------- | ------------ | ------------------- |
| Key      | string\|null | 过滤的主键          |
| Type     | string\|null | 过滤的类型          |
| Group    | string\|null | 过滤的分组          |
| MaxCount | number = 0   | 过滤的最大Count数字 |

属性如果不为空，那么只有具有相同属性的Snapshot才会通过过滤

多个属性之间是 and 关系

**更新记录**

* 版本1002 加入 MaxCount

### 方法

| 方法名       | 参数   | 返回值         | 说明                   |
| ------------ | ------ | -------------- | ---------------------- |
| WithMaxCount | number | SnapshotFilter | 链式调用，设置MaxCount |

**更新记录**

* 版本1002 加入 WithMaxCount
* 
## SnapshotSearch 快照搜索类

快照搜索类用于搜索具有特定指的快照

### 创建方式

Javascript:
```javascript
var ss=hmm.SnapshotSearch.New()
ss.Type="regexp"
ss.Group="mygroup"
ss.Keyword=["扬州","广场"]
ss.PartialMatch=true
ss.Any=false
```

Lua:
```lua
local ss=hmm.SnapshotSearch:New()
ss.Type="regexp"
ss.Group="mygroup"
ss.Keyword=["扬州","广场"]
ss.PartialMatch=true
ss.Any=false
```

### 属性

| 属性名       | 类型                  | 说明         |
| ------------ | --------------------- | ------------ |
| Type         | string \| null = null | 搜索类型     |
| Group        | string \| null = null | 搜索分组     |
| Keywords     | []string=[]           | 关键字列表   |
| PartialMatch | bool= true            | 部分匹配     |
| Any          | bool=false            | 任意满足     |
| MaxNoise     | number=0              | 最大噪声数据 |
#### Type 属性

限制快照类型，留空不限制

#### Group 属性

限制快照分组，留空不限制

#### Keywords  属性

关键字列表

搜索关键字，关键字列表，具体效果和下面两个参数相关

留空返回与Any相反的结果。

#### PartialMatch 属性

部分匹配，默认表现为只要关键字出现在快照内容内就匹配。为false则必须完整匹配

#### Any 属性

任意满足一般用在完整匹配时，任何一个关键字匹配则快照匹配

#### MaxNoise 属性

最大噪声数据。

Any为false的情况下，每一个不匹配的关键字为一个噪音数据。

噪音数据数量超过 NaxNoise属性则匹配失败。

## SnapshotSearchResult

快照搜索API返回的结果

### 属性

| 属性名 | 类型       | 说明                          |
| ------ | ---------- | ----------------------------- |
| Key    | string     | 结果对应的房间主键            |
| Sum    | number     | 房间的快照总Count             |
| Count  | number     | 房间匹配搜索条件的快照总Count |
| Items  | []Snapshot | 具体匹配搜索条件的快照详情    |


## Link

代表从一个房间到另一个房间的链接，用于Context

### 创建方式

依次传入起点和终点

Javascript:
```javascript
var link=hmm.Link.New("0","1")
```

Lua:
```lua
local link=hmm.Link:New("0","1")
```

### 属性

| 属性名 | 类型   | 说明 |
| ------ | ------ | ---- |
| From   | string | 起点 |
| To     | string | 终点 |

## CommandCost 指令消耗

代表通过某个指令到达某地的消耗，用于Context

### 创建方式

依次转入指令，目标和消耗

Javascript:
```javascript
var cc=hmm.CommandCost.New("rideto gc","gc",5)
```


Lua:
```lua
local cc=hmm.CommandCost:New("rideto gc","gc",5)
```

### 属性

| 属性名  | 类型   | 说明 |
| ------- | ------ | ---- |
| Command | string | 指令 |
| To      | string | 终点 |
| Cost    | number | 消耗 |

## Path 临时路径

带起点的临时路径，继承自Exit

### 创建方式

Javascript:
```javascript
var path=hmm.Path.New()
path.From="gc"
path.Command="north"
path.To="0"
path.Conditions=[hmm.ValueCondition.New("gb",1,false)]
path.Cost=1
```

Lua:
```lua
local path=hmm.Path:New()
path.From="gc"
path.Command="north"
path.To="0"
path.Conditions={hmm.ValueCondition:New("gb",1,false)]
path.Cost=1
```

### 属性

| 属性名     | 类型                | 说明                 |
| ---------- | ------------------- | -------------------- |
| From       | string              | 起点                 |
| Command    | string              | 指令(继承自Exit)     |
| To         | string              | 目标(继承自Exit)     |
| Conditions | []ValueCondition=[] | 条件列表(继承自Exit) |
| Cost       | number=1            | 消耗 (继承自Exit)    |

#### From 属性

临时路径起点

#### Command 属性

出口的实际指令，不可为空，继承自Exit

#### To 属性

出口对应的房间。建议待处理的可以用 * 或 ？占位，继承自Exit

#### RoomConditions 属性

房间条件列表，房间Tag必须符合所有Condition，才能使用出口

#### Conditions 属性

值条件列表

必须在Context里满足所有Condition,才能使用出口，继承自Exit

#### Cost 属性

出口的消耗，默认1.

计算路径时的出口消耗。小于1的值属于Undefined Behave

继承自Exit

## Context 上下文

上下文是计算和查询路径时的临时环境

### 创建方式

Javascript:
```javascript
var ctx=hmm.Context.New()
```

Lua:
```lua
local ctx=hmm.Context:New()
```

### 方法

| 方法名              | 参数                         | 返回值  | 说明                       |
| ------------------- | ---------------------------- | ------- | -------------------------- |
| ClearTags           | 无                           | Context | 链式调用，清除所有标签     |
| WithTags            | tags: []ValueTag             | Context | 链式调用，插入标签         |
| ClearRoomConditions | 无                           | Context | 链式调用，清除所有房间条件 |
| WithRoomConditions  | conditions: []ValueCondition | Context | 链式调用，插入房间条件     |
| ClearRooms          | 无                           | Context | 链式调用，清除所有临时房间 |
| WithRooms           | rooms: []Room                | Context | 链式调用，插入临时房间     |
| ClearWhitelist      | 无                           | Context | 链式调用，清除所有白名单   |
| WithWhitelist       | list: []string               | Context | 链式调用，插入白名单       |
| ClearBlacklist      | 无                           | Context | 链式调用，清除所有黑名单   |
| WithBlacklist       | list: []string               | Context | 链式调用，插入黑名单       |
| ClearShortcuts      | 无                           | Context | 链式调用，清除所有捷径     |
| WithShortcuts       | list: []RoomConditionExit    | Context | 链式调用，插入捷径         |
| ClearPaths          | 无                           | Context | 链式调用，清除所有临时路径 |
| WithPaths           | list: []Path                 | Context | 链式调用，插入临时路径     |
| ClearBlockedLinks   | 无                           | Context | 链式调用，清除所有拦截连接 |
| WithBlockedLinks    | list: []Link                 | Context | 链式调用，插入拦截连接     |
| ClearCommandCosts   | 无                           | Context | 链式调用，清除所有指令消耗 |
| WithCommandCosts    | list: []CommandCost          | Context | 链式调用，插入指令消耗     |

* 所有的方法都会返回Context本身，方便链式调用

**版本更新**

* 1002 版之后，CommandCosts支持To为空字符串作为通配符，匹配所有出口。


## MapperOptions 地图选项

在地图计算时一次性使用的选项

### 创建方式

Javascript:
```javascript
var opt=hmm.MapperOptions.New()
opt.MaxExitCost=0
opt.TotalCost=0
opt.DisableShortcuts=false
```

Lua:
```lua
local opt=hmm.MapperOptions:New()
opt.MaxExitCost=0
opt.TotalCost=0
opt.DisableShortcuts=false
```

### 属性

| 属性名             | 类型                   | 说明           |
| ------------------ | ---------------------- | -------------- |
| MaxExitCost        | number = 0             | 最大出口消耗   |
| MaxTotalCost       | number = 0             | 最大路线总消耗 |
| DisableShortcuts   | bool = false           | 禁止使用捷径   |
| CommandWhitelist   | [key: string]: boolean | 指令白名单     |
| CommandNotContains | list:[]string          | 指令不包含清单 |

**版本更新**

* 1005 加入 CommandNotContains 属性
* 1002 加入 CommandWhitelist 属性。

#### MaxExitCost 属性

最大出口消耗，忽略Cost大于本值的出口，小于等于0忽略

#### MaxTotalCost 属性

最大路线消耗，计算路径超过这个值时路线计算失败，小于等于0忽略

#### DisableShortcuts 属性

计算路线时是否不使用捷径

#### CommandWhitelist 指令白名单

指令必须在白名单内，出口才有效，为空忽略。

#### CommandNotContains 指令不包含清单

如果指令包含清单内的字符串，则出口无效

### 方法

| 方法名                  | 参数           | 返回值        | 说明                           |
| ----------------------- | -------------- | ------------- | ------------------------------ |
| WithMaxExitCost         | cost: number   | MapperOptions | 链式调用，设置MaxExitCost      |
| WithMaxTotalCost        | cost: number   | MapperOptions | 链式调用，设置MaxTotalCost     |
| WithDisableShortcuts    | disable: bool  | MapperOptions | 链式调用，设置DisableShortcuts |
| WithCommandWhitelist    | list: []string | MapperOptions | 链式调用，加入指令白名单       |
| ClearCommandWhitelist   | 无             | MapperOptions | 链式调用，清除白名单           |
| WithCommandNotContains  | list: []string | MapperOptions | 链式调用，加入指令不包含       |
| ClearCommandNotContains | 无             | MapperOptions | 链式调用，清除指令不包含       |


**版本更新**

* 1005 加入WithCommandNotContains和ClearCommandNotContains
* 1002 加入 WithCommandWhitelist和ClearCommandWhitelist方法


## Step 移动步骤

移动步骤对象是查询路线的结果的一部分。

### 属性

| 属性名  | 类型   | 说明       |
| ------- | ------ | ---------- |
| Command | string | 指令       |
| Target  | string | 移动的目标 |
| Cost    | number | 移动的消耗 |

## QueryResult 路线规划结果

路线规划结果是APIQueryPath系列接口 返回的查询结果

### 属性

| 属性名    | 类型     | 说明                     |
| --------- | -------- | ------------------------ |
| From      | string   | 路线规划起点             |
| To        | string   | 目的地                   |
| Cost      | number   | 路线总消耗               |
| Steps     | []Step   | 按顺序的移动步骤         |
| Unvisited | []string | 多目的时未到达的目的列表 |
