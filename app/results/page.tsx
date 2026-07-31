'use client'

export const dynamic = 'force-dynamic'

import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Copy, Edit, RotateCcw, Download, Share2, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface ResultCard {
  id: string
  title: string
  content: string
  icon: React.ReactNode
}

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

export default function ResultsPage() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(['creative-brief']))
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<GenerationContent | null>(null)

  // Load generated content from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('generationResult')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setGeneratedContent(parsed)
        } catch (e) {
          console.error('[v0] Failed to parse generation result:', e)
        }
      }
    }
  }, [])

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExport = (format: 'pdf' | 'markdown' | 'json' | 'text') => {
    toast.success(`Exporting as ${format.toUpperCase()}...`)
    // TODO: Implement actual export functionality
    setTimeout(() => {
      toast.success(`Exported as ${format.toUpperCase()}!`)
    }, 1500)
  }

  const resultCards: ResultCard[] = [
    {
      id: 'creative-brief',
      title: 'Creative Brief',
      icon: '📋',
      content: generatedContent?.creative_brief || `Launch Strategy: "Fintech for African Founders"
      
Target Market: Entrepreneurs, investors, and finance professionals across Africa
Unique Value Proposition: First podcast dedicated to African fintech innovations
Key Topics: Blockchain, mobile payments, regulatory landscape, success stories
Distribution: Spotify, Apple Podcasts, YouTube
Launch Timeline: 8 weeks`,
    },
    {
      id: 'audience-analysis',
      title: 'Audience Analysis',
      icon: '👥',
      content: generatedContent?.audience_analysis || `Primary Audience: African entrepreneurs (25-45 years old)
- Average income: Mid-to-high earners
- Tech-savvy professionals
- Active on LinkedIn, Twitter, YouTube

Pain Points:
- Limited access to fintech information
- Need for localized insights
- Lack of African success stories

Engagement Drivers:
- Educational content
- Real founder stories
- Practical business tips`,
    },
    {
      id: 'brand-voice',
      title: 'Brand Voice',
      icon: '🎙️',
      content: generatedContent?.brand_voice || `Tone: Professional yet approachable
Energy: Dynamic and forward-thinking
Language: Clear, jargon-explained
Personality: Expert mentor mixed with enthusiastic storyteller

Key Messaging:
- "Innovation has an African accent"
- Empower through knowledge
- Celebrate African achievements
- Build community`,
    },
    {
      id: 'marketing-strategy',
      title: 'Marketing Strategy',
      icon: '📊',
      content: generatedContent?.marketing_strategy || `Phase 1 (Weeks 1-2): Teaser Campaign
- Behind-the-scenes content
- Guest announcements
- Platform setup

Phase 2 (Weeks 3-4): Launch Campaign
- Episode 1 release
- Guest interviews
- Media coverage

Phase 3 (Weeks 5-8): Growth & Engagement
- Weekly episodes
- Community building
- Sponsorship partnerships`,
    },
    {
      id: 'instagram-captions',
      title: 'Instagram Captions',
      icon: '📱',
      content: generatedContent?.instagram_caption || `Post 1: "🚀 Something big is coming to the African tech space. Are you ready? #FinTech #Africa #Innovation"

Post 2: "Meet the changemakers. Hear their stories. Subscribe to [Podcast Name] 🎙️ Link in bio #StartupStories #AfricanTech"

Post 3: "From Lagos to Cairo. From Nairobi to Cape Town. We're telling the stories that matter. New episode every Wednesday 🔥 #PodcastLife"`,
    },
    {
      id: 'linkedin-posts',
      title: 'LinkedIn Posts',
      icon: '💼',
      content: generatedContent?.linkedin_post || `Post 1: "The African fintech landscape is evolving rapidly, but one thing has been missing: A platform for African voices. We're changing that. Launching [Podcast Name] - featuring founders, investors, and innovators shaping finance in Africa. Subscribe now."

Post 2: "Why I started [Podcast Name]: After countless conversations with African fintech founders, I realized we needed a space to share knowledge, celebrate wins, and navigate challenges together. Join us as we build the narrative around African innovation."`,
    },
    {
      id: 'twitter-threads',
      title: 'Twitter Threads',
      icon: '🐦',
      content: generatedContent?.twitter_thread || `Thread 1:
1/ The African fintech revolution is here 🧵
2/ Mobile money transformed payments
3/ But the story goes deeper than that
4/ African founders are building the FUTURE of finance
5/ That's why we launched [Podcast Name]
6/ Join us as we uncover these stories

Thread 2:
1/ 5 reasons why African fintech is the next big opportunity
2/ Demographics: Young, mobile-first population
3/ Infrastructure: Leapfrogging traditional banking
4/ Talent: World-class engineers and founders
5/ Capital: Record investment flowing in
6/ Stories: We're here to tell them 🎙️`,
    },
    {
      id: 'youtube-titles',
      title: 'YouTube Titles',
      icon: '📹',
      content: (generatedContent?.facebook_post || generatedContent?.call_to_action) ? `${generatedContent.call_to_action || ''}\n\nFacebook Post:\n${generatedContent.facebook_post || ''}` : `1. "The Future of African FinTech | [Founder Name] Interview"
2. "How This African Startup is Disrupting Finance | [Company]"
3. "Mobile Money Revolution: The African FinTech Story"
4. "Why African Founders Are Building Better | [Podcast Episode]"
5. "FinTech Explained: The African Perspective | [Podcast]"`,
    },
  ]

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
            <h1 className="text-3xl font-bold mb-2">Generated Content Package</h1>
            <p className="text-muted-foreground">
              Your AI-generated creative strategy for "Launch a fintech podcast for African founders"
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <Button 
              className="gap-2"
              onClick={() => handleExport('pdf')}
            >
              <Download className="h-4 w-4" />
              Export as PDF
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => toast.info('Share feature coming soon!')}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => toast.info('Regenerate feature coming soon!')}
            >
              <RotateCcw className="h-4 w-4" />
              Regenerate
            </Button>
          </motion.div>

          {/* Results Cards */}
          <div className="space-y-4">
            {resultCards.map((card, i) => {
              const isExpanded = expandedCards.has(card.id)

              return (
                <motion.div
                  key={card.id}
                  initial={fadeInUp.initial}
                  animate={fadeInUp.animate}
                  transition={{ delay: i * 0.05 }}
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
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  {/* Card Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border"
                    >
                      <div className="px-6 py-4 space-y-4">
                        <div className="prose prose-invert max-w-none">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {card.content}
                          </p>
                        </div>

                        {/* Card Actions */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                          <button
                            onClick={() => handleCopy(card.id, card.content)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:border-muted-foreground hover:bg-secondary/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
                          >
                            {copiedId === card.id ? (
                              <>
                                <span className="h-4 w-4">✓</span>
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copy
                              </>
                            )}
                          </button>
                          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:border-muted-foreground hover:bg-secondary/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:border-muted-foreground hover:bg-secondary/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground">
                            <RotateCcw className="h-4 w-4" />
                            Regenerate
                          </button>
                          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:border-muted-foreground hover:bg-secondary/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground">
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
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
            <h3 className="font-semibold mb-4">Export Your Package</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Download your complete content strategy in your preferred format
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
