'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth/auth-context'
import { useCreateProject, useProjects } from '@/lib/projects/project-hooks'
import { formatRelativeTime, projectStatusLabel } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [ideaDraft, setIdeaDraft] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const { data } = useProjects(user?.id)
  const createProject = useCreateProject()
  const recentProjects = (data?.pages.flatMap((page) => page.projects) ?? []).slice(0, 3)

  const prompts = [
    'Launch a skincare brand',
    'Create a podcast',
    'Promote a product',
    'Write a LinkedIn campaign',
    'Create YouTube content',
  ]

  const handleGenerateFromHero = async () => {
    if (!ideaDraft.trim()) {
      toast.error('Describe your idea first')
      return
    }
    if (!user) {
      router.push('/login')
      return
    }
    try {
      const project = await createProject.mutateAsync({
        userId: user.id,
        project: {
          name: ideaDraft.trim().slice(0, 60),
          idea: ideaDraft.trim(),
        },
      })
      router.push(`/studio?projectId=${project.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 md:p-8">
        {/* Create with AI Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-md overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Create with AI</h2>
                <p className="text-muted-foreground">
                  Transform your idea into a complete content production package
                </p>
              </div>
              <div className="hidden md:flex h-12 w-12 rounded-lg bg-secondary border border-border items-center justify-center">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>

            {/* Prompt Input */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="relative">
                <textarea
                  value={ideaDraft}
                  onChange={(e) => setIdeaDraft(e.target.value)}
                  placeholder="Describe your idea..."
                  className="w-full min-h-24 rounded-lg border border-border bg-secondary px-4 py-3 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
                <Button
                  size="lg"
                  className="absolute bottom-3 right-3 gap-2"
                  onClick={handleGenerateFromHero}
                  disabled={createProject.isPending}
                >
                  {createProject.isPending ? 'Creating...' : 'Generate'} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Prompt Suggestions */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Try with:</p>
                <div className="flex flex-wrap gap-2">
                  {prompts.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      className="px-3 py-1.5 rounded-md border border-border bg-secondary hover:bg-secondary/80 text-sm transition-colors text-muted-foreground hover:text-foreground"
                      onClick={() => setIdeaDraft(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </motion.section>

        {/* Recent Projects Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Recent Projects</h3>
              <p className="text-sm text-muted-foreground">Your latest AI-generated content packages</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push('/projects')}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          {recentProjects.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-card/50 p-8 text-center text-sm text-muted-foreground">
              No projects yet.{' '}
              <button onClick={() => router.push('/projects')} className="font-medium text-foreground underline underline-offset-2">
                Create your first one
              </button>
              .
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onClick={() => router.push(`/studio?projectId=${project.id}`)}
                className="group p-6 rounded-xl border border-border bg-card hover:border-muted-foreground transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-black/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold group-hover:text-foreground transition-colors">{project.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{project.idea}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-secondary text-muted-foreground whitespace-nowrap">
                    {projectStatusLabel(project.status)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">Edited {formatRelativeTime(project.updated_at)}</p>
                  <button className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                    Open →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </motion.section>

        {/* Empty State CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl border border-border bg-secondary/30 p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl font-bold mb-2">Need inspiration?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Check out templates from other creators or browse our gallery of successful campaigns.
          </p>
          <Button variant="outline">
            Explore Templates
          </Button>
        </motion.section>
      </div>
    </DashboardLayout>
  )
}
