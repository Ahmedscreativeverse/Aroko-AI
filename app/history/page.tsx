'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, ExternalLink } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useGenerationHistory } from '@/lib/ai/generation-hooks'
import { formatRelativeTime } from '@/lib/utils'
import type { Database } from '@/lib/supabase/database.types'

type HistoryItem = Database['public']['Tables']['generation_history']['Row']

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const TIME_FILTERS = ['All', 'Today', 'This Week', 'This Month', 'Older'] as const
type TimeFilter = (typeof TIME_FILTERS)[number]

function isToday(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return d >= weekAgo
}

function isThisMonth(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export default function HistoryPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('All')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const { data: historyItems = [], isLoading, isError } = useGenerationHistory(user?.id)

  const filteredItems = (historyItems as HistoryItem[]).filter((item) => {
    const matchesSearch = searchQuery.trim()
      ? item.project_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.prompt_used ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesTime = (() => {
      if (timeFilter === 'All') return true
      if (timeFilter === 'Today') return isToday(item.created_at)
      if (timeFilter === 'This Week') return isThisWeek(item.created_at)
      if (timeFilter === 'This Month') return isThisMonth(item.created_at)
      if (timeFilter === 'Older') return !isThisMonth(item.created_at)
      return true
    })()

    return matchesSearch && matchesTime
  })

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Generation History</h1>
            <p className="text-muted-foreground">
              All your AI content generation events, newest first.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-8 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search history..."
                className="pl-10 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {TIME_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    timeFilter === filter
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="rounded-xl border border-border/50 bg-card/50 p-12 text-center text-muted-foreground">
              Loading history...
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center text-destructive">
              Could not load history. Please try again.
            </div>
          )}

          {/* History Timeline */}
          {!isLoading && !isError && (
            <>
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border/50 bg-card/50 p-12 text-center"
                >
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                  <h3 className="text-xl font-semibold mb-2">
                    {searchQuery || timeFilter !== 'All' ? 'No matching results' : 'No history yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || timeFilter !== 'All'
                      ? 'Try adjusting your search or filter.'
                      : 'Generate content in the AI Studio to see your history here.'}
                  </p>
                  {!searchQuery && timeFilter === 'All' && (
                    <Button onClick={() => router.push('/studio')}>Open AI Studio</Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="space-y-3"
                >
                  {(filteredItems as HistoryItem[]).map((item, i) => (
                    <motion.div
                      key={item.id}
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: i * 0.04 }}
                      className="group rounded-lg border border-border bg-card hover:border-muted-foreground transition-all duration-300 p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium group-hover:text-foreground transition-colors truncate">
                            {item.prompt_used
                              ? item.prompt_used.slice(0, 80) + (item.prompt_used.length > 80 ? '...' : '')
                              : `Generation #${item.id.slice(0, 8)}`}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(item.created_at)}
                            </p>
                            {item.tokens_used != null && (
                              <p className="text-xs text-muted-foreground">
                                {item.tokens_used.toLocaleString()} tokens
                              </p>
                            )}
                            <span
                              className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                                item.status === 'completed'
                                  ? 'bg-green-500/10 text-green-500'
                                  : item.status === 'failed'
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-secondary text-muted-foreground'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => router.push(`/studio?projectId=${item.project_id}`)}
                        className="ml-4 flex-shrink-0 rounded-md p-2 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        title="Open project"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
