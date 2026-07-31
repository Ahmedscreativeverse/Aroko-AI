'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: ProjectFormData) => void
}

export interface ProjectFormData {
  projectName: string
  idea: string
  industry: string
  targetAudience: string
  tone: string
  platforms: string[]
}

const industries = [
  'Fashion',
  'Tech',
  'Finance',
  'Health',
  'Education',
  'Media',
  'Retail',
  'Food',
]

const tones = [
  'Professional',
  'Casual',
  'Creative',
  'Playful',
  'Educational',
  'Inspirational',
]

const platforms = [
  'Instagram',
  'LinkedIn',
  'Twitter',
  'TikTok',
  'YouTube',
  'Facebook',
]

export function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    idea: '',
    industry: '',
    targetAudience: '',
    tone: '',
    platforms: [],
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      projectName: '',
      idea: '',
      industry: '',
      targetAudience: '',
      tone: '',
      platforms: [],
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <button
                  onClick={handleClose}
                  className="rounded-md p-2 hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Project Name
                  </label>
                  <Input
                    name="projectName"
                    placeholder="e.g., Summer Campaign 2024"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Idea Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Describe Your Idea
                  </label>
                  <textarea
                    name="idea"
                    placeholder="Describe your creative idea in detail..."
                    value={formData.idea}
                    onChange={handleInputChange}
                    className="w-full min-h-24 rounded-lg border border-border bg-secondary px-4 py-3 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  >
                    <option value="">Select an industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Target Audience
                  </label>
                  <Input
                    name="targetAudience"
                    placeholder="e.g., Young professionals aged 25-35"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Brand Tone
                  </label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  >
                    <option value="">Select a tone</option>
                    {tones.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Target Platforms
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => togglePlatform(platform)}
                        className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                          formData.platforms.includes(platform)
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border hover:border-muted-foreground text-muted-foreground'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.projectName || !formData.idea}
                    className="flex-1"
                  >
                    Create Project
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
