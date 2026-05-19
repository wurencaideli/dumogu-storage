## dumogu-storage

シンプルで軽量なフロントエンドストレージツール。圧縮後 3 KB 未満。

### 特徴

- 複数のストレージバックエンドに対応: `localStorage`、`sessionStorage`、uni-app、WeChat ミニプログラム
- リアルタイム読み取りモード — 常にストレージから最新データを取得
- 前処理フック — 読み書き時にデータをインターセプトして変換
- 依存関係ゼロ
- 完全な TypeScript サポート

### インストール

```bash
npm install dumogu-storage
```

### クイックスタート

```ts
import DumoguStorage from 'dumogu-storage';

const store = new DumoguStorage('myKey', { count: 0 }, {
    modelName: 'local',
});

console.log(store.value); // { count: 0 }

store.value = { count: 1 };  // 自動的に永続化
console.log(store.value);    // { count: 1 }
```

### API

#### `new DumoguStorage(key, initialValue, options?)`

ストレージインスタンスを作成します。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `key` | `string` | はい | 一意のストレージキー |
| `initialValue` | `any` | はい | キャッシュが存在しない場合に使用される初期値 |
| `options` | `DumoguStorageOption` | いいえ | 設定オブジェクト |

**`DumoguStorageOption`**

| プロパティ | 型 | デフォルト | 説明 |
|----------|------|---------|-------------|
| `modelName` | `'local' \| 'session' \| 'uni' \| 'wx'` | — | 組み込みストレージバックエンド |
| `model` | `Model` | — | カスタムストレージバックエンド（`modelName` を上書き） |
| `isRealTime` | `boolean` | `false` | `true` にすると、毎回ストレージから直接読み取る |
| `beforeSet` | `(value: any) => any` | — | 書き込み前に呼ばれるフック。新しい値を受け取り、変換後の値を返す |
| `beforeGet` | `(value: any) => any` | — | 読み取り後に呼ばれるフック。生の値を受け取り、変換後の値を返す |

#### `.value`

保存されたデータを取得または設定します。値を設定すると自動的にストレージバックエンドに永続化されます。

- **取得** — `isRealTime` が `true` の場合、ストレージから最新データを読み取り、その後 `beforeGet` を適用（設定されている場合）。
- **設定** — `beforeSet` を適用（設定されている場合）、その後ストレージに永続化。

```ts
store.value = { name: 'Alice' };
console.log(store.value); // { name: 'Alice' }
```

#### `.getValue()`

現在の値を返します。`.value` と同じ取得ロジック（`isRealTime` と `beforeGet` を含む）を通過します。

```ts
const data = store.getValue();
```

#### `.setValue(value)`

現在の値を設定します。`.value` と同じ設定ロジック（`beforeSet` と永続化を含む）を通過します。

```ts
store.setValue({ name: 'Bob' });
```

#### `.refresh()`

ストレージバックエンドからデータを再読み取りし、メモリ内の値を上書きします。

```ts
store.refresh();
```

#### `.keys()`

現在ストレージバックエンドに保存されているすべてのキーを返します。

```ts
const allKeys = store.keys(); // string[]
```

#### `.remove()`

ストレージバックエンドからこのインスタンスのデータを削除し、メモリ内の値をクリアします。

```ts
store.remove();
```

#### `.destroy()`

内部参照をすべて削除してインスタンスを破棄します。呼び出し後はそのインスタンスを使用しないでください。

```ts
store.destroy();
// store.isDestroyed === true
```

### 組み込みストレージバックエンド

`modelName` で設定:

| 値 | バックエンド | 環境 |
|-------|---------|-------------|
| `'local'` | `localStorage` | ブラウザ |
| `'session'` | `sessionStorage` | ブラウザ |
| `'uni'` | `uni.getStorageSync` / `uni.setStorageSync` | uni-app |
| `'wx'` | `wx.getStorageSync` / `wx.setStorageSync` | WeChat ミニプログラム |

```ts
// sessionStorage を使用
const store = new DumoguStorage('key', null, { modelName: 'session' });
```

### データ前処理

`beforeSet` と `beforeGet` フックを使用してデータを透過的に変換します。

```ts
const store = new DumoguStorage('counter', 0, {
    modelName: 'local',
    beforeSet(value) {
        // ストレージに保存する前に呼ばれる
        return value + 1;
    },
    beforeGet(value) {
        // ストレージから読み取った後に呼ばれる
        return value - 1;
    },
});

store.value = 5;
// beforeSet は 5 を受け取り、6 を返す → 6 が保存される

console.log(store.value); // 5
// beforeGet は 6 を受け取り、5 を返す
```

### リアルタイムモード

`isRealTime` が `true` の場合、毎回の読み取りがメモリ内のキャッシュ値ではなく、ストレージバックエンドから直接取得されます。複数のタブやコンポーネントが同じキーを変更する可能性がある場合に便利です。

```ts
const store = new DumoguStorage('sharedKey', null, {
    modelName: 'local',
    isRealTime: true,
});

// 毎回 localStorage から読み取る
console.log(store.value);
```

### カスタムストレージバックエンド

`Model` インターフェースを実装したオブジェクトを `model` に渡して、カスタムストレージバックエンドを使用します。

```ts
import DumoguStorage, { Model } from 'dumogu-storage';

const customModel: Model = {
    name: 'custom',
    get(key) {
        // カスタム読み取りロジック
    },
    set(key, value) {
        // カスタム書き込みロジック
    },
    remove(key) {
        // カスタム削除ロジック
    },
    keys() {
        // すべてのキーを返す
    },
};

const store = new DumoguStorage('key', null, { model: customModel });
```

### ライセンス

MIT
