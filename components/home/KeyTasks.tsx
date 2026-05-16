'use client'

import { Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { TaskCard } from '@/components/crm/TaskCard'
import type { Task } from '@/lib/types'

interface Props {
  tasks: Task[]
  onToggleStar: (id: string) => void
  onComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function KeyTasks({ tasks, onToggleStar, onComplete, onEdit, onDelete }: Props) {
  return (
    <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star size={15} className="text-yellow-400" fill="currentColor" />
          <h2 className="text-sm font-semibold text-zinc-100">Key Tasks</h2>
        </div>
        <Link
          href="/crm"
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-zinc-600">No starred tasks yet.</p>
          <p className="text-xs text-zinc-700 mt-1">Star tasks in the CRM to pin them here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStar={onToggleStar}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              compact
            />
          ))}
        </div>
      )}
    </div>
  )
}
