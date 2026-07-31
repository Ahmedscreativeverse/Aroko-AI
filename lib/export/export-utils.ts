import jsPDF from 'jspdf'

export type ExportFormat = 'pdf' | 'markdown' | 'json' | 'text'

export interface ContentData {
  creative_brief: string
  audience_analysis: string
  brand_voice: string
  marketing_strategy: string
  instagram_caption: string
  linkedin_post: string
  twitter_thread: string
  facebook_post: string
  call_to_action: string
  hashtags: string[]
  seo_keywords: string[]
  publishing_recommendations: string
}

export interface ExportOptions {
  projectName: string
  idea: string
  industry: string
  targetAudience: string
  tone: string
  generatedAt: Date
}

// Export to PDF
export function exportToPDF(content: ContentData, options: ExportOptions): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const maxWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Helper to add section with word wrapping
  const addSection = (title: string, content: string, isLast = false) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage()
      yPosition = margin
    }

    // Title
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, yPosition)
    yPosition += 8

    // Content
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(content, maxWidth)
    doc.text(lines, margin, yPosition)
    yPosition += lines.length * 5 + (isLast ? 0 : 5)
  }

  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('AI Content Generation Report', margin, yPosition)
  yPosition += 15

  // Project Info
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Project: ${options.projectName}`, margin, yPosition)
  yPosition += 5
  doc.text(`Idea: ${options.idea}`, margin, yPosition)
  yPosition += 5
  doc.text(`Generated: ${options.generatedAt.toLocaleString()}`, margin, yPosition)
  yPosition += 10

  // Content sections
  addSection('Creative Brief', content.creative_brief)
  addSection('Audience Analysis', content.audience_analysis)
  addSection('Brand Voice', content.brand_voice)
  addSection('Marketing Strategy', content.marketing_strategy)
  addSection('Instagram Caption', content.instagram_caption)
  addSection('LinkedIn Post', content.linkedin_post)
  addSection('Twitter Thread', content.twitter_thread)
  addSection('Facebook Post', content.facebook_post)
  addSection('Call to Action', content.call_to_action)
  addSection('Hashtags', content.hashtags.join(', '))
  addSection('SEO Keywords', content.seo_keywords.join(', '))
  addSection('Publishing Recommendations', content.publishing_recommendations, true)

  // Download
  doc.save(`${options.projectName}-content.pdf`)
}

// Export to Markdown
export function exportToMarkdown(content: ContentData, options: ExportOptions): void {
  let markdown = `# ${options.projectName} - AI Content Generation Report\n\n`
  markdown += `**Project Details:**\n`
  markdown += `- Idea: ${options.idea}\n`
  markdown += `- Industry: ${options.industry}\n`
  markdown += `- Target Audience: ${options.targetAudience}\n`
  markdown += `- Tone: ${options.tone}\n`
  markdown += `- Generated: ${options.generatedAt.toLocaleString()}\n\n`

  markdown += `## Creative Brief\n${content.creative_brief}\n\n`
  markdown += `## Audience Analysis\n${content.audience_analysis}\n\n`
  markdown += `## Brand Voice\n${content.brand_voice}\n\n`
  markdown += `## Marketing Strategy\n${content.marketing_strategy}\n\n`
  markdown += `## Social Media Content\n\n`
  markdown += `### Instagram Caption\n${content.instagram_caption}\n\n`
  markdown += `### LinkedIn Post\n${content.linkedin_post}\n\n`
  markdown += `### Twitter Thread\n${content.twitter_thread}\n\n`
  markdown += `### Facebook Post\n${content.facebook_post}\n\n`
  markdown += `## Call to Action\n${content.call_to_action}\n\n`
  markdown += `## Hashtags\n${content.hashtags.map(tag => `- ${tag}`).join('\n')}\n\n`
  markdown += `## SEO Keywords\n${content.seo_keywords.map(keyword => `- ${keyword}`).join('\n')}\n\n`
  markdown += `## Publishing Recommendations\n${content.publishing_recommendations}\n`

  downloadFile(markdown, `${options.projectName}-content.md`, 'text/markdown')
}

// Export to JSON
export function exportToJSON(content: ContentData, options: ExportOptions): void {
  const json = JSON.stringify(
    {
      project: options,
      content,
    },
    null,
    2
  )

  downloadFile(json, `${options.projectName}-content.json`, 'application/json')
}

// Export to plain text
export function exportToText(content: ContentData, options: ExportOptions): void {
  let text = `${options.projectName} - AI Content Generation Report\n`
  text += `${'='.repeat(50)}\n\n`
  text += `Project: ${options.projectName}\n`
  text += `Idea: ${options.idea}\n`
  text += `Industry: ${options.industry}\n`
  text += `Target Audience: ${options.targetAudience}\n`
  text += `Tone: ${options.tone}\n`
  text += `Generated: ${options.generatedAt.toLocaleString()}\n\n`

  text += `CREATIVE BRIEF\n${'='.repeat(20)}\n${content.creative_brief}\n\n`
  text += `AUDIENCE ANALYSIS\n${'='.repeat(20)}\n${content.audience_analysis}\n\n`
  text += `BRAND VOICE\n${'='.repeat(20)}\n${content.brand_voice}\n\n`
  text += `MARKETING STRATEGY\n${'='.repeat(20)}\n${content.marketing_strategy}\n\n`
  text += `INSTAGRAM CAPTION\n${'='.repeat(20)}\n${content.instagram_caption}\n\n`
  text += `LINKEDIN POST\n${'='.repeat(20)}\n${content.linkedin_post}\n\n`
  text += `TWITTER THREAD\n${'='.repeat(20)}\n${content.twitter_thread}\n\n`
  text += `FACEBOOK POST\n${'='.repeat(20)}\n${content.facebook_post}\n\n`
  text += `CALL TO ACTION\n${'='.repeat(20)}\n${content.call_to_action}\n\n`
  text += `HASHTAGS\n${'='.repeat(20)}\n${content.hashtags.join(', ')}\n\n`
  text += `SEO KEYWORDS\n${'='.repeat(20)}\n${content.seo_keywords.join(', ')}\n\n`
  text += `PUBLISHING RECOMMENDATIONS\n${'='.repeat(20)}\n${content.publishing_recommendations}\n`

  downloadFile(text, `${options.projectName}-content.txt`, 'text/plain')
}

// Generic file download helper
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Main export function
export function exportContent(
  format: ExportFormat,
  content: ContentData,
  options: ExportOptions
): void {
  switch (format) {
    case 'pdf':
      exportToPDF(content, options)
      break
    case 'markdown':
      exportToMarkdown(content, options)
      break
    case 'json':
      exportToJSON(content, options)
      break
    case 'text':
      exportToText(content, options)
      break
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    throw err
  }
}
