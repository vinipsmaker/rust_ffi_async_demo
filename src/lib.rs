extern crate thread_id;

use std::thread;
use std::os::raw::c_void;

struct OpaqueCtx(*mut c_void);
unsafe impl Send for OpaqueCtx {}

#[no_mangle]
pub unsafe extern "C" fn register(ctx: *mut c_void,
                                  cb: unsafe extern "C" fn(*mut c_void)) {
    println!("{:p}", ctx);
    let ctx = OpaqueCtx(ctx);
    let _ = thread::spawn(move || {
           let ctx = ctx.0;
           cb(ctx);
     });
}
