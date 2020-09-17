const { createMemory } = require("./utils");
const opcodes = require("./opcodes")


class CPU {
  constructor(memory) {
    this.memory = memory;

    this.registerLabels = [
      'IP','A',
      'B','C',
      'D','E',
      'H','L',
      'W','Z'
    ];

    this.registers = createMemory(this.registerLabels.length * 2);

    this.registerMap = this.registerLabels.reduce((map,regLabel,i) => {
      map[regLabel] = i * 2;
      return map;
    },{})
  }

  getRegister(name) {
    if ( !( name in this.registerMap ) ) {
      throw new Error("Register invalid");
    }

    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegister(name, value) {
    if ( !( name in this.registerMap ) ) {
      throw new Error("Register invalid");
    }

    this.registers.setUint16(this.registerMap[name], value);
  }

  fetch8() {
    const nextInstruction = this.getRegister("IP");
    const instruction = this.memory.getUint8(nextInstruction);
    this.setRegister("IP", nextInstruction + 1)
    return instruction;
  }

  fetch16() {
    const nextInstruction = this.getRegister("IP");
    const instruction = this.memory.getUint16(nextInstruction);
    this.setRegister("IP", nextInstruction + 2)
    return instruction;
  }

  // Move immediate to register
  MVI(name) {
    let val = this.fetch16();
    this.setRegister(name,val);
  }

  MOV(destination, source) {
    this.setRegister(destination,this.getRegister(source));
  }

  ADD(name) {
    const acc = this.getRegister("A");
    const register = this.getRegister(name);
    this.setRegister("A",acc + register);
  }

  execute(instruction) {
    switch( instruction ) {
      case opcodes["MVI A"]:
        this.MVI("A");
        return;

      case opcodes["MVI B"]:
        this.MVI("B");
        return;

      case opcodes["MVI C"]:
        this.MVI("C");
        return;

      case opcodes["MVI D"]:
        this.MVI("D");
        return;

      case opcodes["MVI E"]:
        this.MVI("E");
        return;

      case opcodes["MVI H"]:
        this.MVI("H");
        return;

      case opcodes["MVI L"]:
        this.MVI("L");
        return;

      // Move register to A
      case opcodes["MOV A,B"]:
        this.MOV("A","B");
        return;

      case opcodes["MOV A,C"]:
        this.MOV("A","C");
        return;

      case opcodes["MOV A,D"]:
        this.MOV("A","D");
        return;

      case opcodes["MOV A,E"]:
        this.MOV("A","E");
        return;

      case opcodes["MOV A,H"]:
        this.MOV("A","H");
        return;

      case opcodes["MOV A,L"]:
        this.MOV("A","L");
        return;

      // Move register to B
      case opcodes["MOV B,A"]:
        this.MOV("B","A");
        return;

      case opcodes["MOV C,A"]:
        this.MOV("C","A");
        return;

      // Add register
      case opcodes["ADD A"]:
        this.ADD("A");
        return;

      case opcodes["ADD B"]:
        this.ADD("B");
        return;

      case opcodes["ADD C"]:
        this.ADD("C")
        return;

      case opcodes["ADD D"]:
        this.ADD("D");
        return;

      case opcodes["ADD E"]:
        this.ADD("E")
        return;

      case opcodes["ADD H"]:
        this.ADD("H");
        return;

      case opcodes["ADD L"]:
        this.ADD("L")
        return;

      case opcodes["HLT"]:
        return true;
    }
  }

  step() {
    const instruction = this.fetch8();
    return this.execute(instruction);
  }

  run() {
    const hlt = this.step();
    if ( !hlt ) {
      setImmediate(()=>this.run());
    } else {
      this.logRegisters();
    }
    return;
  }

  logRegisters() {
    this.registerLabels.forEach((name,index) => {
      console.log(`${name} : 0x${this.getRegister(name).toString(16).padStart(4,0)}`)
    })
  }
}

module.exports = CPU;