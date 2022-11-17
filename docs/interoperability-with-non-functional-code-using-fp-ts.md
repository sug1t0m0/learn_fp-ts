# fp-ts による非関数型コードとの相互運用性

時に関数型で書かれていないコードとの相互運用を強いられる時がある。
そんなコードの扱い方を示す。


## Sentinel

Sentinelとは、プログラミングのテクニックの1つであり、処理範囲の境界に特定の値を目印として置いておくことで、プログラムの構造をシンプルにする手法のことである。(参考: https://www.weblio.jp/content/Sentinel)

### ユースケース

APIが失敗し、終域の特別な値を返すかもしれないとき

### 例

- `Array.prototype.findIndex`は`callbackFn`が`false`を返すと特別な値(`-1`) を返す。

```ts
const names = ["aaa", "bbb", "ccc"];

const isAaa = (name: string) => {
  return name === "aaa";
};

const isDdd = (name: string) => {
  return name === "ddd";
};

console.log(names.findIndex(isAaa));  // 0
console.log(names.findIndex(isDdd));  // -1
```

### 解決策

- `Option` を返すような関数を実装する。
- `same` や `none` で `Option` 型の値を生成できる.

```ts
import { Option, none, some } from "fp-ts/Option";

function findIndex<A>(
  as: Array<A>,
  predicate: (a: A) => boolean
): Option<number> {
  const index = as.findIndex(predicate)
  return index == -1 ? none : some(index)
}

console.log(findIndex(names, isAaa))  //  { _tag: 'Some', value: 0 }
console.log(findIndex(names, isDdd))  //  { _tag: 'None' } 
```

## `undefined` と `null`


### ユースケース

APIが失敗し、`undefined`や`null`を返すかもしれない場合

### 例

- `Array.prototype.find`は`callbackFn`が`false`を返すと`undefined`を返す。

```ts
const names = ["aaa", "bbb", "ccc"];

const isAaa = (name: string) => {
  return name === "aaa";
};

const isDdd = (name: string) => {
  return name === "ddd";
};

console.log(names.find(isAaa));  // 'aaa'
console.log(names.find(isDdd));  // undefined
```


### 解決策
- `Option` を返すような関数を実装する。
- `fromNullable` は引数が`null`か`undefined`だったら`none`を, そうでなかったら`same`でラップした引数を返す。
  - https://gcanti.github.io/fp-ts/modules/Option.ts.html#fromnullable

```ts
import { Option, fromNullable } from "fp-ts/Option";

function find<A>(
  as: Array<A>, 
  predicate:(a:A)=>boolean
):Option<A>{
  return fromNullable(as.find(predicate))
}
console.log(find(names, isAaa))  // { _tag: 'Some', value: 'aaa' }
console.log(find(names, isDdd))  // { _tag: 'None' }
```


## 例外

### ユースケース

APIが例外をthrowするかもしれないとき

### 例

```ts
const jsonString = '{"a":"a"}';
const noneJsonString = "";

console.log(JSON.parse(jsonString));  // { a: 'a' }
console.log(JSON.parse(noneJsonString));  // Unexpected end of JSON input
```

### 解決策
- `Either` を返すような関数を実装する。
- `tryCatch`は例外をthrowするかもしれない関数から`Either`を生成するためのコンストラクタである。
  - https://gcanti.github.io/fp-ts/modules/Either.ts.html#trycatch

```ts
import { Either, tryCatch } from "fp-ts/Either";

interface Parser {
  parse: (s: string) => unknown;
}
const parse =
  (s: string) =>
  (parser: Parser): Either<Error, unknown> => {
    return tryCatch(
      () => parser.parse(s),
      (reason) => new Error(String(reason))
    );
  };
console.log(parse(jsonString)(JSON));  // { _tag: 'Right', right: { a: 'a' } }
console.log(parse(noneJsonString)(JSON));
// {
//   _tag: 'Left',
//   left: ...
// }
```


## 例外

### ユースケース

APIが非決定論的な値を返すとき

### 例

`Math.random`

### 解決策
- `IO` を返すような関数を実装する。

```ts
import { IO } from 'fp-ts/IO'

const random: IO<number> = () => Math.random()

console.log(random()) // 0.7946022437006872
```


## 同期的な副作用


### ユースケース

APIがグローバルステートを読み込んだり書き込んだり、その両方をするとき

### 例

`localStorage.getItem`

### 解決策
- `IO` を返すような関数を実装する。
- `IO` が返す値は `Option` になるようにする。

```ts
import { Option, fromNullable } from 'fp-ts/Option'
import { IO } from 'fp-ts/IO'

function getItem(key: string): IO<Option<string>> {
  return () => fromNullable(localStorage.getItem(key))
}
```
