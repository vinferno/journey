function log() {
  console.log('log');
}








function test() {
  debugger;
  test2();
}


function test2() {
  log();
  test4();
  setTimeout( test4, 0)
}

function test3() {
  console.log('test3');
}

function test4() {
  console.log('test4')
}
test();
test3();
