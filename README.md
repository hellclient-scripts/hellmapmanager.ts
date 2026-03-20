# HellMapManager.ts

用于处理 [HellMapManager](https://github.com/hellclient-scripts/hellmapmanager)生成的 HMM格式地图文件的脚本库。

包含功能：

* 读取/维护/生成HMM格式的地图文件。
* 根据地图进行进行查询/路径规划等计算。

欢迎在[Hellclient社区](https://forum.hellclient.com)讨论使用心得。

## 文档

* [快速开始](doc/quickstart.md)
* [API文档](doc/api.md)
* [参考文档](doc/reference.md)
* [更新历史](doc/history.md)

## 注意事项

从API取回的基本数据请不要直接修改。

如果需要修改基本数据，请调用.Clone方法，修改后再调用Insert方法插入回数据库。

## 特别声明

经过实际机器的性能测试，各主流客户端(Mudlet/Mush/LordStar)的Lua都为非jit版本，性能上不足以将hmm.ts作为主力mapper使用。

因此近作数据兼功能，不考虑实际应用。

实际应用需要通过http形式调用api。

[具体参考](https://forum.hellclient.com/topic/42/%E5%BC%80%E5%8F%91-hellmanager.ts-lua%E7%89%88%E6%9C%AC%E6%94%BE%E5%BC%83%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%A3%B0%E6%98%8E)