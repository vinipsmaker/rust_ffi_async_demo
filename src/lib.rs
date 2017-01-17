extern crate thread_id;

use std::thread;
use std::time::Duration;

#[derive(Debug)]
#[repr(C)]
pub struct FileMetadata {
    pub name: *mut u8,
    pub name_len: usize,
    pub name_cap: usize,
    pub user_metadata: *mut u8,
    pub user_metadata_len: usize,
    pub user_metadata_cap: usize,
    pub size: u64,
    pub creation_time_sec: i64,
    pub creation_time_nsec: i64,
    pub modification_time_sec: i64,
    pub modification_time_nsec: i64,
}

#[derive(Debug)]
#[repr(C)]
pub struct FileDetails {
    /// Content of the file, base64 encoded string.
    pub content: *mut u8,
    /// Size of `content`
    pub content_len: usize,
    /// Capacity of `content`. Only used by the allocator's `dealloc` algorithm.
    pub content_cap: usize,
    /// Metadata of the file.
    pub metadata: *mut FileMetadata,
}

#[no_mangle]
pub extern fn print_thread_id() {
    println!("current thread id: {}", thread_id::get())
}

#[no_mangle]
pub unsafe fn get_shit_done(o_data: *mut *mut FileDetails) {
    println!("Rust: {:p}", *o_data as *const _);
    let response = FileDetails {
        content: 0 as *mut u8,
        content_len: 123654,
        content_cap: 741852,
        metadata: 0 as *mut _,
    };
    *o_data = Box::into_raw(Box::new(response));
    println!("Rust: {:p}", o_data as *const _);
    println!("Rust: {:p}", *o_data as *const _);
}

#[no_mangle]
pub unsafe fn get_shit_done2(o_data: *mut *mut i32) {
    *o_data = Box::into_raw(Box::new(42));
}

#[no_mangle]
pub unsafe fn get_shit_done3(handle: *mut i32) {
    println!("{}", *handle);
}

#[repr(C)]
#[derive(Debug, PartialEq)]
pub enum FilterType {
    /// BlackList
    BlackList,
    /// WhiteList
    WhiteList,
}

#[no_mangle]
pub unsafe fn get_shit_done4(o_data: *mut FilterType) {
    *o_data = FilterType::BlackList;
}

#[no_mangle]
pub unsafe extern "C" fn drop_vector(ptr: *mut u8, size: usize,
                                     capacity: usize) {
    let _ = Vec::from_raw_parts(ptr, size, capacity);
}

#[no_mangle]
pub extern fn run_delayed(callback: extern fn()) {
    println!("run_delayed started (id: {})", thread_id::get());

    thread::spawn(move || {
        println!("second thread started (id: {})", thread_id::get());
        thread::sleep(Duration::from_secs(1));
        println!("second thread done sleeping");
        callback();
        println!("second thread finished");
    });

    println!("run_delayed finished");
}
