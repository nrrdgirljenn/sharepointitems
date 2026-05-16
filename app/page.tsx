'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Zap, TrendingUp, Calendar, Target, BookOpen, Heart,
  ArrowRight, Lock
} from 'lucide-react'
import { KeyTasks } from '@/components/home/KeyTasks'
import { CreateTaskModal } from '@/components/crm/CreateTaskModal'
import { useTasks } from '@/lib/use-tasks'
import type { Task } from '@/lib/types'
import type { CreateTaskInput } from '@/lib/use-tasks'
import { cn } from '@/lib/cn'

const COMING_SOON = [
  {
    icon: TrendingUp,
    label: 'Finance Pulse',
    desc: 'Net worth, daily earnings, monthly revenue',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Zap,
    label: 'Daily Habits',
    desc: 'Track streaks and daily completion %',
    accent: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Calendar,
    label: 'Calendar',
    desc: 'Google Calendar sync — upcoming events',
    accent: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Target,
    label: 'Goals',
    desc: 'Weekly and monthly goal tracking',
    accent: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: BookOpen,
    label: 'Journal',
    desc: 'Voice journaling with AI pattern recognition',
    accent: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Heart,
    label: 'Health',
    desc: 'Nutrition, calories, wearable data',
    accent: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
]

export default function HomePage() {
  const {
    starredTasks, loaded, createTask, updateTask, deleteTask, toggleStar, completeTask
  } = useTasks()

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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mb-1">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
          <h1 className="text-2xl font-bold text-zinc-100">Good morning, Operator</h1>
          <p className="text-sm text-zinc-500 mt-1">Here&apos;s your day at a glance.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-500">System online</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Starred tasks', value: loaded ? starredTasks.length : '–', sub: 'key priorities' },
          { label: 'Habits today',  value: '–', sub: 'coming soon' },
          { label: 'Meetings',      value: '–', sub: 'coming soon' },
          { label: 'Goals active',  value: '–', sub: 'coming soon' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#111118] border border-[#2a2a38] rounded-xl px-4 py-3">
            <p className="text-xl font-bold text-zinc-100">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Key tasks — takes 2 cols */}
        <div className="lg:col-span-2">
          <KeyTasks
            tasks={starredTasks}
            onToggleStar={toggleStar}
            onComplete={completeTask}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        </div>

        {/* Quick capture */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-zinc-100 mb-3">Quick capture</h2>
            <button
              onClick={() => { setEditTask(null); setModalOpen(true) }}
              className={cn(
                'w-full px-4 py-3 rounded-xl text-sm font-semibold',
                'bg-indigo-500 hover:bg-indigo-600 text-white transition-colors'
              )}
            >
              + Add task
            </button>
            <p className="text-xs text-zinc-600 mt-3 text-center">
              Voice input via Telegram — coming soon
            </p>
          </div>

          {/* Supabase notice */}
          <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={13} className="text-zinc-500" />
              <span className="text-xs font-medium text-zinc-400">Backend not connected</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Data is stored locally. Add your Supabase credentials to <code className="text-indigo-400">.env.local</code> to sync across devices.
            </p>
          </div>
        </div>
      </div>

      {/* Coming soon sections */}
      <div>
        <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-3">
          Coming up — next modules
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COMING_SOON.map(({ icon: Icon, label, desc, accent, bg }) => (
            <div
              key={label}
              className="bg-[#111118] border border-[#2a2a38] rounded-xl p-4 opacity-60 cursor-not-allowed"
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', bg)}>
                <Icon size={15} className={accent} />
              </div>
              <p className="text-xs font-semibold text-zinc-300">{label}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5 leading-relaxed hidden sm:block">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <CreateTaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null) }}
        onSubmit={handleSubmit}
        editTask={editTask}
      />
    </div>
  )
}
