'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { CreateProjectModal, type ProjectFormData } from '@/components/create-project-modal'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal, Trash2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useCreateProject, useDeleteProject, useProjects } from '@/lib/projects/project-hooks'
import { formatRelativeTime, projectStatusLabel } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function ProjectsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProjects(user?.id)
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()

  const projects = data?.pages.flatMap((page) => page.projects) ?? []

  const handleCreateProject = async (formData: ProjectFormData) => {
    if (!user) return
    try {
      await createProject.mutateAsync({
        userId: user.id,
        project: {
          name: formData.projectName,
          idea: formData.idea,
          industry: formData.industry || null,
          target_audience: formData.targetAudience || null,
          tone: formData.tone || null,
        },
      })
      setIsModalOpen(false)
      toast.success('Project created successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
    }
  }

  const handleDuplicate = async (project: (typeof projects)[number]) => {
    if (!user) return
    try {
      await createProject.mutateAsync({
        userId: user.id,
        project: {
          name: `${project.name} (Copy)`,
          idea: project.idea,
          industry: project.industry,
          target_audience: project.target_audience,
          tone: project.tone,
        },
      })
      toast.success('Project duplicated!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to duplicate project')
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    try {
      await deleteProject.mutateAsync({ projectId: id, userId: user.id })
      toast.success('Project deleted')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete project')
    }
  }

  const handleOpenProject = (projectId: string) => {
    router.push(`/studio?projectId=${projectId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated':
        return 'bg-foreground text-background'
      case 'In Progress':
        return 'bg-secondary text-foreground'
      case 'Failed':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-secondary text-muted-foreground'
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Projects</h1>
              <p className="text-muted-foreground">
                Manage and organize your AI-generated content packages
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </motion.div>

          {/* Filters and Sort */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {['All', 'Generated', 'In Progress', 'Failed'].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-lg border border-border hover:border-muted-foreground text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {isLoading && (
            <div className="rounded-xl border border-border/50 bg-card/50 p-12 text-center text-muted-foreground">
              Loading projects...
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center text-destructive">
              Couldn't load your projects. Please try again.
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {/* Projects Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: i * 0.05 }}
                    className="group rounded-xl border border-border bg-card hover:border-muted-foreground transition-all duration-300 hover:shadow-lg hover:shadow-black/50 overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-border/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover:text-foreground transition-colors mb-1">
                            {project.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.idea}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusColor(
                          projectStatusLabel(project.status)
                        )}`}
                      >
                        {projectStatusLabel(project.status)}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Meta Info */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground mb-1">Industry</p>
                          <p className="font-medium text-foreground">{project.industry || '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Last Edited</p>
                          <p className="font-medium text-foreground">
                            {formatRelativeTime(project.updated_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between bg-secondary/20">
                      <button
                        onClick={() => handleOpenProject(project.id)}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Open Project →
                      </button>

                      {/* Actions Menu */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicate(project)}
                          className="rounded-md p-2 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="rounded-md p-2 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="rounded-md p-2 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {hasNextPage && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {projects.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border/50 bg-card/50 p-12 text-center"
                >
                  <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first project to start generating content
                  </p>
                  <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Project
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </DashboardLayout>
  )
}
