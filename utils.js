const createMemory = (size) => {
  const memory = new ArrayBuffer(size);
  const memoryView = new DataView(memory);
  return memoryView;
}

function swapKeyValues(obj) { 
    const res = {}; 
      
    Object.keys(obj).forEach(key => { 
        res[obj[key]] = key; 
    }); 
    return res; 
} 
          

module.exports = {
  createMemory,
  swapKeyValues
}