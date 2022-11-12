import { Option, fromNullable } from "fp-ts/Option";

const names = ["aaa", "bbb", "ccc"];

const isAaa = (name: string) => {
  return name === "aaa";
};

const isDdd = (name: string) => {
  return name === "ddd";
};

console.log(names.find(isAaa));  // 'aaa'
console.log(names.find(isDdd));  // undefined

function find<A>(
  as: Array<A>, 
  predicate:(a:A)=>boolean
):Option<A>{
  return fromNullable(as.find(predicate))
}
console.log(find(names, isAaa))  // { _tag: 'Some', value: 'aaa' }
console.log(find(names, isDdd))  // { _tag: 'None' }
