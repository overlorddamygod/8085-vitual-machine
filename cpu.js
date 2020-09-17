const { createMemory } = require("./utils");
const { opcodes, address_opcode } = require("./opcodes")

class CPU {
  constructor(memory) {
    this.memory = memory;

    this.registerLabels = [
      'IP','SP',
      'FP','A',
      'B','C',
      'D','E',
      'H','L',
      'W','Z'
    ];

    this.registers = createMemory(this.registerLabels.length + 3);
    let serial_register = 7;
    this.registerMap = this.registerLabels.reduce((map,regLabel,i) => {
      map[regLabel] = i < 4 ? i*2 : serial_register++;
      return map;
    },{})
    this.setRegister("SP",0xfffe,16)
  }

  getRegister(name, bits = 8) {
    if ( !( name in this.registerMap ) ) {
      throw new Error("Register invalid");
    }

    return bits == 16 ? this.registers.getUint16(this.registerMap[name]) : this.registers.getUint8(this.registerMap[name]);
  }

  setRegister(name, value, bits = 8) {
    if ( !( name in this.registerMap ) ) {
      throw new Error("Register invalid");
    }

    if ( bits == 16 ) {
      this.registers.setUint16(this.registerMap[name], value);
    } else {
      this.registers.setUint8(this.registerMap[name], value);
    }
  }

  // Fetch 8 bit or 1 byte instruction
  fetch8() {
    const nextInstruction = this.getRegister("IP",16);
    const instruction = this.memory.getUint8(nextInstruction);
    this.setRegister("IP", nextInstruction + 1,16)
    return instruction;
  }


  // Fetch 16 bit or 2 byte instruction
  fetch16() {
    const nextInstruction = this.getRegister("IP",16);
    const instruction = this.memory.getUint16(nextInstruction);
    this.setRegister("IP", nextInstruction + 2,16)
    return instruction;
  }

  // Move immediate to register
  MVI(name) {
    let val = this.fetch8();
    this.setRegister(name,val);
  }

  // Move immediate to register pair
  LXI(name) {
    let val = this.fetch16();
    this.setRegister(name,val,16);
  }

  // Move register to register
  MOV(destination, source) {
    this.setRegister(destination,this.getRegister(source));
  }

  // Add register
  ADD(name) {
    const acc = this.getRegister("A");
    const register = this.getRegister(name);
    this.setRegister("A",acc + register);
  }

  // Add register
  SUB(name) {
    const acc = this.getRegister("A");
    const register = this.getRegister(name);
    this.setRegister("A",acc - register);
  }

  // PUSH register pair to stack
  PUSH(name) {
    const currentSP = this.getRegister("SP", 16);
    const registerValue = this.getRegister(name, 16)

    this.memory.setUint16(currentSP, registerValue);
    this.setRegister("SP",currentSP-2,16)
  }

  // POP stack to register pair
  // Need to modify related to stack pointer
  POP(name) {
    const currentSP = this.getRegister("SP", 16);

    const memory_value = this.memory.getUint16(currentSP+2);
    // console.log(memory_value.toString(16).padStart(4,0))

    this.setRegister(name, memory_value, 16)

    this.setRegister("SP",currentSP+2,16)
  }

