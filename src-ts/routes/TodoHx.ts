

export function renderTodoList(todos) {
  return `
    <div class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden" id="todo-container">
      
      <div class="p-6 border-b border-stone-200">
        <h1 class="text-2xl font-semibold text-stone-800">Todo List</h1>
        <form class="mt-4 flex gap-2" hx-post="/api/todo/create" hx-target="#todo-container" hx-swap="outerHTML">
          <input type="text" name="title" required placeholder="Add a new task..." class="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent" />
          <button type="submit" class="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors font-medium">Add</button>
        </form>
      </div>
      <ul class="divide-y divide-stone-100">
        ${todos.map(todo => `
          <li class="group flex items-center justify-between p-4 hover:bg-stone-50 cursor-pointer transition-colors" 
              hx-get="/api/todo/get/${todo.id}" 
              hx-target="#dialog-container" 
              hx-swap="innerHTML">
            <div class="flex items-center gap-3">
              <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                     class="w-5 h-5 text-stone-800 rounded border-stone-300 focus:ring-stone-800 cursor-pointer"
                     hx-post="/api/todos/${todo.id}/toggle"
                     hx-target="#todo-container"
                     hx-swap="outerHTML"
                     onclick="event.stopPropagation()" />
              <span class="text-stone-800 font-medium ${todo.completed ? 'line-through text-stone-400' : ''}">${todo.title}</span>
            </div>
            <form class="mt-4 flex gap-2" hx-post="/api/todo/delete" hx-target="#todo-container" hx-swap="outerHTML">
              <input type="hidden" name="id"  value="${todo.id}" />
              <button class="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      onclick="event.stopPropagation()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </form>
          </li>
        `).join('')}
        ${todos.length === 0 ? '<li class="p-8 text-center text-stone-500">No tasks yet. Add one above!</li>' : ''}
      </ul>
      <div id="dialog-container"></div>
    </div>
  `;
}


export function renderDialog(todo) {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" id="todo-modal" onclick="this.remove()">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onclick="event.stopPropagation()">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-semibold text-stone-800">${todo.title}</h2>
            <button class="text-stone-400 hover:text-stone-600 transition-colors" onclick="document.getElementById('todo-modal').remove()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form hx-put="/api/todos/${todo.id}" hx-target="#todo-container" hx-swap="outerHTML">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-stone-700 mb-1">Status</label>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${todo.completed ? 'Completed' : 'Pending'}
                  </span>
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
  `;
}