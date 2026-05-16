'use client'

import { TaskCard } from './TaskCard'
import type { Task } from '@/lib/types'

interface Column {
  id: string
  label: string
  status: 'today' | 'this_week' | 'this_month'
  accent: string
}

const COLUMNS: Column[] = [
  { id: 'today',      label: 'Today',      status: 'today',      accent: 'border-t-indigo-500' },
  { id: 'this_week',  label: 'This Week',  status: 'this_week',  accent: 'border-t-cyan-500' },
  { id: 'this_month', label: 'This Month', status: 'this_month', accent: 'border-t-purple-500' },
]

interface Props {
  tasks: Task[]
  onToggleStar: (id: string) => void
  onComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMoveTask: (id: string, status: Task['status']) => void
}

export function KanbanBoard({ tasks, onToggleStar, onComplete, onEdit, onDelete, onMoveTask }: Props) {
  const activeTasks = tasks.filter(t => t.status !== 'archived')

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(col => {
        const colTasks = activeTasks.filter(t => t.status === col.status)

        return (
          <div
            key={col.id}
            className={`flex flex-col gap-2 bg-[#111118] border border-[#2a2a38] border-t-2 ${col.accent} rounded-2xl p-4`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-zinc-200">{col.label}</h3>
              <span className="text-xs text-zinc-600 bg-[#18181f] px-2 py-0.5 rounded-full">
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-2 min-h-[120px]">
              {colTasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-zinc-700 italic">No tasks</p>
                </div>
              ) : (
                colTasks.map(task => (
                  <div key={task.id}>
                    <TaskCard
                      task={task}
                      onToggleStar={onToggleStar}
                      onComplete={onComplete}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      compact
                    />
                    {/* Move buttons */}
                    <div className="flex gap-1 mt-1 px-1">
                      {COLUMNS.filter(c => c.id !== col.id).map(target => (
                        <button
                          key={target.id}
                          onClick={() => onMoveTask(task.id, target.status)}
                          className="text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors px-1"
                        >
                          → {target.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
