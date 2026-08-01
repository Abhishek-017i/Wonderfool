'use client'

import { useState, useCallback } from 'react'
import EditorHeader from '@/components/article-editor/EditorHeader'
import CoverImageUpload from '@/components/article-editor/CoverImageUpload'
import ArticleTitle from '@/components/article-editor/ArticleTitle'
import ArticleBody from '@/components/article-editor/ArticleBody'
import CreatorTagging from '@/components/article-editor/CreatorTagging'
import SeriesTagging from '@/components/article-editor/SeriesTagging'
import ArticleSettings from '@/components/article-editor/ArticleSettings'
import LivePreview from '@/components/article-editor/LivePreview'
import PublishSection from '@/components/article-editor/PublishSection'
import SaveIndicator from '@/components/article-editor/SaveIndicator'

export default function WritePage() {
  const [article, setArticle] = useState({
    title: '',
    body: '',
    coverImage: null,
    description: '',
    tags: [],
    creator: null,
    series: null,
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [showPreview, setShowPreview] = useState(false)

  // Auto-save handler
  const handleAutoSave = useCallback(() => {
    setSaveStatus('saving')
    // Simulate API call
    const timer = setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Debounced auto-save
  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      setArticle(prev => ({ ...prev, [field]: value, updatedAt: new Date() }))
      handleAutoSave()
    },
    [handleAutoSave]
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorHeader onPreviewToggle={() => setShowPreview(!showPreview)} />
      
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
        {/* Main Editor */}
        <div className="flex-1 min-w-0">
          <div className="space-y-6">
            {/* Cover Image */}
            <CoverImageUpload
              coverImage={article.coverImage}
              onChange={(image) => handleFieldChange('coverImage', image)}
            />

            {/* Title */}
            <ArticleTitle
              value={article.title}
              onChange={(title) => handleFieldChange('title', title)}
            />

            {/* Body */}
            <ArticleBody
              value={article.body}
              onChange={(body) => handleFieldChange('body', body)}
            />

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <CreatorTagging
                creator={article.creator}
                onChange={(creator) => handleFieldChange('creator', creator)}
              />
              <SeriesTagging
                series={article.series}
                onChange={(series) => handleFieldChange('series', series)}
              />
            </div>

            {/* Article Settings */}
            <ArticleSettings
              description={article.description}
              tags={article.tags}
              onDescriptionChange={(desc) => handleFieldChange('description', desc)}
              onTagsChange={(tags) => handleFieldChange('tags', tags)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Save Indicator */}
          <SaveIndicator status={saveStatus} />

          {/* Live Preview */}
          {showPreview && (
            <div className="sticky top-8">
              <LivePreview article={article} />
            </div>
          )}

          {/* Publish Section */}
          <PublishSection article={article} />
        </div>
      </div>
    </div>
  )
}
