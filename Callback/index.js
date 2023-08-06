const fs = require("fs");

/*
the callBack 
1=>is just funtion invoked in runtime and this notifiy that the async fun is completed
2=>function is really unpredictable as it depends on many factors, such as the frequency of its invocation, the filename
passed as an argument, and the amount of time taken to load the file.

3=>Always choose a direct style for purely synchronous functions for no using cps
4=>Use blocking APIs sparingly and only when they don't affect
the ability of the application to handle concurrent asynchronous
operations.

*/

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
//ouput is :First call data: some data

console.log("sync");
const reader2 = createFileReader("data.txt");
reader2.onDataReady((data) => {
  console.log(`Second call data: ${data}`);
});

/// output :undifiend

//to solve this problem you can add proccess.nextick in out funtion which
//defers the execution of a function after the currently running operation completes
if (cache.has(filename)) {
  // deferred callback invocation
  process.nextTick(() => callback(cache.get(filename)));
}
