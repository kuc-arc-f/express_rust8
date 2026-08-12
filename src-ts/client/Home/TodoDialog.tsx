import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Circle } from 'lucide-react';
import { Todo } from '../types';

interface TodoDialogProps {
  todo: Todo | null;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
}

export function TodoDialog({ todo, onClose, onToggleComplete }: TodoDialogProps) {
  return (
    <AnimatePresence>
      {todo && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-start p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 pr-4 leading-tight">{todo.title}</h2>
              <button 
                onClick={onClose} 
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {todo.description || <span className="text-gray-400 italic">No description provided.</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-gray-50 border-t border-gray-100 mt-auto">
              <div className="text-sm text-gray-500">
                Created on {new Date(todo.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              <button
                onClick={() => onToggleComplete(todo.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  todo.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
                }`}
              >
                {todo.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                {todo.completed ? 'Completed' : 'Mark as Complete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
