## dumogu-storage

간단하고 가벼운 프론트엔드 스토리지 도구. 압축 후 3KB 미만.

### 특징

- 다양한 스토리지 백엔드 지원: `localStorage`, `sessionStorage`, uni-app, WeChat 미니 프로그램
- 실시간 읽기 모드 — 항상 스토리지에서 최신 데이터를 가져옴
- 전처리 훅 — 읽기/쓰기 시 데이터를 가로채고 변환
- 의존성 없음
- 완전한 TypeScript 지원

### 설치

```bash
npm install dumogu-storage
```

### 빠른 시작

```ts
import DumoguStorage from 'dumogu-storage';

const store = new DumoguStorage('myKey', { count: 0 }, {
    modelName: 'local',
});

console.log(store.value); // { count: 0 }

store.value = { count: 1 };  // 자동으로 저장됨
console.log(store.value);    // { count: 1 }
```

### API

#### `new DumoguStorage(key, initialValue, options?)`

스토리지 인스턴스를 생성합니다.

| 매개변수 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `key` | `string` | 예 | 고유 스토리지 키 |
| `initialValue` | `any` | 예 | 캐시된 데이터가 없을 때 사용할 초기값 |
| `options` | `DumoguStorageOption` | 아니오 | 설정 객체 |

**`DumoguStorageOption`**

| 속성 | 타입 | 기본값 | 설명 |
|----------|------|---------|-------------|
| `modelName` | `'local' \| 'session' \| 'uni' \| 'wx'` | — | 내장 스토리지 백엔드 |
| `model` | `Model` | — | 사용자 정의 스토리지 백엔드 (`modelName` 덮어쓰기) |
| `isRealTime` | `boolean` | `false` | `true`로 설정하면 매번 스토리지에서 직접 읽음 |
| `beforeSet` | `(value: any) => any` | — | 쓰기 전 호출되는 훅. 새 값을 받아 변환된 값을 반환 |
| `beforeGet` | `(value: any) => any` | — | 읽기 후 호출되는 훅. 원시 값을 받아 변환된 값을 반환 |

#### `.value`

저장된 데이터를 가져오거나 설정합니다. 값을 설정하면 자동으로 스토리지 백엔드에 저장됩니다.

- **가져오기** — `isRealTime`이 `true`이면 스토리지에서 최신 데이터를 읽은 후 `beforeGet`을 적용 (설정된 경우).
- **설정** — `beforeSet`을 적용 (설정된 경우)한 후 스토리지에 저장.

```ts
store.value = { name: 'Alice' };
console.log(store.value); // { name: 'Alice' }
```

#### `.getValue()`

현재 값을 반환합니다. `.value`와 동일한 읽기 로직(`isRealTime` 및 `beforeGet` 포함)을 거칩니다.

```ts
const data = store.getValue();
```

#### `.setValue(value)`

현재 값을 설정합니다. `.value`와 동일한 쓰기 로직(`beforeSet` 및 저장 포함)을 거칩니다.

```ts
store.setValue({ name: 'Bob' });
```

#### `.refresh()`

스토리지 백엔드에서 데이터를 다시 읽어 메모리 내 값을 덮어씁니다.

```ts
store.refresh();
```

#### `.keys()`

현재 스토리지 백엔드에 저장된 모든 키를 반환합니다.

```ts
const allKeys = store.keys(); // string[]
```

#### `.remove()`

스토리지 백엔드에서 이 인스턴스의 데이터를 삭제하고 메모리 내 값을 지웁니다.

```ts
store.remove();
```

#### `.destroy()`

모든 내부 참조를 제거하여 인스턴스를 파괴합니다. 호출 후에는 해당 인스턴스를 더 이상 사용하지 않아야 합니다.

```ts
store.destroy();
// store.isDestroyed === true
```

### 내장 스토리지 백엔드

`modelName`으로 설정:

| 값 | 백엔드 | 환경 |
|-------|---------|-------------|
| `'local'` | `localStorage` | 브라우저 |
| `'session'` | `sessionStorage` | 브라우저 |
| `'uni'` | `uni.getStorageSync` / `uni.setStorageSync` | uni-app |
| `'wx'` | `wx.getStorageSync` / `wx.setStorageSync` | WeChat 미니 프로그램 |

```ts
// sessionStorage 사용
const store = new DumoguStorage('key', null, { modelName: 'session' });
```

### 데이터 전처리

`beforeSet`과 `beforeGet` 훅을 사용하여 데이터를 투명하게 변환합니다.

```ts
const store = new DumoguStorage('counter', 0, {
    modelName: 'local',
    beforeSet(value) {
        // 스토리지에 저장하기 전에 호출됨
        return value + 1;
    },
    beforeGet(value) {
        // 스토리지에서 읽은 후 호출됨
        return value - 1;
    },
});

store.value = 5;
// beforeSet이 5를 받아 6을 반환 → 6이 저장됨

console.log(store.value); // 5
// beforeGet이 6을 받아 5를 반환
```

### 실시간 모드

`isRealTime`이 `true`이면 매번 읽을 때 메모리에 캐시된 값이 아닌 스토리지 백엔드에서 직접 가져옵니다. 여러 탭이나 컴포넌트가 동일한 키를 수정할 수 있는 경우에 유용합니다.

```ts
const store = new DumoguStorage('sharedKey', null, {
    modelName: 'local',
    isRealTime: true,
});

// 매번 localStorage에서 읽음
console.log(store.value);
```

### 사용자 정의 스토리지 백엔드

`Model` 인터페이스를 구현한 객체를 `model`에 전달하여 사용자 정의 스토리지 백엔드를 사용합니다.

```ts
import DumoguStorage, { Model } from 'dumogu-storage';

const customModel: Model = {
    name: 'custom',
    get(key) {
        // 사용자 정의 읽기 로직
    },
    set(key, value) {
        // 사용자 정의 쓰기 로직
    },
    remove(key) {
        // 사용자 정의 삭제 로직
    },
    keys() {
        // 모든 키 반환
    },
};

const store = new DumoguStorage('key', null, { model: customModel });
```

### 라이선스

MIT
