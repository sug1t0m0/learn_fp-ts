import { IO } from 'fp-ts/IO'

const random: IO<number> = () => Math.random()

console.log(random()) // 0.7946022437006872
