use serde::{Deserialize, Serialize};
use serde_json::json;
//use std::fmt::Write;
use std::fs;
use std::io::{self, Write};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TodoItem {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub completed: bool,    
}

pub fn get_htm_top() -> String
{
  let ssr_htm: String = r#"<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTMX Todo App</title>
    <script src="https://unpkg.com/htmx.org@1.9.12"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="/js/client.js"></script>
  </head>
  <body class="bg-stone-100 min-h-screen flex justify-center text-stone-900 font-sans">
    <div class="max-w-3xl mx-auto p-4 py-12" hx-get="/api/todo/list" hx-trigger="load" hx-swap="outerHTML">
      Top
      <div class="flex justify-center mt-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    </div>
  </body>
  
</html>
"#
    .to_string();

    return ssr_htm;
}

pub fn get_htm_about() -> String
{
  let ssr_htm: String = r#"<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTMX Todo App</title>
    <script src="https://unpkg.com/htmx.org@1.9.12"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
  <body class="bg-white min-h-screen text-stone-900 font-sans">
    <div>
      <a href="/" class="font-bold ms-4" >Home</a>
      <a href="/about" class="ms-4" >[ about ]</a>
      <hr class="my-2" />
    </div>      
    <div class="max-w-3xl mx-auto p-4 py-12" >
      <h1 class="font-bold text-xl" >About</h1>
      <hr /> 
    </div>
  </body>
  
</html>
"#
    .to_string();

    return ssr_htm;
}

pub fn todo_list_json() -> std::result::Result<String, String> {
    let mut ret = "".to_string();

    let data = super::mod_todo::load_data();
    if data.items.is_empty() {
        println!("No todos found.");
        //return Err("No todos found.".to_string());
        return Ok("[]".to_string());
    }
    let todo_items = data.items;
    for todo in &todo_items {
        println!("  #{}: {}", todo.id, todo.title);
    }
    let out = &todo_items.clone();
    let j1 = json!(&out);
    Ok(j1.to_string())
}

fn render_todo_list(todos: &[TodoItem]) -> String {
    let todo_items = todos
        .iter()
        .map(|todo| {
            let checked = if todo.completed { "checked" } else { "" };
            let title_class = if todo.completed {
                "line-through text-stone-400"
            } else {
                ""
            };
            format!(
                r##"
          <li class="group flex items-center justify-between p-4 hover:bg-stone-50 cursor-pointer transition-colors"
              hx-get="/api/todo/get/{id}"
              hx-target="#dialog-container"
              hx-swap="innerHTML">
            <div class="flex items-center gap-3">
              <span class="text-stone-800 font-medium {title_class}">{title}</span>
            </div>
            <form class="mt-4 flex gap-2" hx-post="/api/todo/delete" hx-target="#todo-container" hx-swap="outerHTML">
              <input type="hidden" name="id"  value="{id}" />
              <button class="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      onclick="event.stopPropagation()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </form>
          </li>"##,
                id = todo.id,
                title = todo.title,
                title_class = title_class,
            )
        })
        .collect::<Vec<_>>()
        .join("");

    let empty_state = if todos.is_empty() {
        r##"<li class="p-8 text-center text-stone-500">No tasks yet. Add one above!</li>"##
    } else {
        ""
    };

    format!(
    r##"
    <div class="bg-white w-3xl rounded-xl shadow-sm border border-stone-200 overflow-hidden" id="todo-container">
        <div>
            <a href="/" class="font-bold ms-4" >Home</a>
            <a href="/about" class="ms-4" >[ about ]</a>
            <hr class="my-2" />
        </div>
 
      <div class="p-6 border-b border-stone-200">
        <h1 class="text-2xl font-semibold text-stone-800">Todo List</h1>
        <form class="mt-4 flex gap-2" hx-post="/api/todo/create" hx-target="#todo-container" hx-swap="outerHTML">
          <input type="text" name="title" required placeholder="Add a new task..." class="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent" />
          <button type="submit" class="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors font-medium">Add</button>
        </form>
      </div>
      <ul class="divide-y divide-stone-100">
{items}{empty_state}
      </ul>
      <div id="dialog-container"></div>
    </div>
  "##,
        items = todo_items,
        empty_state = empty_state,
    )
}

pub fn todo_list_elem() -> std::result::Result<String, String> {
    let mut ret = "".to_string();

    let mut out_items: Vec<TodoItem> = Vec::new();
    let data = super::mod_todo::load_data();
    if data.items.is_empty() {
        println!("No todos found.");
        let html = render_todo_list(&out_items);
        return Ok(html.to_string());
    }
    let todo_items = data.items;
    for todo in &todo_items {
        let row = TodoItem {
              id: todo.id,
              title: todo.title.clone(),
              description: "".to_string(),
              completed: false,
        };
        out_items.push(row);
        println!("  #{}: {}", todo.id, todo.title);
    }
    //let out = &todo_items.clone();
    //let j1 = json!(&out);
    let html = render_todo_list(&out_items);
    //println!("{}", html);
    ret = html.clone();
    Ok(ret.to_string())
}

pub fn render_dialog(todo: &TodoItem) -> String {
    let status_badge_class = if todo.completed {
        "bg-green-100 text-green-800"
    } else {
        "bg-yellow-100 text-yellow-800"
    };
    let status_label = if todo.completed { "Completed" } else { "Pending" };

    let mut html = String::new();
   html = format!(
        r##"
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" id="todo-modal" onclick="this.remove()">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onclick="event.stopPropagation()">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-semibold text-stone-800">{}</h2>
            <button class="text-stone-400 hover:text-stone-600 transition-colors" onclick="document.getElementById('todo-modal').remove()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form hx-put="/api/todos/{}" hx-target="#todo-container" hx-swap="outerHTML">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-stone-700 mb-1">Status</label>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium {}">{}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button type="button" class="px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors font-medium" onclick="document.getElementById('todo-modal').remove()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  "##,
        todo.title,
        todo.id,
        status_badge_class,
        status_label
    );
    //.expect("write! to String cannot fail");

    html
}
