'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, BarChart3, History, BookOpen, Sparkles, Download, Settings, HelpCircle, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen?: boolean
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: BarChart3,
    },
    {
      label: 'History',
      href: '/history',
      icon: History,
    },
    {
      label: 'Templates',
      href: '/templates',
      icon: BookOpen,
    },
    {
      label: 'AI Studio',
      href: '/studio',
      icon: Sparkles,
    },
    {
      label: 'Exports',
      href: '/exports',
      icon: Download,
    },
  ]

  const bottomItems = [
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
    {
      label: 'Help',
      href: '/help',
      icon: HelpCircle,
    },
  ]

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen border-r border-border bg-sidebar transition-all duration-300',
        isOpen ? 'w-64' : 'w-0 -translate-x-full'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-border px-6 py-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Aroko
              <span className="text-xs font-normal opacity-75"> AI</span>
            </h1>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="space-y-2 border-t border-border px-4 py-4">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Logout */}
          <button
            className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
