import { Option, none, some } from "fp-ts/Option";

const names = ["aaa", "bbb", "ccc"];

const isAaa = (name: string) => {
  return name === "aaa";
};

const isDdd = (name: string) => {
  return name === "ddd";
};

console.log(names.findIndex(isAaa));  // 0
console.log(names.findIndex(isDdd));  // -1


function findIndex<A>(
  as: Array<A>,
  predicate: (a: A) => boolean
): Option<number> {
    const index = as.findIndex(predicate)
    return index == -1 ? none : some(index)
}

console.log(findIndex(names, isAaa))
console.log(findIndex(names, isDdd))
