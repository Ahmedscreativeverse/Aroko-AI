'use client'

export const dynamic = 'force-dynamic'

import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, Trash2 } from 'lucide-react'

interface HistoryItem {
  id: number
  idea: string
  generatedAt: string
  timestamp: Date
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function HistoryPage() {
  const historyItems: HistoryItem[] = [
    {
      id: 1,
      idea: 'Launch a fintech podcast for African founders',
      generatedAt: 'Today, 2:30 PM',
      timestamp: new Date(),
    },
    {
      id: 2,
      idea: 'Summer fashion collection campaign strategy',
      generatedAt: 'Yesterday, 10:15 AM',
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: 3,
      idea: 'B2B analytics platform launch announcement',
      generatedAt: '3 days ago',
      timestamp: new Date(Date.now() - 259200000),
    },
    {
      id: 4,
      idea: 'Organic wellness brand marketing strategy',
      generatedAt: '1 week ago',
      timestamp: new Date(Date.now() - 604800000),
    },
    {
      id: 5,
      idea: 'Local restaurant grand opening campaign',
      generatedAt: '2 weeks ago',
      timestamp: new Date(Date.now() - 1209600000),
    },
    {
      id: 6,
      idea: 'Tech conference 2024 announcement strategy',
      generatedAt: '3 weeks ago',
      timestamp: new Date(Date.now() - 1814400000),
    },
  ]

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
              View all your previously generated content strategies
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
                placeholder="Search by idea..."
                className="pl-10 bg-card"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Today', 'This Week', 'This Month', 'Older'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 rounded-lg border border-border hover:border-muted-foreground text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>

          {/* History Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            {historyItems.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.05 }}
                className="group rounded-lg border border-border bg-card hover:border-muted-foreground transition-all duration-300 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium group-hover:text-foreground transition-colors truncate">
                      {item.idea}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.generatedAt}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <button className="px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                    View
                  </button>
                  <button className="rounded-md p-2 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 flex items-center justify-center gap-2"
          >
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <button className="h-10 w-10 rounded-md bg-foreground text-background font-medium flex items-center justify-center">
              1
            </button>
            <button className="h-10 w-10 rounded-md border border-border hover:border-muted-foreground font-medium flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              2
            </button>
            <button className="h-10 w-10 rounded-md border border-border hover:border-muted-foreground font-medium flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              3
            </button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
