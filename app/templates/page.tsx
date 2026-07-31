'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useCreateProject } from '@/lib/projects/project-hooks'
import { toast } from 'sonner'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

interface Template {
  id: number
  title: string
  description: string
  category: string
  icon: string
  idea: string
  industry: string
  targetAudience: string
  tone: string
}

const templates: Template[] = [
  {
    id: 1,
    title: 'Product Launch Campaign',
    description: 'Complete strategy for launching a new product with audience analysis, content calendar, and more',
    category: 'Product',
    icon: '🚀',
    idea: 'Launch a new product to market with a full go-to-market content strategy covering awareness, consideration, and conversion phases.',
    industry: 'Technology',
    targetAudience: 'Early adopters and tech enthusiasts aged 25-40',
    tone: 'Professional',
  },
  {
    id: 2,
    title: 'Podcast Launch Strategy',
    description: 'Audio content strategy including branding, episode planning, and promotional content',
    category: 'Media',
    icon: '🎙️',
    idea: 'Launch a podcast brand with a complete content strategy including episode formats, distribution channels, and audience growth tactics.',
    industry: 'Media & Entertainment',
    targetAudience: 'Podcast listeners interested in industry insights and storytelling',
    tone: 'Casual',
  },
  {
    id: 3,
    title: 'Personal Branding',
    description: 'Build your personal brand across all platforms with consistent messaging and visuals',
    category: 'Personal',
    icon: '👤',
    idea: 'Build a personal brand for a professional or creator, establishing thought leadership and a consistent online presence across platforms.',
    industry: 'Education',
    targetAudience: 'Professionals, recruiters, and industry peers',
    tone: 'Inspirational',
  },
  {
    id: 4,
    title: 'E-commerce Campaign',
    description: 'Seasonal or ongoing e-commerce marketing strategy with product positioning and promotions',
    category: 'E-commerce',
    icon: '🛍️',
    idea: 'Drive sales for an e-commerce store with a multi-channel campaign covering product storytelling, promotions, and customer retention.',
    industry: 'E-commerce',
    targetAudience: 'Online shoppers aged 20-45 who value quality and convenience',
    tone: 'Friendly',
  },
  {
    id: 5,
    title: 'SaaS Marketing',
    description: 'B2B SaaS go-to-market strategy with thought leadership and sales enablement content',
    category: 'B2B',
    icon: '💼',
    idea: 'Market a SaaS product to businesses with a content strategy focused on solving pain points, demonstrating ROI, and building trust.',
    industry: 'Finance',
    targetAudience: 'Business owners, managers, and decision-makers at SMBs',
    tone: 'Professional',
  },
  {
    id: 6,
    title: 'Content Creator Kit',
    description: 'Everything a content creator needs: posting schedule, caption ideas, and growth strategies',
    category: 'Creator',
    icon: '📸',
    idea: 'Grow a content creator presence across social media platforms with an engagement-first strategy, consistent posting schedule, and viral content ideas.',
    industry: 'Media & Entertainment',
    targetAudience: 'Social media followers interested in lifestyle, entertainment, or niche content',
    tone: 'Casual',
  },
  {
    id: 7,
    title: 'Local Business Growth',
    description: 'Community-focused marketing strategy for restaurants, salons, and local services',
    category: 'Local',
    icon: '🏪',
    idea: 'Grow a local business through community engagement, local SEO, and hyperlocal social media campaigns that drive foot traffic and loyalty.',
    industry: 'E-commerce',
    targetAudience: 'Local residents and community members within a 10-mile radius',
    tone: 'Friendly',
  },
  {
    id: 8,
    title: 'Event Promotion',
    description: 'Multi-channel event marketing with ticket sales, awareness, and attendee engagement',
    category: 'Events',
    icon: '🎉',
    idea: 'Promote an event with a countdown campaign strategy covering awareness, registration, pre-event hype, and post-event content.',
    industry: 'Media & Entertainment',
    targetAudience: 'Event-goers and professionals interested in networking and experiences',
    tone: 'Inspirational',
  },
]

const categories = ['All', 'Product', 'Media', 'Personal', 'E-commerce', 'B2B', 'Creator', 'Local', 'Events']

export default function TemplatesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const createProject = useCreateProject()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loadingTemplateId, setLoadingTemplateId] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const filteredTemplates =
    selectedCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === selectedCategory)

  const handleUseTemplate = async (template: Template) => {
    if (!user) {
      router.push('/login')
      return
    }
    setLoadingTemplateId(template.id)
    try {
      const project = await createProject.mutateAsync({
        userId: user.id,
        project: {
          name: template.title,
          idea: template.idea,
          industry: template.industry,
          target_audience: template.targetAudience,
          tone: template.tone,
        },
      })
      toast.success(`Template applied — opening AI Studio`)
      router.push(`/studio?projectId=${project.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create project from template')
    } finally {
      setLoadingTemplateId(null)
    }
  }

  const handleCreateCustom = () => {
    router.push('/dashboard')
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
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Content Strategy Templates</h1>
            <p className="text-muted-foreground">
              Choose a pre-built template to instantly populate the AI Studio with a proven strategy framework.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-foreground text-background'
                    : 'border border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Templates Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredTemplates.map((template, i) => (
              <motion.div
                key={template.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-border bg-card hover:border-muted-foreground transition-all duration-300 hover:shadow-lg hover:shadow-black/50 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  {/* Icon and Category */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{template.icon}</div>
                    <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-semibold text-muted-foreground">
                      {template.category}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-semibold mb-2 group-hover:text-foreground transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {template.description}
                  </p>

                  {/* Meta */}
                  <div className="space-y-1 mb-4">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">Industry:</span> {template.industry}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">Tone:</span> {template.tone}
                    </p>
                  </div>

                  {/* Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => handleUseTemplate(template)}
                    disabled={loadingTemplateId === template.id || createProject.isPending}
                  >
                    {loadingTemplateId === template.id ? (
                      'Creating...'
                    ) : (
                      <>
                        Use Template <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Can&apos;t find what you need?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Describe any idea from scratch. Our AI builds a custom strategy tailored to your exact industry and audience.
            </p>
            <Button size="lg" className="gap-2" onClick={handleCreateCustom}>
              Create Custom Strategy <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
