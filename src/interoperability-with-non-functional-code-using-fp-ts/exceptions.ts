import { Either, tryCatch } from "fp-ts/Either";

const jsonString = '{"a":"a"}';
const noneJsonString = "";

console.log(JSON.parse(jsonString)); // { a: 'a' }
// console.log(JSON.parse(noneJsonString)); // Unexpected end of JSON input

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
