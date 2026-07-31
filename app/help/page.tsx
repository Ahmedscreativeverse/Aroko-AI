'use client'

export const dynamic = 'force-dynamic'

import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown, MessageSquare } from 'lucide-react'
import { useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

export default function HelpPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'How do I create my first project?',
      answer:
        'To create your first project, navigate to the Projects page and click "New Project". Fill in your idea, select your industry, target audience, and desired platforms. Our AI will then generate a complete content strategy for you.',
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'What information should I provide for best results?',
      answer:
        'Be as detailed as possible about your creative idea, target audience, and brand tone. Include specific goals and platforms you want to focus on. The more context you provide, the more tailored and accurate your generated content will be.',
    },
    {
      id: 3,
      category: 'Features',
      question: 'Can I edit the generated content?',
      answer:
        'Yes! All generated content can be edited directly in the results view. You can modify any section by clicking the Edit button, and you can regenerate specific sections if needed.',
    },
    {
      id: 4,
      category: 'Features',
      question: 'What formats can I export to?',
      answer:
        'You can export your complete content strategy in PDF, DOCX, Markdown, or Text formats. Simply click the Export button and select your preferred format.',
    },
    {
      id: 5,
      category: 'Pricing',
      question: 'Is there a free trial?',
      answer:
        'Yes, you can start with our free plan which includes 3 projects per month. For unlimited projects and advanced features, upgrade to our Pro plan.',
    },
    {
      id: 6,
      category: 'Pricing',
      question: 'Can I cancel my subscription anytime?',
      answer:
        'Absolutely. You can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period.',
    },
    {
      id: 7,
      category: 'Account',
      question: 'How do I change my password?',
      answer:
        'Go to Settings > Security and click "Change Password". Enter your current password and your new password, then confirm. Your new password will be active immediately.',
    },
    {
      id: 8,
      category: 'Account',
      question: 'Can I have multiple workspaces?',
      answer:
        'Currently, each account has one workspace. However, you can invite team members to collaborate within your workspace using the Teams feature.',
    },
  ]

  const categories = ['All', ...new Set(faqs.map((faq) => faq.category))]
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFAQs =
    selectedCategory === 'All' ? faqs : faqs.filter((faq) => faq.category === selectedCategory)

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-muted-foreground mb-6">
              Find answers to your questions about Aroko AI
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for help..."
                className="pl-10 bg-card"
              />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {[
              { icon: '📚', title: 'Documentation', description: 'Read our guides' },
              { icon: '🎥', title: 'Video Tutorials', description: 'Learn by watching' },
              { icon: '💬', title: 'Contact Support', description: 'Get in touch' },
            ].map((link, i) => (
              <motion.button
                key={i}
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl border border-border bg-card hover:border-muted-foreground transition-all duration-300 hover:shadow-lg hover:shadow-black/50 text-left"
              >
                <span className="text-3xl mb-3 block">{link.icon}</span>
                <h3 className="font-semibold mb-1">{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </motion.button>
            ))}
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-foreground text-background'
                      : 'border border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFAQs.map((faq, i) => (
                <motion.div
                  key={faq.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === faq.id ? null : faq.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <span className="font-medium text-left">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border"
                    >
                      <p className="px-6 py-4 text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 rounded-xl border border-border bg-card p-8 text-center"
          >
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help. Reach out anytime, we typically respond within 1 hour.
            </p>
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Support
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
