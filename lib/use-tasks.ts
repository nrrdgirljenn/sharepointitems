'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Task, TaskCategory, TaskPriority, TaskStatus } from './types'
import { MOCK_TASKS } from './mock-data'
import { PRIORITIES } from './types'

const STORAGE_KEY = 'personal-os-tasks'

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadTasks(): Task[] {
  if (typeof window === 'undefined') return MOCK_TASKS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return MOCK_TASKS
    return JSON.parse(raw) as Task[]
  } catch {
    return MOCK_TASKS
  }
}

function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export interface CreateTaskInput {
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  notes?: string
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  starred?: boolean
  completed_at?: string
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTasks(loadTasks())
    setLoaded(true)
  }, [])

  const persist = useCallback((next: Task[]) => {
    setTasks(next)
    saveTasks(next)
  }, [])

  const createTask = useCallback((input: CreateTaskInput): Task => {
    const task: Task = {
      id: generateId(),
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority,
      status: input.status,
      starred: false,
      notes: input.notes,
      created_at: new Date().toISOString(),
    }
    setTasks(prev => {
      const next = [...prev, task]
      saveTasks(next)
      return next
    })
    return task
  }, [])

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...input } : t)
      saveTasks(next)
      return next
    })
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const next = prev.filter(t => t.id !== id)
      saveTasks(next)
      return next
    })
  }, [])

  const toggleStar = useCallback((id: string) => {
    setTasks(prev => {
      const next = prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t)
      saveTasks(next)
      return next
    })
  }, [])

  const completeTask = useCallback((id: string) => {
    setTasks(prev => {
      const next = prev.map(t =>
        t.id === id
          ? { ...t, status: 'archived' as TaskStatus, completed_at: new Date().toISOString() }
          : t
      )
      saveTasks(next)
      return next
    })
  }, [])

  const restoreTask = useCallback((id: string) => {
    setTasks(prev => {
      const next = prev.map(t =>
        t.id === id ? { ...t, status: 'backlog' as TaskStatus, completed_at: undefined } : t
      )
      saveTasks(next)
      return next
    })
  }, [])

  const activeTasks = tasks.filter(t => t.status !== 'archived')
  const archivedTasks = tasks.filter(t => t.status === 'archived')
  const starredTasks = activeTasks.filter(t => t.starred)

  const sortByPriority = (arr: Task[]) =>
    [...arr].sort((a, b) => {
      const pa = PRIORITIES.find(p => p.id === a.priority)?.order ?? 99
      const pb = PRIORITIES.find(p => p.id === b.priority)?.order ?? 99
      return pa - pb
    })

  return {
    tasks,
    activeTasks,
    archivedTasks,
    starredTasks,
    loaded,
    createTask,
    updateTask,
    deleteTask,
    toggleStar,
    completeTask,
    restoreTask,
    sortByPriority,
  }
}
