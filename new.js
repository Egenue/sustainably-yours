const original = { 
 a: 1, 
 b: undefined, 
 c: Symbol("x"), 
 d: () => "hi"
};

const clone = structuredClone(original);
console.log(clone);