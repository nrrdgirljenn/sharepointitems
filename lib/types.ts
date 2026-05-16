export type TaskCategory =
  | 'content'
  | 'products'
  | 'business_ops'
  | 'finance'
  | 'personal'
  | 'legal'
  | 'opportunities'

export type TaskPriority = 'p1' | 'p2' | 'p3' | 'p4'

export type TaskStatus = 'today' | 'this_week' | 'this_month' | 'backlog' | 'archived'

export interface Task {
  id: string
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  starred: boolean
  notes?: string
  created_at: string
  completed_at?: string
}

export interface CategoryMeta {
  id: TaskCategory
  label: string
  textColor: string
  bgColor: string
  dotColor: string
}

export interface PriorityMeta {
  id: TaskPriority
  label: string
  textColor: string
  bgColor: string
  order: number
}

export interface StatusMeta {
  id: TaskStatus
  label: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'content',      label: 'Content',         textColor: 'text-purple-300',  bgColor: 'bg-purple-500/15',  dotColor: 'bg-purple-400' },
  { id: 'products',     label: 'Products',        textColor: 'text-blue-300',    bgColor: 'bg-blue-500/15',    dotColor: 'bg-blue-400' },
  { id: 'business_ops', label: 'Business Ops',    textColor: 'text-cyan-300',    bgColor: 'bg-cyan-500/15',    dotColor: 'bg-cyan-400' },
  { id: 'finance',      label: 'Finance',         textColor: 'text-emerald-300', bgColor: 'bg-emerald-500/15', dotColor: 'bg-emerald-400' },
  { id: 'personal',     label: 'Personal',        textColor: 'text-pink-300',    bgColor: 'bg-pink-500/15',    dotColor: 'bg-pink-400' },
  { id: 'legal',        label: 'Legal',           textColor: 'text-orange-300',  bgColor: 'bg-orange-500/15',  dotColor: 'bg-orange-400' },
  { id: 'opportunities',label: 'Opportunities',   textColor: 'text-yellow-300',  bgColor: 'bg-yellow-500/15',  dotColor: 'bg-yellow-400' },
]

export const PRIORITIES: PriorityMeta[] = [
  { id: 'p1', label: 'P1 Critical', textColor: 'text-red-300',    bgColor: 'bg-red-500/20',    order: 1 },
  { id: 'p2', label: 'P2 High',     textColor: 'text-orange-300', bgColor: 'bg-orange-500/20', order: 2 },
  { id: 'p3', label: 'P3 Medium',   textColor: 'text-yellow-300', bgColor: 'bg-yellow-500/20', order: 3 },
  { id: 'p4', label: 'P4 Low',      textColor: 'text-zinc-400',   bgColor: 'bg-zinc-700/50',   order: 4 },
]

export const STATUSES: StatusMeta[] = [
  { id: 'today',      label: 'Today' },
  { id: 'this_week',  label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'backlog',    label: 'Backlog' },
  { id: 'archived',   label: 'Archived' },
]

export function getCategoryMeta(id: TaskCategory): CategoryMeta {
  return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[0]
}

export function getPriorityMeta(id: TaskPriority): PriorityMeta {
  return PRIORITIES.find(p => p.id === id) ?? PRIORITIES[3]
}