  execute(instruction) {
    // console.log("INS ",instruction);
    switch( instruction ) {

      // Move immediate to register
      case opcodes["MVI A"]:
      case opcodes["MVI B"]:
      case opcodes["MVI C"]:
      case opcodes["MVI D"]:
      case opcodes["MVI E"]:
      case opcodes["MVI H"]:
      case opcodes["MVI L"]:
        const registerName = address_opcode[instruction].split(" ")[1];
        this.MVI(registerName);
        return;

      // Move immediate to register pair
      case opcodes["LXI B"]:
      case opcodes["LXI D"]:
      case opcodes["LXI H"]:
        const register__Name = address_opcode[instruction].split(" ")[1];
        this.LXI(register__Name);
        return;

      // Move Register to Register
      case opcodes["MOV A,B"]:
      case opcodes["MOV A,C"]:
      case opcodes["MOV A,D"]:
      case opcodes["MOV A,E"]:
      case opcodes["MOV A,H"]:
      case opcodes["MOV A,L"]:
      case opcodes["MOV B,A"]:
      case opcodes["MOV B,C"]:
      case opcodes["MOV B,D"]:
      case opcodes["MOV B,E"]:
      case opcodes["MOV B,H"]:
      case opcodes["MOV B,L"]:
      case opcodes["MOV C,A"]:
      case opcodes["MOV C,B"]:
      case opcodes["MOV C,D"]:
      case opcodes["MOV C,E"]:
      case opcodes["MOV C,H"]:
      case opcodes["MOV C,L"]:
      case opcodes["MOV D,A"]:
      case opcodes["MOV D,B"]:
      case opcodes["MOV D,C"]:
      case opcodes["MOV D,E"]:
      case opcodes["MOV D,H"]:
      case opcodes["MOV D,L"]:
      case opcodes["MOV E,A"]:
      case opcodes["MOV E,B"]:
      case opcodes["MOV E,C"]:
      case opcodes["MOV E,D"]:
      case opcodes["MOV E,H"]:
      case opcodes["MOV E,L"]:
      case opcodes["MOV H,A"]:
      case opcodes["MOV H,B"]:
      case opcodes["MOV H,C"]:
      case opcodes["MOV H,D"]:
      case opcodes["MOV H,E"]:
      case opcodes["MOV H,L"]:
      case opcodes["MOV L,A"]:
      case opcodes["MOV L,B"]:
      case opcodes["MOV L,C"]:
      case opcodes["MOV L,D"]:
      case opcodes["MOV L,E"]:
      case opcodes["MOV L,H"]:
        const [destination, source] = address_opcode[instruction].split(" ")[1].split(",")
        this.MOV(destination,source);
        return;

      // Add register to accumulator
      case opcodes["ADD A"]:
      case opcodes["ADD B"]:
      case opcodes["ADD C"]:
      case opcodes["ADD D"]:
      case opcodes["ADD E"]:
      case opcodes["ADD H"]:
      case opcodes["ADD L"]:
        const register_name = address_opcode[instruction].split(" ")[1];
        this.ADD(register_name);
        return;

      // Subtract register from accumulator
      case opcodes["SUB A"]:
      case opcodes["SUB B"]:
      case opcodes["SUB C"]:
      case opcodes["SUB D"]:
      case opcodes["SUB E"]:
      case opcodes["SUB H"]:
      case opcodes["SUB L"]:
        const register_Name = address_opcode[instruction].split(" ")[1];
        this.SUB(register_Name);
        return;

      case opcodes["LDA"]:
        let mem_address = this.fetch16();
        this.setRegister("A",this.memory.getUint8(mem_address));
        return;

      case opcodes["STA"]:
        const memAddress = this.fetch16();
        this.memory.setUint8(memAddress,this.getRegister("A"))
        return;

      case opcodes["PUSH B"]:
      case opcodes["PUSH D"]:
      case opcodes["PUSH H"]:
        const _registerName = address_opcode[instruction].split(" ")[1];
        this.PUSH(_registerName);
        return;

      case opcodes["POP B"]:
      case opcodes["POP D"]:
      case opcodes["POP H"]:
        const register___Name = address_opcode[instruction].split(" ")[1];
        this.POP(register___Name);
        return;


      // Exchange HL and DF pair
      case opcodes["XCHG"]:
        this.setRegister("W",this.getRegister("H", 16),16);
        this.setRegister("H",this.getRegister("D", 16),16);
        this.setRegister("D",this.getRegister("W", 16),16);
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
      const value = this.getRegister(name, index < 3 ? 16 : 8).toString(16).padStart(index < 3 ? 4 : 2,0)
      console.log(`${name} : 0x${value}`)
    })
    console.log(this.memory)
  }
}

module.exports = CPU;