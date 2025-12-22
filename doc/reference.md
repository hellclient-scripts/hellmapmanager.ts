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
--hmmt的当前数据库
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

主键值，不可谓空

#### Value 属性

标签值。

如果标签代表真，则标签值为1。如果标签代表假，则标签值为0。

与值标签匹配时，会判断同键值的值条件的值。如果条件值大于等于标签值，则匹配，否则不匹配。

### 方法

| 方法名            | 参数                         | 返回值   | 说明                         |
| ----------------- | ---------------------------- | -------- | ---------------------------- |
| Validated         | 无                           | bool     | 判断ValueTag是否有效         |
| Clone             | 无                           | ValueTag | 克隆一个ValueTag             |
| Equal             | ValueTag                     | bool     | 判断是否和另一个ValueTag相等 |
| ValidteConditions | ValueTag[], ValueCondition[] | boolean  | 批量匹配                     |

#### Validated 方法

判断ValueTag是否有效。ValueTag的Key不可为空。

Javascript:
```javascript
var validated=tag.Validated()
```

Lua:
```lua
local validted=tag:Validated()
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

Javacript:
```javascript
var same=tag.Equal(hmm.ValueTag.New("key",1))
```

Lua:
```lua
local same=tag:Equal(hmm.ValueTag:New("key",1))
```

#### ValidteConditions 方法

静态方法

批量匹配传入的值标签列表和值条件列表。

如果有任何一个不匹配，返回false,否则返回true

Javascript:
```javascript
var matched=ValueTag.ValidteConditions(
    [hmm.ValueTag.New("Key1",1)，hmm.ValueTag.New("Key2",2)],
    [hmm.ValueCondition.New("Key1",1,false),hmm.ValueCondition.New("Key2",1,true)]
)
```

Lua:
```lua
local matched=ValueTag:ValidteConditions(
    {hmm.ValueTag:New("Key1",1)，hmm.ValueTag:New("Key2",2)},
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
local validted=vc:Validated()
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

Javacript:
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
local validted=data:Validated()
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

Javacript:
```javascript
var same=vc.Equal(hmm.Data.New("key",1,false))
```

Lua:
```lua
local same=vc:Equal(hmm.Data:New("key",1,false))
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
exit.Conditions=[hnn.ValueCondition.New("gb",1,false)]
exit.Cost=1
```

Lua:
```lua
local exit=hmm.Exit:New()
exit.Command="north"
exit.To="0"
exit.Conditions={hnn.ValueCondition:New("gb",1,false)}
exit.Cost=1
```

### 属性

| 属性名     | 类型             | 说明         |
| ---------- | ---------------- | ------------ |
| Command    | string           | 出口的指令   |
| To         | string           | 出口目标     |
| Conditions | []ValueCondition | 出口的值条件 |
| Cost       | number           | 出口的消耗   |

#### Commnad 属性

出口的实际指令，不可为空

#### To 属性

出口对应的房间。建议带处理的可以用 * 或 ？占位

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
local validted=exit:Validated()
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

Javacript:
```javascript
var same=vc.Equal(hmm.Exit.New("key",1,false))
```

Lua:
```lua
local same=vc:Equal(hmm.Exit:New("key",1,false))
```

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
exit.Conditions=[hmm.Condition.New("isWiz",1,false)]
exit.Cost=1
room.Exits=[exit]
room.SetData(hmm.Data.New("datekey","datavalue"))
```

Lua:
```lua
var room=hmm.Room:New()
room.Key="myroom"
room.Name="我的房间"
room.Desc="abcdefg"
room.Tags={hmm.Tag:New("indoor",1)}
var exit=hmm.Exit:New()
exit.Command="out"
exit.To="chatroom"
exit.Conditions={hmm.Condition:New("isWiz",1,false)}
exit.Cost=1
room.Exits=[exit]
room:SetData(hmm.Data:New("datekey","datavalue"))
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

判断Room是否有效。Room的Command不可为空。

主键不可为空，需要符合ItemKey验证


Javascript:
```javascript
var validated=room.Validated()
```

Lua:
```lua
local validted=room:Validated()
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

Javacript:
```javascript
var same=vc.Equal(hmm.Room.New())
```

Lua:
```lua
local same=vc:Equal(hmm.Room:New())
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
local match=room:Hastag("outdoor,1")
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

* rd 房间数据，如果有同名会进行更新，如果Value为空字符串则会只删除

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