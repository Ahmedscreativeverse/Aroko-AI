'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Download, File, Calendar, ExternalLink } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

interface ExportRecord {
  id: string
  format: string
  size: string
  createdAt: string
  projectId: string
}

export default function ExportsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [exports, setExports] = useState<ExportRecord[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  // Load local export records from sessionStorage (client-side export tracking)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('exportRecords')
      if (stored) {
        try {
          setExports(JSON.parse(stored))
        } catch {
          // ignore parse errors
        }
      }
    }
  }, [])

  const formatIcon: Record<string, string> = {
    pdf: '📄',
    markdown: '✍️',
    json: '📝',
    text: '📋',
  }

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
              Content packages you have downloaded during this session.
            </p>
          </motion.div>

          {exports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border/50 bg-card/50 p-12 text-center"
            >
              <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="text-xl font-semibold mb-2">No exports yet</h3>
              <p className="text-muted-foreground mb-6">
                Generate content in the AI Studio and export it as PDF, Markdown, JSON, or Text.
              </p>
              <Button onClick={() => router.push('/studio')}>Open AI Studio</Button>
            </motion.div>
          ) : (
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
                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-2xl">
                      {formatIcon[exp.format] ?? '📁'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium group-hover:text-foreground transition-colors truncate capitalize">
                        {exp.format.toUpperCase()} Export
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{exp.format}</span>
                        {exp.size && (
                          <>
                            <span>•</span>
                            <span>{exp.size}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(exp.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => router.push(`/results`)}
                      className="rounded-md p-2 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      title="View project results"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
