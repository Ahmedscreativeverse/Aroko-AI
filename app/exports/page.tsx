'use client'

export const dynamic = 'force-dynamic'

import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Download, File, Calendar, Trash2 } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

interface Export {
  id: number
  name: string
  format: string
  project: string
  exportedAt: string
  size: string
  icon: React.ReactNode
}

export default function ExportsPage() {
  const exports: Export[] = [
    {
      id: 1,
      name: 'Fintech Podcast Launch',
      format: 'PDF',
      project: 'Fintech Podcast Launch',
      exportedAt: '2 hours ago',
      size: '2.4 MB',
      icon: <span className="text-2xl">📄</span>,
    },
    {
      id: 2,
      name: 'Summer Campaign Strategy',
      format: 'DOCX',
      project: 'E-commerce Campaign',
      exportedAt: '1 day ago',
      size: '1.8 MB',
      icon: <span className="text-2xl">📝</span>,
    },
    {
      id: 3,
      name: 'SaaS Launch Plan',
      format: 'Markdown',
      project: 'SaaS Product Launch',
      exportedAt: '3 days ago',
      size: '450 KB',
      icon: <span className="text-2xl">✍️</span>,
    },
    {
      id: 4,
      name: 'Wellness Brand Strategy',
      format: 'PDF',
      project: 'Wellness Brand Launch',
      exportedAt: '1 week ago',
      size: '3.1 MB',
      icon: <span className="text-2xl">📄</span>,
    },
    {
      id: 5,
      name: 'Tech Conference 2024',
      format: 'DOCX',
      project: 'Tech Conference 2024',
      exportedAt: '2 weeks ago',
      size: '2.2 MB',
      icon: <span className="text-2xl">📝</span>,
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
            <h1 className="text-3xl font-bold mb-2">My Exports</h1>
            <p className="text-muted-foreground">
              Download and manage all your exported content strategies
            </p>
          </motion.div>

          {/* Exports List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            {exports.map((exp, i) => (
              <motion.div
                key={exp.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.05 }}
                className="group rounded-lg border border-border bg-card hover:border-muted-foreground transition-all duration-300 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    {exp.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium group-hover:text-foreground transition-colors truncate">
                      {exp.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{exp.format}</span>
                      <span>•</span>
                      <span>{exp.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exp.exportedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <button className="rounded-md p-2 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="rounded-md p-2 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State when needed */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-xl border border-border/50 bg-card/50 p-12 text-center"
          >
            <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No exports yet</h3>
            <p className="text-muted-foreground mb-6">
              Generate content strategies and export them as PDF, DOCX, Markdown, or Text
            </p>
            <Button>Create Your First Strategy</Button>
          </motion.div> */}
        </div>
      </div>
    </DashboardLayout>
  )
}
