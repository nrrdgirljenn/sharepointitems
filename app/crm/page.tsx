'use client'

import { useState, useMemo } from 'react'
import { Plus, List, LayoutGrid, Search, Archive, X } from 'lucide-react'
import { TaskCard } from '@/components/crm/TaskCard'
import { KanbanBoard } from '@/components/crm/KanbanBoard'
import { CreateTaskModal } from '@/components/crm/CreateTaskModal'
import { useTasks } from '@/lib/use-tasks'
import { CATEGORIES, STATUSES, getCategoryMeta } from '@/lib/types'
import type { Task, TaskCategory, TaskStatus } from '@/lib/types'
import type { CreateTaskInput } from '@/lib/use-tasks'
import { cn } from '@/lib/cn'

type View = 'list' | 'kanban'

const STATUS_FILTERS = [
  { id: 'all',        label: 'All' },
  ...STATUSES.filter(s => s.id !== 'archived'),
]

export default function CrmPage() {
  const {
    activeTasks, archivedTasks, loaded,
    createTask, updateTask, deleteTask,
    toggleStar, completeTask, restoreTask, sortByPriority,
  } = useTasks()

  const [view, setView] = useState<View>('list')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const handleSubmit = (input: CreateTaskInput) => {
    if (editTask) {
      updateTask(editTask.id, input)
    } else {
      createTask(input)
    }
    setEditTask(null)
  }

  const handleEdit = (task: Task) => {
    setEditTask(task)
    setModalOpen(true)
  }

  const handleMoveTask = (id: string, status: TaskStatus) => {
    updateTask(id, { status })
  }

  const filtered = useMemo(() => {
    const source = showArchived ? archivedTasks : activeTasks
    let result = source

    if (statusFilter !== 'all' && !showArchived) {
      result = result.filter(t => t.status === statusFilter)
    }
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      )
    }

    return sortByPriority(result)
  }, [activeTasks, archivedTasks, showArchived, statusFilter, categoryFilter, search, sortByPriority])

  const groupByStatus = (tasks: Task[]) => {
    const groups: Record<string, Task[]> = {
      today: [],
      this_week: [],
      this_month: [],
      backlog: [],
    }
    tasks.forEach(t => {
      if (groups[t.status]) groups[t.status].push(t)
    })
    return groups
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">CRM</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {activeTasks.length} active tasks · {activeTasks.filter(t => t.starred).length} starred
          </p>
        </div>
        <button
          onClick={() => { setEditTask(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
        >
          <Plus size={15} />
          New task
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={cn(
              'w-full pl-8 pr-3 py-2 rounded-xl text-sm bg-[#111118] border border-[#2a2a38]',
              'text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors'
            )}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s.id}
              onClick={() => { setStatusFilter(s.id); setShowArchived(false) }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                !showArchived && statusFilter === s.id
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-[#111118] border-[#2a2a38] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              )}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setShowArchived(v => !v)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5',
              showArchived
                ? 'bg-zinc-700/30 border-zinc-600 text-zinc-300'
                : 'bg-[#111118] border-[#2a2a38] text-zinc-500 hover:border-zinc-600'
            )}
          >
            <Archive size={11} />
            Archive ({archivedTasks.length})
          </button>
        </div>

        {/* View toggle */}
        {!showArchived && (
          <div className="flex gap-1 bg-[#111118] border border-[#2a2a38] rounded-lg p-0.5 ml-auto">
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                view === 'list' ? 'bg-[#2a2a38] text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
              )}
              title="List view"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                view === 'kanban' ? 'bg-[#2a2a38] text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
              )}
              title="Kanban view"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
            categoryFilter === 'all'
              ? 'bg-zinc-600/40 text-zinc-200'
              : 'text-zinc-500 hover:text-zinc-300'
          )}
        >
          All categories
        </button>
        {CATEGORIES.map(cat => {
          const active = categoryFilter === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as TaskCategory)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                active
                  ? `${cat.bgColor} ${cat.textColor}`
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', cat.dotColor)} />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-600 text-sm">No tasks found.</p>
          {!showArchived && (
            <button
              onClick={() => { setEditTask(null); setModalOpen(true) }}
              className="mt-3 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
            >
              + Create one
            </button>
          )}
        </div>
      ) : showArchived ? (
        /* Archive — always list view */
        <div className="space-y-2">
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStar={toggleStar}
              onComplete={completeTask}
              onRestore={restoreTask}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          ))}
        </div>
      ) : view === 'kanban' ? (
        <KanbanBoard
          tasks={filtered}
          onToggleStar={toggleStar}
          onComplete={completeTask}
          onEdit={handleEdit}
          onDelete={deleteTask}
          onMoveTask={handleMoveTask}
        />
      ) : (
        /* List view grouped by status */
        <div className="space-y-6">
          {Object.entries(groupByStatus(filtered)).map(([status, group]) => {
            if (group.length === 0) return null
            const statusLabel = STATUSES.find(s => s.id === status)?.label ?? status
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                    {statusLabel}
                  </h3>
                  <span className="text-xs text-zinc-700">{group.length}</span>
                </div>
                <div className="space-y-2">
                  {group.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleStar={toggleStar}
                      onComplete={completeTask}
                      onEdit={handleEdit}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CreateTaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null) }}
        onSubmit={handleSubmit}
        editTask={editTask}
      />
    </div>
  )
}
