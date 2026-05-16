'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  BookOpen,
  TrendingUp,
  Heart,
  Target,
  Brain,
  Settings,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/',        icon: LayoutDashboard, label: 'Home' },
  { href: '/crm',     icon: ListTodo,        label: 'CRM' },
  { href: '/habits',  icon: Zap,             label: 'Habits',   soon: true },
  { href: '/journal', icon: BookOpen,        label: 'Journal',  soon: true },
  { href: '/finance', icon: TrendingUp,      label: 'Finance',  soon: true },
  { href: '/health',  icon: Heart,           label: 'Health',   soon: true },
  { href: '/goals',   icon: Target,          label: 'Goals',    soon: true },
  { href: '/brain',   icon: Brain,           label: 'Brain',    soon: true },
  { href: '/calendar',icon: CalendarDays,    label: 'Calendar', soon: true },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col w-16 lg:w-56 shrink-0 border-r border-[#1e1e28] bg-[#111118] transition-all duration-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1e1e28]">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="hidden lg:block font-semibold text-sm text-white tracking-wide">
          Personal OS
        </span>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-3 space-y-0.5 px-2">
        {NAV.map(({ href, icon: Icon, label, soon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={soon ? '#' : href}
              onClick={soon ? e => e.preventDefault() : undefined}
              className={cn(
                'flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors group relative',
                active
                  ? 'bg-indigo-500/15 text-indigo-300'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#1e1e28]',
                soon && 'cursor-default opacity-50'
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              <span className="hidden lg:block font-medium">{label}</span>
              {soon && (
                <span className="hidden lg:block ml-auto text-[10px] text-zinc-600 font-mono">
                  soon
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-[#1e1e28] pt-3">
        <button className="flex items-center gap-3 px-2 py-2 w-full rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-[#1e1e28] transition-colors">
          <Settings size={18} className="shrink-0" />
          <span className="hidden lg:block font-medium">Settings</span>
        </button>
      </div>
    </nav>
  )
}
