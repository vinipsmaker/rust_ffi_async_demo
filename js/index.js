"use strict";
var ffi = require('ffi'),
    ref = require('ref');
var StructType = require('ref-struct');
var Enum = require('enum');

const size_t = ref.types.size_t;
const int32 = ref.types.int32;
const Int = ref.types.int;
const int64 = ref.types.int64;
const u8 = ref.types.uint8;
const u64 = ref.types.uint64;
const Void = ref.types.void;

const VoidPointer = ref.refType(Void);
const PointerToVoidPointer = ref.refType(ref.refType(Void));
const u8Pointer = ref.refType(u8);
const u64Pointer = ref.refType(u64);
const PointerToU8Pointer = ref.refType(u8Pointer);

const FileMetadata = new StructType({
  name: u8Pointer,
  name_len: size_t,
  name_cap: size_t,
  user_metadata: u8Pointer,
  user_metadata_len: size_t,
  user_metadata_cap: size_t,
  size: u64,
  creation_time_sec: int64,
  creation_time_nsec: int64,
  modification_time_sec: int64,
  modification_time_nsec: int64
});

const FileDetails = new StructType({
  content: u8Pointer,
  content_len: size_t,
  content_cap: size_t,
  metadata: ref.refType(FileMetadata)
});

const FileDetailsHandle = ref.refType(FileDetails);
const PointerToFileDetailsPointer = ref.refType(FileDetailsHandle);

var lib = ffi.Library('./libffi_async_demo', {
  'print_thread_id': [ 'void', [] ],
  'run_delayed': [ 'void', [ 'pointer' ] ],
  'get_shit_done': ['void', [PointerToFileDetailsPointer]],
  'get_shit_done2': ['void', [PointerToVoidPointer]],
  'get_shit_done3': ['void', [PointerToVoidPointer]],
  'get_shit_done4': ['void', [ref.refType(Int)]],
  'drop_vector': ['void', [u8Pointer, 'size_t', 'size_t']]
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

/*var callback = Callback('void', [], function() {
  console.log("js callback started");
  lib.print_thread_id()
  console.log("js callback finished");
})
lib.run_delayed(callback)*/

/*const fileDetailsPointer = ref.alloc(FileDetailsHandle, ref.NULL);
console.log(fileDetailsPointer);
lib.get_shit_done(fileDetailsPointer);
console.log(fileDetailsPointer.deref().address().toString(16));
let f2 = new FileDetails(fileDetailsPointer.deref());
console.log(f2.content_len);*/

/*const handle = ref.alloc(VoidPointer, ref.NULL);
lib.get_shit_done2(handle);
lib.get_shit_done3(handle.deref());*/

const Ffi_FilterType = new Enum({'BlackList': 0, 'WhiteList': 1});

let filterType = ref.alloc(Int);
lib.get_shit_done4(filterType);
console.log(Ffi_FilterType.get(filterType.deref()).key);
