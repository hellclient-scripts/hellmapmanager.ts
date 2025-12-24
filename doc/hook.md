# 钩子函数

## 读写钩子
系统底层HMMEncoder的提供了2组钩子函数，用于在读hmm和写hmm程序时做执行相应的代码。

### HMMEncoder.EncodeRoomHook

```typescript
HMMEncoder.EncodeRoomHook: (model: Room) => Room | null
```

写入房间的钩子函数，可以在写入前对Room进行修改处理。返回null则跳过该房间


### HMMEncoder.DecodeRoomHook

```typescript
HMMEncoder.DecodeRoomHook: (model: Room) => Room | null
```

读取房间的钩子函数，可以在读取后对Room进行修改处理。返回null则跳过该房间

### HMMEncoder.EncodeShortcutHook
```typescript
EncodeShortcutHook: (model: Shortcut) => Shortcut | null
```

写入捷径的钩子函数，可以在写入前对Shortcut进行修改处理。返回null则跳过该捷径

### HMMEncoder.DecodeShortcutHook
```typescript
DecodeShortcutHook: (model: Shortcut) => Shortcut | null
```

读取捷径的钩子函数，可以在读取后对Shortcut进行修改处理。返回null则跳过该捷径