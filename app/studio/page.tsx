'use client'

export const dynamic = 'force-dynamic'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Copy, RotateCcw, ArrowRight, Check, Loader } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth/auth-context'
import { useGenerateContent } from '@/lib/ai/generation-hooks'
import { useProject } from '@/lib/projects/project-hooks'

type GenerationPhase = 
  | 'idle'
  | 'understanding'
  | 'researching'
  | 'strategy'
  | 'content'
  | 'titles'
  | 'captions'
  | 'hashtags'
  | 'calendar'
  | 'packaging'
  | 'complete'

interface GenerationStatus {
  phase: GenerationPhase
  isGenerating: boolean
  progress: number
  error?: string
}

const phases = [
  { id: 'understanding', label: 'Understanding idea...' },
  { id: 'researching', label: 'Finding audience...' },
  { id: 'strategy', label: 'Generating strategy...' },
  { id: 'content', label: 'Writing titles...' },
  { id: 'titles', label: 'Writing captions...' },
  { id: 'captions', label: 'Generating hashtags...' },
  { id: 'hashtags', label: 'Building content calendar...' },
  { id: 'calendar', label: 'Packaging results...' },
]

export default function StudioPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  const { user, loading: authLoading } = useAuth()
  const { data: project } = useProject(projectId)
  const generateContent = useGenerateContent()
  const [idea, setIdea] = useState('')
  const [industry, setIndustry] = useState('Technology')
  const [targetAudience, setTargetAudience] = useState('')
  const [tone, setTone] = useState('Professional')
  const [status, setStatus] = useState<GenerationStatus>({
    phase: 'idle',
    isGenerating: false,
    progress: 0,
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (project) {
      setIdea(project.idea || '')
      if (project.industry) setIndustry(project.industry)
      setTargetAudience(project.target_audience || '')
      if (project.tone) setTone(project.tone)
    }
  }, [project])

  const handleGenerate = useCallback(async () => {
    // Validation
    if (!idea.trim()) {
      toast.error('Please describe your idea')
      return
    }
    if (!targetAudience.trim()) {
      toast.error('Please specify your target audience')
      return
    }
    if (!projectId) {
      toast.error('No project selected. Please open this from a project.')
      return
    }
    if (!user) {
      toast.error('Please sign in to generate content')
      router.push('/login')
      return
    }
    if (generateContent.isPending) {
      // Prevent duplicate submissions
      return
    }

    setStatus({
      phase: 'understanding',
      isGenerating: true,
      progress: 0,
      error: undefined,
    })

    try {
      // Simulate progress through phases
      for (let i = 0; i < phases.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 600))
        const phaseId = phases[i].id as GenerationPhase
        setStatus((prev) => ({
          ...prev,
          phase: phaseId,
          progress: Math.round(((i + 1) / phases.length) * 100),
        }))
      }

      // Call the actual generate API via the auth-aware mutation
      const result = await generateContent.mutateAsync({
        projectId,
        idea: idea.trim(),
        industry,
        targetAudience: targetAudience.trim(),
        tone,
      })

      // After completion, show success
      await new Promise((resolve) => setTimeout(resolve, 500))
      setStatus({
        phase: 'complete',
        isGenerating: false,
        progress: 100,
      })

      toast.success('Content generated successfully! Redirecting to results...')

      // Store results and metadata in sessionStorage for the results page
      sessionStorage.setItem('generationResult', JSON.stringify(result.content))
      sessionStorage.setItem(
        'generationMeta',
        JSON.stringify({ projectName: project?.name || idea.trim().slice(0, 60) })
      )

      // Redirect to results page
      setTimeout(() => {
        router.push('/results')
      }, 1500)

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Generation failed'
      setStatus({
        phase: 'idle',
        isGenerating: false,
        progress: 0,
        error: message,
      })

      if (message === 'Session expired' || message === 'Authentication required') {
        toast.error('Your session has expired. Please sign in again.')
        router.push('/login')
      } else if (message === 'Network error') {
        toast.error('Network error. Please check your connection and try again.')
      } else if (message === 'Backend unavailable') {
        toast.error('Our servers are having trouble right now. Please try again shortly.')
      } else {
        toast.error(message || 'Generation failed. Please try again.')
      }
    }
  }, [idea, targetAudience, projectId, user, generateContent, router])

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(idea)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isGenerating = status.isGenerating || generateContent.isPending
  const currentPhaseIndex = phases.findIndex((p) => p.id === status.phase)
  const currentPhaseLabel = currentPhaseIndex >= 0 ? phases[currentPhaseIndex].label : ''

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-8 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Studio</h1>
                <p className="text-muted-foreground">Transform your idea into complete content</p>
              </div>
            </div>
          </motion.div>

          {!projectId && (
            <div className="mb-6 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
              No project selected.{' '}
              <button
                onClick={() => router.push('/projects')}
                className="font-medium text-foreground underline underline-offset-2"
              >
                Choose or create a project
              </button>{' '}
              to generate content.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Your Idea</h2>

                {/* Idea Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Describe Your Idea
                    </label>
                    <textarea
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="Explain your product, service, or idea..."
                      className="w-full h-24 px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground focus:outline-none focus:border-primary"
                      disabled={isGenerating}
                    >
                      <option>Technology</option>
                      <option>Healthcare</option>
                      <option>Finance</option>
                      <option>E-commerce</option>
                      <option>Education</option>
                      <option>Media & Entertainment</option>
                      <option>Real Estate</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Target Audience
                    </label>
                    <Input
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., Small business owners"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Brand Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground focus:outline-none focus:border-primary"
                      disabled={isGenerating}
                    >
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Friendly</option>
                      <option>Humorous</option>
                      <option>Inspirational</option>
                      <option>Educational</option>
                    </select>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !idea.trim() || !targetAudience.trim() || !projectId}
                    size="lg"
                    className="w-full gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Generation Status Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-card border border-border rounded-lg p-8">
                <AnimatePresence mode="wait">
                  {!isGenerating && status.phase === 'idle' ? (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center py-12"
                    >
                      <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Ready to generate?</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Describe your idea, set your target audience, and let AI create comprehensive marketing content.
                      </p>
                    </motion.div>
                  ) : !isGenerating && status.phase === 'complete' ? (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-12"
                    >
                      <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Complete!</h3>
                      <p className="text-muted-foreground mb-6">
                        Your content has been generated. Review and refine it on the next page.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Progress Bar */}
                      <div className="mb-8">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Progress</span>
                          <span className="text-sm text-muted-foreground">{status.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-primary h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${status.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Current Phase */}
                      <div className="space-y-4">
                        <div className="bg-secondary rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Loader className="h-5 w-5 text-primary animate-spin" />
                            <div>
                              <p className="font-medium text-foreground">{currentPhaseLabel}</p>
                              <p className="text-sm text-muted-foreground">
                                Step {currentPhaseIndex + 1} of {phases.length}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Phase List */}
                        <div className="space-y-2">
                          {phases.map((phase, idx) => {
                            const isCompleted = idx < currentPhaseIndex
                            const isCurrent = phase.id === status.phase
                            return (
                              <motion.div
                                key={phase.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`flex items-center gap-3 text-sm p-2 rounded ${
                                  isCompleted ? 'text-green-500' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="h-4 w-4" />
                                ) : isCurrent ? (
                                  <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-current" />
                                )}
                                <span>{phase.label}</span>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Prompts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  'AI-powered productivity app for teams',
                  'Sustainable fashion e-commerce platform',
                  'Mental health support chatbot',
                  'Blockchain-based payment system',
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setIdea(example)}
                    disabled={isGenerating}
                    className="text-left p-3 bg-secondary border border-border rounded hover:border-primary transition-colors text-sm text-foreground hover:bg-secondary/80"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
