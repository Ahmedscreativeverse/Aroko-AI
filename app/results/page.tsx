'use client'

export const dynamic = 'force-dynamic'

import { DashboardLayout } from '@/components/dashboard-layout'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Copy, RotateCcw, Download, Share2, ChevronDown, ChevronUp, Check, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { exportContent, type ContentData, type ExportOptions, type ExportFormat } from '@/lib/export/export-utils'
import { Suspense } from 'react'

interface GenerationContent {
  creative_brief?: string
  audience_analysis?: string
  brand_voice?: string
  marketing_strategy?: string
  instagram_caption?: string
  linkedin_post?: string
  twitter_thread?: string
  facebook_post?: string
  call_to_action?: string
  hashtags?: string[]
  seo_keywords?: string[]
  publishing_recommendations?: string
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

interface ResultCard {
  id: string
  title: string
  icon: string
  content: string | string[]
  isArray?: boolean
}

function buildResultCards(content: GenerationContent): ResultCard[] {
  return [
    {
      id: 'creative-brief',
      title: 'Creative Brief',
      icon: '📋',
      content: content.creative_brief || '',
    },
    {
      id: 'audience-analysis',
      title: 'Audience Analysis',
      icon: '👥',
      content: content.audience_analysis || '',
    },
    {
      id: 'brand-voice',
      title: 'Brand Voice',
      icon: '🎙️',
      content: content.brand_voice || '',
    },
    {
      id: 'marketing-strategy',
      title: 'Marketing Strategy',
      icon: '📊',
      content: content.marketing_strategy || '',
    },
    {
      id: 'instagram',
      title: 'Instagram Caption',
      icon: '📱',
      content: content.instagram_caption || '',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Post',
      icon: '💼',
      content: content.linkedin_post || '',
    },
    {
      id: 'twitter',
      title: 'Twitter / X Thread',
      icon: '🐦',
      content: content.twitter_thread || '',
    },
    {
      id: 'facebook',
      title: 'Facebook Post',
      icon: '📘',
      content: content.facebook_post || '',
    },
    {
      id: 'cta',
      title: 'Call to Action',
      icon: '⚡',
      content: content.call_to_action || '',
    },
    {
      id: 'hashtags',
      title: 'Hashtags',
      icon: '#️⃣',
      content: content.hashtags || [],
      isArray: true,
    },
    {
      id: 'seo',
      title: 'SEO Keywords',
      icon: '🔍',
      content: content.seo_keywords || [],
      isArray: true,
    },
    {
      id: 'publishing',
      title: 'Publishing Recommendations',
      icon: '📅',
      content: content.publishing_recommendations || '',
    },
  ].filter((card) =>
    Array.isArray(card.content) ? card.content.length > 0 : card.content.length > 0
  )
}

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(['creative-brief']))
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<GenerationContent | null>(null)
  const [projectName, setProjectName] = useState('Generated Content Package')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('generationResult')
      const meta = sessionStorage.getItem('generationMeta')
      if (stored) {
        try {
          setGeneratedContent(JSON.parse(stored))
        } catch {
          toast.error('Could not load generation results.')
        }
      }
      if (meta) {
        try {
          const parsed = JSON.parse(meta)
          if (parsed.projectName) setProjectName(parsed.projectName)
        } catch {
          // ignore
        }
      }
    }
  }, [])

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleCopy = (id: string, content: string | string[]) => {
    const text = Array.isArray(content) ? content.join('\n') : content
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExport = (format: ExportFormat) => {
    if (!generatedContent) {
      toast.error('No content to export.')
      return
    }

    const requiredKeys: (keyof ContentData)[] = [
      'creative_brief', 'audience_analysis', 'brand_voice', 'marketing_strategy',
      'instagram_caption', 'linkedin_post', 'twitter_thread', 'facebook_post',
      'call_to_action', 'hashtags', 'seo_keywords', 'publishing_recommendations',
    ]

    const contentData = requiredKeys.reduce((acc, key) => {
      const val = generatedContent[key]
      ;(acc as any)[key] = val ?? (key === 'hashtags' || key === 'seo_keywords' ? [] : '')
      return acc
    }, {} as ContentData)

    const options: ExportOptions = {
      projectName,
      idea: '',
      industry: '',
      targetAudience: '',
      tone: '',
      generatedAt: new Date(),
    }

    try {
      exportContent(format, contentData, options)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Export failed. Please try again.')
    }
  }

  if (!generatedContent) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              No generated content found. Create content from the AI Studio.
            </p>
            <Button onClick={() => router.push('/studio')}>Open AI Studio</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const resultCards = buildResultCards(generatedContent)

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold mb-2">Generated Content Package</h1>
            <p className="text-muted-foreground">{projectName}</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <Button className="gap-2" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                const url = window.location.href
                navigator.clipboard.writeText(url)
                toast.success('Link copied to clipboard!')
              }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.back()}
            >
              <RotateCcw className="h-4 w-4" />
              Regenerate
            </Button>
          </motion.div>

          {/* Results Cards */}
          <div className="space-y-4">
            {resultCards.map((card, i) => {
              const isExpanded = expandedCards.has(card.id)
              const contentText = Array.isArray(card.content)
                ? card.content.join('\n')
                : card.content

              return (
                <motion.div
                  key={card.id}
                  initial={fadeInUp.initial}
                  animate={fadeInUp.animate}
                  transition={{ delay: i * 0.04 }}
                  className="border border-border bg-card rounded-xl overflow-hidden hover:border-muted-foreground transition-colors"
                >
                  {/* Card Header */}
                  <button
                    onClick={() => toggleCard(card.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left flex-1">
                      <span className="text-2xl">{card.icon}</span>
                      <h3 className="font-semibold">{card.title}</h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {/* Card Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-border"
                      >
                        <div className="px-6 py-4 space-y-4">
                          {card.isArray && Array.isArray(card.content) ? (
                            <div className="flex flex-wrap gap-2">
                              {card.content.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-full border border-border bg-secondary text-sm text-muted-foreground"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {contentText}
                            </p>
                          )}

                          {/* Card Actions */}
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                            <button
                              onClick={() => handleCopy(card.id, card.content)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:border-muted-foreground hover:bg-secondary/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                              {copiedId === card.id ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Export Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 p-8 rounded-xl border border-border bg-card"
          >
            <h3 className="font-semibold mb-2">Export Your Package</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Download your complete content strategy in your preferred format.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { format: 'pdf' as const, label: 'PDF', icon: '📄' },
                { format: 'json' as const, label: 'JSON', icon: '📝' },
                { format: 'markdown' as const, label: 'Markdown', icon: '✍️' },
                { format: 'text' as const, label: 'Text', icon: '📋' },
              ].map((item) => (
                <button
                  key={item.format}
                  onClick={() => handleExport(item.format)}
                  className="p-4 rounded-lg border border-border hover:border-muted-foreground hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </DashboardLayout>
    }>
      <ResultsContent />
    </Suspense>
  )
}
