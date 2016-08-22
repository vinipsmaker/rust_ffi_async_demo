var ffi = require('ffi'),
    ref = require('ref')

var lib = ffi.Library('./libffi_async_demo', {
  'print_thread_id': [ 'void', [] ],
  'run_delayed': [ 'void', [ 'pointer' ] ],
});

var Callback = function(retType, argTypes, abi, func) {
    if (typeof abi === 'function') {
        func = abi
        abi = void(0)
    }

    var timeout = setInterval(function() {}, 500);

    var wrapper = function(res) {
        clearInterval(timeout);
        func(res);
    };

    return ffi.Callback(retType, argTypes, abi, wrapper);
}

var callback = Callback('void', [], function() {
  console.log("js callback started");
  lib.print_thread_id()
  console.log("js callback finished");
})

lib.run_delayed(callback)
