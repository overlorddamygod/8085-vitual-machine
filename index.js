const { opcodes } = require("./opcodes")
const { createMemory } = require("./utils");
const CPU = require("./cpu");
let code = require("./code");

const memory = createMemory(256*256);
const writeableMemArray = new Uint8Array(memory.buffer)
const cpu = new CPU(memory);

let index = 0;

Object.keys(opcodes).forEach(o=>{
  const reg = new RegExp(o+",?")
  code = code.replace(reg, opcodes[o]+" ")
})

code = code.split(' ').map(c=>{
  return c.replace(/[\n ]/g,'')
}).filter(c=>!!c);

code.forEach(c=>{
  writeableMemArray[index++] = parseInt(Number(c))
})
console.log(writeableMemArray)

cpu.run()
