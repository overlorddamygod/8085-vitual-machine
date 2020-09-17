const opcodes = {
  "MVI A" : 0x3E,
  "MVI B" : 0x06,
  "MVI C" : 0x0E,
  "MVI D" : 0x16,
  "MVI E" : 0x1E,
  "MVI H" : 0x26,
  "MVI L" : 0x2E,
  "MOV A,B": 0x78,
  "MOV A,C": 0x79,
  "MOV A,D": 0x7A,
  "MOV A,E": 0x7B,
  "MOV A,H": 0x7C,
  "MOV A,L": 0x7D,
  "MOV B,A" :0x47,
  "MOV C,A" :0x4f,
  "ADD A" : 0x87,
  "ADD B" : 0x80,
  "ADD C" : 0x81,
  "ADD D" : 0x82,
  "ADD E" : 0x83,
  "ADD H" : 0x84,
  "ADD L" : 0x85,
  "XCHG" : 0xEB,
  "HLT"   : 0x76
};

module.exports = opcodes;