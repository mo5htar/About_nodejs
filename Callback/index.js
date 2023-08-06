const fs = require("fs");

/// callBack is just funtion invoked in runtime and this notifiy that the async fun is completed

//********************************************************************* */
// this is cps contnuation passing style

//Synchronous CPS
//console.log("before");
//this fun is completed when cb is completed too this sycn cps with callback
// function adds(a, b, cb) {
//   cb(a + b);
// }
// adds(1, 2, (res) => console.log(`Res: ${res}`));
// console.log("after");
///output : before , Res:3 , after

//async CPS
//console.log("before");
//this fun async is completed when cb is completed too
// function sumAsync(a, b, cb) {
//   setTimeout(() => cb(a + b), 100);
// }
// sumAsync(1, 2, (res) => console.log(`Res: ${res}`));
// console.log("after");
///output : before ,after and Res:3
//***************************************************************************************** */

const cache = new Map();
function inconsistentRead(filename, cb) {
  console.log(`${filename}`);
  if (cache.has(filename)) {
    console.log(`////////////////////////////////`);
    console.log("sync");

    // invoked synchronously
    console.log(`cahed: `);
    console.log(`value is cahed ${cache.get(filename)}`);
    cb(cache.get(filename));
    console.log(`////////////////////////////////`);
  } else {
    // asynchronous function
    console.log(`////////////////////////////////`);
    console.log("async");

    fs.readFile(filename, "utf8", (err, data) => {
      cache.set(filename, data);
      console.log(`${cache.get(filename)}`);
      console.log(`${data}`);
      cb(data);
      console.log("///////////////////////////////////////////");
    });
  }
}

function createFileReader(filename) {
  const listeners = [];
  inconsistentRead(filename, (value) => {
    console.log(`values: ${value}`);
    listeners.forEach((listener) => listener(value));
  });

  return { onDataReady: (listener) => listeners.push(listener) };
}

// During the creation of reader1, our inconsistentRead() function behaves
// asynchronously because there is no cached result available. This means that
// any onDataReady listener will be invoked later in another cycle of the event
// loop, so we have all the time we need to register our listener.

console.log("aync");
const reader1 = createFileReader("data.text");
reader1.onDataReady((data) => {
  console.log(`First call data: ${data}`);
});

console.log("sync");
const reader2 = createFileReader("data.txt");
reader2.onDataReady((data) => {
  console.log(`Second call data: ${data}`);
});
