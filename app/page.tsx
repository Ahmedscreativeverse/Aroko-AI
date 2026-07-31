'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Brain, Zap, FileText, Hash, TrendingUp, Calendar, Download } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Aroko<span className="text-xs font-normal opacity-75"> AI</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/signup">
              <Button variant="default" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              One Idea.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-muted to-foreground">
                Infinite Content.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform one creative idea into a complete AI-generated content production package. Strategy, captions, posts, calendars, and more—all powered by IBM Granite.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start Creating <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                See Features
              </Button>
            </Link>
          </motion.div>

          {/* AI Pipeline Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-24 bg-card border border-border rounded-xl p-8 md:p-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Pipeline</div>
              <div className="h-0.5 flex-1 mx-4 bg-gradient-to-r from-border via-muted to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-2">
              {['Idea', 'Research', 'Strategy', 'Content', 'Publishing', 'Export'].map((stage, i) => (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="h-12 w-12 rounded-lg bg-secondary border border-border flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{stage}</p>
                  {i < 5 && (
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                      className="text-muted-foreground text-xs mt-1 md:hidden"
                    >
                      ↓
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to create a complete content strategy in minutes, not hours.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Brain,
                title: 'AI Brief Generator',
                description: 'Automatically generate creative briefs from your core idea',
              },
              {
                icon: TrendingUp,
                title: 'Creative Strategy',
                description: 'AI-powered strategy tailored to your target audience',
              },
              {
                icon: Zap,
                title: 'Content Generator',
                description: 'Generate compelling content across all platforms',
              },
              {
                icon: FileText,
                title: 'Caption Writer',
                description: 'Platform-specific captions optimized for engagement',
              },
              {
                icon: Hash,
                title: 'Hashtag Generator',
                description: 'Trending hashtags selected for your content',
              },
              {
                icon: TrendingUp,
                title: 'SEO Optimizer',
                description: 'Keywords and meta descriptions for search visibility',
              },
              {
                icon: Calendar,
                title: 'Content Calendar',
                description: 'Weekly content schedule organized by platform',
              },
              {
                icon: Download,
                title: 'Export Toolkit',
                description: 'Download in PDF, DOCX, Markdown, or Text format',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group p-6 rounded-xl border border-border bg-card hover:border-muted-foreground transition-all duration-300 hover:shadow-lg hover:shadow-black/50"
              >
                <feature.icon className="h-8 w-8 mb-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Aroko Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Aroko AI?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <h3 className="text-lg font-semibold mb-2">Traditional Workflow</h3>
              <div className="flex items-baseline gap-3 mt-6">
                <span className="text-4xl font-bold">Hours</span>
                <span className="text-muted-foreground">to create one campaign</span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Manual research, strategy, writing, and calendar planning across multiple tools.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <h3 className="text-lg font-semibold mb-2">Aroko AI</h3>
              <div className="flex items-baseline gap-3 mt-6">
                <span className="text-4xl font-bold">Minutes</span>
                <span className="text-muted-foreground">with AI precision</span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                One idea. Complete content production package. Powered by IBM Granite.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-12">Loved by Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Content Creator',
                quote: 'Aroko AI saved me 10 hours a week. The content quality is incredible.',
              },
              {
                name: 'Marcus Johnson',
                role: 'Marketing Manager',
                quote: 'Our team went from scattered tools to one unified creative platform.',
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-8 text-left"
              >
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Create?</h2>
            <p className="text-muted-foreground mb-8">
              Join creators transforming ideas into complete content campaigns.
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <p>Aroko AI | Powered by IBM Granite</p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  )
}
