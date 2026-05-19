## dumogu-storage

A simple, lightweight front-end storage tool. Less than 3 KB after compression.

### Features

- Supports multiple storage backends: `localStorage`, `sessionStorage`, uni-app, WeChat Mini Program
- Real-time read mode — always fetches fresh data from storage
- Preprocessing hooks — intercept and transform data on read/write
- Zero dependencies
- Full TypeScript support

### Install

```bash
npm install dumogu-storage
```

### Quick Start

```ts
import DumoguStorage from 'dumogu-storage';

const store = new DumoguStorage('myKey', { count: 0 }, {
    modelName: 'local',
});

console.log(store.value); // { count: 0 }

store.value = { count: 1 };  // automatically persisted
console.log(store.value);    // { count: 1 }
```

### API

#### `new DumoguStorage(key, initialValue, options?)`

Creates a storage instance.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | Yes | Unique storage key |
| `initialValue` | `any` | Yes | Initial value used when no cached data exists |
| `options` | `DumoguStorageOption` | No | Configuration object |

**`DumoguStorageOption`**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `modelName` | `'local' \| 'session' \| 'uni' \| 'wx'` | — | Built-in storage backend |
| `model` | `Model` | — | Custom storage backend (overrides `modelName`) |
| `isRealTime` | `boolean` | `false` | If `true`, every `get` reads directly from storage |
| `beforeSet` | `(value: any) => any` | — | Hook called before writing. Receives the new value, return the transformed value |
| `beforeGet` | `(value: any) => any` | — | Hook called after reading. Receives the raw value, return the transformed value |

#### `.value`

Gets or sets the stored data. Setting a value automatically persists it to the storage backend.

- **Get** — if `isRealTime` is `true`, reads fresh data from storage. Then applies `beforeGet` if configured.
- **Set** — applies `beforeSet` if configured, then persists to storage.

```ts
store.value = { name: 'Alice' };
console.log(store.value); // { name: 'Alice' }
```

#### `.getValue()`

Returns the current value. Goes through the same getter logic as `.value` (including `isRealTime` and `beforeGet`).

```ts
const data = store.getValue();
```

#### `.setValue(value)`

Sets the current value. Goes through the same setter logic as `.value` (including `beforeSet` and persistence).

```ts
store.setValue({ name: 'Bob' });
```

#### `.refresh()`

Re-reads data from the storage backend, overwriting the in-memory value.

```ts
store.refresh();
```

#### `.keys()`

Returns all keys currently stored in the storage backend.

```ts
const allKeys = store.keys(); // string[]
```

#### `.remove()`

Deletes this instance's data from the storage backend and clears the in-memory value.

```ts
store.remove();
```

#### `.destroy()`

Destroys the instance by removing all internal references. After calling this, the instance should no longer be used.

```ts
store.destroy();
// store.isDestroyed === true
```

### Built-in Storage Backends

Set via `modelName`:

| Value | Backend | Environment |
|-------|---------|-------------|
| `'local'` | `localStorage` | Browser |
| `'session'` | `sessionStorage` | Browser |
| `'uni'` | `uni.getStorageSync` / `uni.setStorageSync` | uni-app |
| `'wx'` | `wx.getStorageSync` / `wx.setStorageSync` | WeChat Mini Program |

```ts
// Use sessionStorage
const store = new DumoguStorage('key', null, { modelName: 'session' });
```

### Data Preprocessing

Use `beforeSet` and `beforeGet` hooks to transform data transparently.

```ts
const store = new DumoguStorage('counter', 0, {
    modelName: 'local',
    beforeSet(value) {
        // Called before saving to storage
        return value + 1;
    },
    beforeGet(value) {
        // Called after reading from storage
        return value - 1;
    },
});

store.value = 5;
// beforeSet receives 5, returns 6 → 6 is saved

console.log(store.value); // 5
// beforeGet receives 6, returns 5
```

### Real-time Mode

When `isRealTime` is `true`, every read goes directly to the storage backend instead of returning the cached in-memory value. Useful when multiple tabs or components may modify the same key.

```ts
const store = new DumoguStorage('sharedKey', null, {
    modelName: 'local',
    isRealTime: true,
});

// Every access reads from localStorage
console.log(store.value);
```

### Custom Storage Backend

Pass a `model` object that implements the `Model` interface to use a custom storage backend.

```ts
import DumoguStorage, { Model } from 'dumogu-storage';

const customModel: Model = {
    name: 'custom',
    get(key) {
        // your get logic
    },
    set(key, value) {
        // your set logic
    },
    remove(key) {
        // your remove logic
    },
    keys() {
        // return all keys
    },
};

const store = new DumoguStorage('key', null, { model: customModel });
```

### License

MIT
