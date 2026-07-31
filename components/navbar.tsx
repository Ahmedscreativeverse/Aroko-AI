'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/auth-context'
import { useLogout } from '@/lib/auth/auth-hooks'
import { toast } from 'sonner'
import { Settings, LogOut } from 'lucide-react'

interface NavbarProps {
  onMenuClick?: () => void
  isSidebarOpen?: boolean
}

export function Navbar({ onMenuClick, isSidebarOpen = true }: NavbarProps) {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const logoutMutation = useLogout()
  const { user } = useAuth()

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const displayEmail = user?.email || ''
  const initials = displayName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <nav
      className={cn(
        'fixed top-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300',
        isSidebarOpen ? 'left-64' : 'left-0'
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex flex-1 items-center gap-4">
          {/* Menu Toggle */}
          {!isSidebarOpen && (
            <button
              onClick={onMenuClick}
              className="rounded-md p-2 hover:bg-secondary/50 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Search Bar */}
          <div className="flex-1 max-w-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement)?.value.trim()
                if (q) router.push(`/projects?search=${encodeURIComponent(q)}`)
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="q"
                  type="search"
                  placeholder="Search projects..."
                  className="h-8 w-full rounded-lg border border-input bg-secondary px-2.5 py-1 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-md p-2 hover:bg-secondary/50 transition-colors"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-border bg-card shadow-lg z-50">
                <div className="p-3 border-b border-border/50">
                  <p className="text-sm font-semibold">Notifications</p>
                </div>
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              </div>
            )}
          </div>

          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="h-9 w-9 rounded-full bg-secondary border border-border hover:border-muted-foreground transition-colors flex items-center justify-center"
            >
              <span className="text-xs font-semibold">{initials}</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50">
                <div className="p-3 border-b border-border/50">
                  <p className="text-sm font-semibold">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{displayEmail}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => {
                      router.push('/settings')
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/50 transition-colors text-sm"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 transition-colors text-sm text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

