
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { TodoItem } from './Home/TodoItem';
import { TodoDialog } from './Home/TodoDialog';
import { Todo } from './types';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      const data = {};

      const response = await fetch('/api/todo/list', {
        method: 'POST', // リクエストメソッドを指定
        headers: {
          'Content-Type': 'application/json' // JSONを送ることを伝える
        },
        body: JSON.stringify(data) // データをJSON文字列に変換
      });
      // レスポンスのステータスコードを確認
      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータス: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      if(result){
        console.log("type=" , typeof result);
        console.log("len", result.length);
        setTodos(result);
      }
      
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try{
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: "",
        completed: false,
        createdAt: Date.now(),
      };
      const response = await fetch('/api/todo/create', {
        method: 'POST', // リクエストメソッドを指定
        headers: {
          'Content-Type': 'application/json' // JSONを送ることを伝える
        },
        body: JSON.stringify(newTodo) // データをJSON文字列に変換
      });
      // レスポンスのステータスコードを確認
      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータス: ${response.status}`);
      }
      // 返ってきたJSONデータを解析
      const result = await response.json();
      console.log('成功:', result);
      fetchTodos();
    }catch(e){console.error(e)}

    setTitle('');
    setDescription('');
  };

  const handleToggleComplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleComplete(id);
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = async(e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const result = confirm("Delete OK?");
    if (!result) return;

    try{
      const newTodo: Todo = {
        id: id,
      };
      const response = await fetch('/api/todo/delete', {
        method: 'POST', // リクエストメソッドを指定
        headers: {
          'Content-Type': 'application/json' // JSONを送ることを伝える
        },
        body: JSON.stringify(newTodo) // データをJSON文字列に変換
      });
      // レスポンスのステータスコードを確認
      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータス: ${response.status}`);
      }
      // 返ってきたJSONデータを解析
      const result = await response.json();
      console.log('成功:', result);
      fetchTodos();
    }catch(e){console.error(e)}

  };

  const selectedTodo = todos.find(t => t.id === selectedTodoId) || null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">TODO</h1>
          <p className="mt-2 text-gray-500">Manage your daily goals and activities.</p>
        </div>

        <form onSubmit={handleAddTodo} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <div>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">You have no tasks yet.</p>
            </div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onClick={() => setSelectedTodoId(todo.id)}
                onToggle={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      <TodoDialog
        todo={selectedTodo}
        onClose={() => setSelectedTodoId(null)}
        onToggleComplete={toggleComplete}
      />
    </div>
  );
}
