use std::ffi::{CStr, CString};
use std::os::raw::c_char;

mod mod_todo;
mod mod_ssr;

#[no_mangle]
pub extern "C" fn ssr_htm_top() -> *mut c_char {
    let resp = mod_ssr::get_htm_top();

    CString::new(resp)
        .unwrap()
        .into_raw()
}
#[no_mangle]
pub extern "C" fn get_htm_about() -> *mut c_char {
    let resp = mod_ssr::get_htm_about();

    CString::new(resp)
        .unwrap()
        .into_raw()
}

#[no_mangle]
pub extern "C" fn todo_list() -> *mut c_char {
    let resp = mod_ssr::todo_list_json();
    let mut result: String = "".to_string();
    match resp {
        Ok(value) => {
            println!("結果: {}", value);
            result = value.clone();
        },
        Err(err) => {
            println!("エラー: {}", err);
            return std::ptr::null_mut();
        },
    }    

    CString::new(result)
        .unwrap()
        .into_raw()
}

#[no_mangle]
pub extern "C" fn todo_add(input: *const c_char) -> *mut c_char {
    let in_text = unsafe {
        CStr::from_ptr(input)
    };
    let input_str = match in_text.to_str() {
        Ok(s) => s,
        Err(_) => return std::ptr::null_mut(),
    };
    mod_todo::add_todo(&input_str);
    //let resp : &str = "";

    CString::new(input_str)
        .unwrap()
        .into_raw()
}

#[no_mangle]
pub extern "C" fn todo_delete(id: u32) -> i64 {
    mod_todo::delete_todo(id);

    return 1;
}

#[no_mangle]
pub extern "C" fn hello(name: *const c_char) -> *mut c_char {
    let input = unsafe {
        CStr::from_ptr(name)
    };

    let input = input.to_string_lossy();

    let result = format!("Hello, {}!", input);

    CString::new(result)
        .unwrap()
        .into_raw()
}

#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}
