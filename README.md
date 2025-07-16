## Introduce

A simple, lightweight front-end storage tool that does not exceed 3kb after compression.

#### Install

```javascript
npm install dumogu-storage
```

#### How to use

```javascript
import DumoguStorage from 'dumogu-storage';
const dumoguStorage = new DumoguStorage('test', undefined, {
    modelName: 'local',
    isRealTime: false, // Is it real-time?
});
console.log(dumoguStorage.value); //undefined
dumoguStorage.value = { a: 1 }; //The corresponding ones are saved in the cache
console.log(dumoguStorage.value); //{a:1}
```

#### Preprocessing Data

```javascript
// Set up write and read interception
import DumoguStorage from 'dumogu-storage';
const dumoguStorage = new DumoguStorage('test', 0, {
    modelName: 'local',
    beforSet(newValue) {
        return newValue + 1;
    },
    beforGet(newValue) {
        return newValue - 1;
    },
});
```
