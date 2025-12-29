# HellMapManager.ts

用于处理 [HellMapManager](https://github.com/hellclient-scripts/hellmapmanager)生成的 HMM格式地图文件的脚本库。

包含功能：

* 读取/维护/生成HMM格式的地图文件。
* 根据地图进行进行查询/路径规划等计算。

## 文档

* [快速开始](doc/quickstart.md)
* [API文档](doc/api.md)
* [参考文档](doc/reference.md)
* [更新历史](doc/history.md)

## 注意事项

从API取回的基本数据请不要直接修改。

如果需要修改基本数据，请调用.Clone方法，修改后再调用Insert方法插入回数据库。