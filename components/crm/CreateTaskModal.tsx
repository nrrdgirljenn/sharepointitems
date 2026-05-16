'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CATEGORIES, PRIORITIES, STATUSES } from '@/lib/types'
import type { Task, TaskCategory, TaskPriority, TaskStatus } from '@/lib/types'
import type { CreateTaskInput } from '@/lib/use-tasks'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (input: CreateTaskInput) => void
  editTask?: Task | null
}

const INITIAL: CreateTaskInput = {
  title: '',
  description: '',
  category: 'business_ops',
  priority: 'p3',
  status: 'today',
  notes: '',
}

export function CreateTaskModal({ open, onClose, onSubmit, editTask }: Props) {
  const [form, setForm] = useState<CreateTaskInput>(INITIAL)

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        description: editTask.description ?? '',
        category: editTask.category,
        priority: editTask.priority,
        status: editTask.status,
        notes: editTask.notes ?? '',
      })
    } else {
      setForm(INITIAL)
    }
  }, [editTask, open])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit({ ...form, title: form.title.trim() })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-[#18181f] border border-[#2a2a38] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#2a2a38]">
          <h2 className="text-base font-semibold text-zinc-100">
            {editTask ? 'Edit task' : 'New task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-[#2a2a38] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <input
              autoFocus
              type="text"
              placeholder="Task title…"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className={cn(
                'w-full bg-[#111118] border border-[#2a2a38] rounded-xl px-4 py-2.5',
                'text-sm text-zinc-100 placeholder-zinc-600',
                'focus:outline-none focus:border-indigo-500 transition-colors'
              )}
              required
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Description (optional)…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className={cn(
                'w-full bg-[#111118] border border-[#2a2a38] rounded-xl px-4 py-2.5',
                'text-sm text-zinc-100 placeholder-zinc-600 resize-none',
                'focus:outline-none focus:border-indigo-500 transition-colors'
              )}
            />
          </div>

          {/* Row: Category + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">
                Category
              </label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as TaskCategory }))}
                className={cn(
                  'w-full bg-[#111118] border border-[#2a2a38] rounded-xl px-3 py-2',
                  'text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors'
                )}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
                className={cn(
                  'w-full bg-[#111118] border border-[#2a2a38] rounded-xl px-3 py-2',
                  'text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors'
                )}
              >
                {PRIORITIES.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">
              When
            </label>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.filter(s => s.id !== 'archived').map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, status: s.id as TaskStatus }))}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    form.status === s.id
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-[#111118] border-[#2a2a38] text-zinc-400 hover:border-zinc-600'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <textarea
              placeholder="Notes / links (optional)…"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              className={cn(
                'w-full bg-[#111118] border border-[#2a2a38] rounded-xl px-4 py-2.5',
                'text-sm text-zinc-100 placeholder-zinc-600 resize-none',
                'focus:outline-none focus:border-indigo-500 transition-colors'
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-[#2a2a38] text-zinc-400 hover:text-zinc-100 hover:bg-[#2a2a38] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              {editTask ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
