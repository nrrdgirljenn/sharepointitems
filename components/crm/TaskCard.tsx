'use client'

import { Star, CheckCircle2, MoreHorizontal, Pencil, Trash2, RotateCcw } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { getCategoryMeta, getPriorityMeta } from '@/lib/types'
import type { Task } from '@/lib/types'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onToggleStar: (id: string) => void
  onComplete: (id: string) => void
  onRestore?: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  compact?: boolean
}

export function TaskCard({
  task,
  onToggleStar,
  onComplete,
  onRestore,
  onEdit,
  onDelete,
  compact,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const catMeta = getCategoryMeta(task.category)
  const priMeta = getPriorityMeta(task.priority)
  const isArchived = task.status === 'archived'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 p-3 rounded-xl border transition-all',
        'bg-[#18181f] border-[#2a2a38] hover:border-[#3a3a4e] hover:bg-[#1e1e28]',
        isArchived && 'opacity-60',
        compact && 'py-2.5'
      )}
    >
      {/* Complete / restore button */}
      <button
        onClick={() => isArchived ? onRestore?.(task.id) : onComplete(task.id)}
        className={cn(
          'mt-0.5 shrink-0 transition-colors',
          isArchived
            ? 'text-emerald-400 hover:text-emerald-300'
            : 'text-zinc-600 hover:text-emerald-400'
        )}
        title={isArchived ? 'Restore task' : 'Mark complete'}
      >
        {isArchived
          ? <RotateCcw size={16} />
          : <CheckCircle2 size={16} />
        }
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium leading-snug',
          isArchived ? 'line-through text-zinc-500' : 'text-zinc-100'
        )}>
          {task.title}
        </p>

        {!compact && task.description && (
          <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {/* Priority */}
          <span className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide',
            priMeta.bgColor, priMeta.textColor
          )}>
            {priMeta.label}
          </span>

          {/* Category */}
          <span className={cn(
            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
            catMeta.bgColor, catMeta.textColor
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', catMeta.dotColor)} />
            {catMeta.label}
          </span>

          {/* Date */}
          {!compact && (
            <span className="text-[10px] text-zinc-600 ml-auto">
              {format(new Date(task.created_at), 'MMM d')}
            </span>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onToggleStar(task.id)}
          className={cn(
            'p-1 rounded transition-colors',
            task.starred
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-zinc-700 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
          )}
          title={task.starred ? 'Unstar' : 'Star (adds to key tasks)'}
        >
          <Star size={14} fill={task.starred ? 'currentColor' : 'none'} />
        </button>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-1 rounded text-zinc-700 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-colors"
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 z-50 w-36 bg-[#1e1e2e] border border-[#2a2a3e] rounded-xl shadow-2xl overflow-hidden">
              <button
                onClick={() => { onEdit(task); setMenuOpen(false) }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:bg-[#2a2a3e] transition-colors"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={() => { onDelete(task.id); setMenuOpen(false) }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
