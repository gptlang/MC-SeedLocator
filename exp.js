const fs = require('fs');

// Load b64.wasm
const b64 = fs.readFileSync('b64.wasm');
const __wbindgen_json_parse = function (a, b) {
    return (function (a) {
      r === q.length && q.push(q.length + 1);
      var b = r;
      return (r = q[b]), (q[b] = a), b;
    })(JSON.parse(e(a, b)));
  }
  const __wbindgen_throw = function (a, b) {
    throw new Error(e(a, b));
  }
  const imports = {
    __wbindgen_placeholder__: {
        // Include the functions you have defined
        __wbindgen_json_parse: __wbindgen_json_parse,
        __wbindgen_throw: __wbindgen_throw
    }
};

// Instantiate the wasm module with the necessary imports
const m = new WebAssembly.Instance(new WebAssembly.Module(b64), imports);


let ptr = m.exports.dungeonfinder_new(1234) // I'm guessing this is the seed
console.log(ptr)
console.log(m.exports.dungeonfinder_find(ptr))