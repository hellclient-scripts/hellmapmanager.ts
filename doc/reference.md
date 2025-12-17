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

| 方法名    | 参数     | 返回值         | 说明                               |
| --------- | -------- | -------------- | ---------------------------------- |
| Validated | 无       | bool           | 判断ValueCondition是否有效         |
| Clone     | 无       | ValueCondition | 克隆一个ValueCondition             |
| Equal     | ValueTag | bool           | 判断是否和另一个ValueCondition相等 |

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