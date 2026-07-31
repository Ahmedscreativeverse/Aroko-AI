'use client'

export const dynamic = 'force-dynamic'

import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'

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
  uses: number
}

export default function TemplatesPage() {
  const templates: Template[] = [
    {
      id: 1,
      title: 'Product Launch Campaign',
      description: 'Complete strategy for launching a new product with audience analysis, content calendar, and more',
      category: 'Product',
      icon: '🚀',
      uses: 1204,
    },
    {
      id: 2,
      title: 'Podcast Launch Strategy',
      description: 'Audio content strategy including branding, episode planning, and promotional content',
      category: 'Media',
      icon: '🎙️',
      uses: 892,
    },
    {
      id: 3,
      title: 'Personal Branding',
      description: 'Build your personal brand across all platforms with consistent messaging and visuals',
      category: 'Personal',
      icon: '👤',
      uses: 756,
    },
    {
      id: 4,
      title: 'E-commerce Campaign',
      description: 'Seasonal or ongoing e-commerce marketing strategy with product positioning and promotions',
      category: 'E-commerce',
      icon: '🛍️',
      uses: 1523,
    },
    {
      id: 5,
      title: 'SaaS Marketing',
      description: 'B2B SaaS go-to-market strategy with thought leadership and sales enablement content',
      category: 'B2B',
      icon: '💼',
      uses: 945,
    },
    {
      id: 6,
      title: 'Content Creator Kit',
      description: 'Everything a content creator needs: posting schedule, caption ideas, and growth strategies',
      category: 'Creator',
      icon: '📸',
      uses: 2104,
    },
    {
      id: 7,
      title: 'Local Business Growth',
      description: 'Community-focused marketing strategy for restaurants, salons, and local services',
      category: 'Local',
      icon: '🏪',
      uses: 634,
    },
    {
      id: 8,
      title: 'Event Promotion',
      description: 'Multi-channel event marketing with ticket sales, awareness, and attendee engagement',
      category: 'Events',
      icon: '🎉',
      uses: 1087,
    },
  ]

  const categories = ['All', 'Product', 'Media', 'Personal', 'E-commerce', 'B2B', 'Creator', 'Local', 'Events']

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
              Choose from pre-built templates or create your own custom strategy
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
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  category === 'All'
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
            {templates.map((template, i) => (
              <motion.div
                key={template.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-border bg-card hover:border-muted-foreground transition-all duration-300 hover:shadow-lg hover:shadow-black/50 overflow-hidden"
              >
                <div className="p-6">
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
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Usage Count */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <Zap className="h-3 w-3" />
                    <span>{template.uses.toLocaleString()} people used this</span>
                  </div>

                  {/* Button */}
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    Use Template <ArrowRight className="h-3 w-3" />
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
              Our AI can create a custom content strategy for any industry or use case. Just describe your idea.
            </p>
            <Button size="lg" className="gap-2">
              Create Custom Strategy <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
