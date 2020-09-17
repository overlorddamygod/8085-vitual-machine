let code = `
  LXI B,0x22 0x99
  PUSH B
  POP D
  PUSH D
  POP H
  HLT
`

module.exports = code;