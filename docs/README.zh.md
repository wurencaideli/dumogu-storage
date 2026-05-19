## dumogu-storage

一个简洁、轻量的前端存储工具，压缩后不到 3 KB。

### 特性

- 支持多种存储后端：`localStorage`、`sessionStorage`、uni-app、微信小程序
- 实时读取模式 — 每次读取都从存储中获取最新数据
- 预处理钩子 — 在读写时拦截并转换数据
- 零依赖
- 完整的 TypeScript 支持

### 安装

```bash
npm install dumogu-storage
```

### 快速开始

```ts
import DumoguStorage from 'dumogu-storage';

const store = new DumoguStorage('myKey', { count: 0 }, {
    modelName: 'local',
});

console.log(store.value); // { count: 0 }

store.value = { count: 1 };  // 自动持久化
console.log(store.value);    // { count: 1 }
```

### API

#### `new DumoguStorage(key, initialValue, options?)`

创建一个存储实例。

| 参数 | 类型 | 必填 | 说明 |
|-----------|------|----------|-------------|
| `key` | `string` | 是 | 唯一的存储键名 |
| `initialValue` | `any` | 是 | 缓存不存在时使用的初始值 |
| `options` | `DumoguStorageOption` | 否 | 配置对象 |

**`DumoguStorageOption`**

| 属性 | 类型 | 默认值 | 说明 |
|----------|------|---------|-------------|
| `modelName` | `'local' \| 'session' \| 'uni' \| 'wx'` | — | 内置存储后端 |
| `model` | `Model` | — | 自定义存储后端（会覆盖 `modelName`） |
| `isRealTime` | `boolean` | `false` | 设为 `true` 时，每次读取都直接从存储中获取 |
| `beforeSet` | `(value: any) => any` | — | 写入前调用的钩子。接收新值，返回转换后的值 |
| `beforeGet` | `(value: any) => any` | — | 读取后调用的钩子。接收原始值，返回转换后的值 |

#### `.value`

获取或设置存储的数据。设置值时会自动持久化到存储后端。

- **读取** — 如果 `isRealTime` 为 `true`，则从存储中读取最新数据，然后应用 `beforeGet`（如果配置了）。
- **写入** — 应用 `beforeSet`（如果配置了），然后持久化到存储。

```ts
store.value = { name: 'Alice' };
console.log(store.value); // { name: 'Alice' }
```

#### `.getValue()`

返回当前值，与 `.value` 的读取逻辑相同（包括 `isRealTime` 和 `beforeGet`）。

```ts
const data = store.getValue();
```

#### `.setValue(value)`

设置当前值，与 `.value` 的写入逻辑相同（包括 `beforeSet` 和持久化）。

```ts
store.setValue({ name: 'Bob' });
```

#### `.refresh()`

从存储后端重新读取数据，覆盖内存中的值。

```ts
store.refresh();
```

#### `.keys()`

返回当前存储后端中的所有键名。

```ts
const allKeys = store.keys(); // string[]
```

#### `.remove()`

从存储后端中删除此实例的数据，并清空内存中的值。

```ts
store.remove();
```

#### `.destroy()`

销毁实例，移除所有内部引用。调用后不应再使用该实例。

```ts
store.destroy();
// store.isDestroyed === true
```

### 内置存储后端

通过 `modelName` 设置：

| 值 | 后端 | 运行环境 |
|-------|---------|-------------|
| `'local'` | `localStorage` | 浏览器 |
| `'session'` | `sessionStorage` | 浏览器 |
| `'uni'` | `uni.getStorageSync` / `uni.setStorageSync` | uni-app |
| `'wx'` | `wx.getStorageSync` / `wx.setStorageSync` | 微信小程序 |

```ts
// 使用 sessionStorage
const store = new DumoguStorage('key', null, { modelName: 'session' });
```

### 数据预处理

使用 `beforeSet` 和 `beforeGet` 钩子对数据进行透明转换。

```ts
const store = new DumoguStorage('counter', 0, {
    modelName: 'local',
    beforeSet(value) {
        // 保存到存储前调用
        return value + 1;
    },
    beforeGet(value) {
        // 从存储读取后调用
        return value - 1;
    },
});

store.value = 5;
// beforeSet 接收到 5，返回 6 → 实际保存的是 6

console.log(store.value); // 5
// beforeGet 接收到 6，返回 5
```

### 实时模式

当 `isRealTime` 为 `true` 时，每次读取都直接从存储后端获取，而不是返回内存中的缓存值。适用于多个标签页或组件可能修改同一个键的场景。

```ts
const store = new DumoguStorage('sharedKey', null, {
    modelName: 'local',
    isRealTime: true,
});

// 每次访问都从 localStorage 读取
console.log(store.value);
```

### 自定义存储后端

传入实现了 `Model` 接口的对象来使用自定义存储后端。

```ts
import DumoguStorage, { Model } from 'dumogu-storage';

const customModel: Model = {
    name: 'custom',
    get(key) {
        // 自定义读取逻辑
    },
    set(key, value) {
        // 自定义写入逻辑
    },
    remove(key) {
        // 自定义删除逻辑
    },
    keys() {
        // 返回所有键名
    },
};

const store = new DumoguStorage('key', null, { model: customModel });
```

### 许可证

MIT
