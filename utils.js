const createMemory = (size) => {
  const memory = new ArrayBuffer(size);
  const memoryView = new DataView(memory);
  return memoryView;
}

module.exports = {
  createMemory,
}