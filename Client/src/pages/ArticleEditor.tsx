'use client'

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import EditorHeader from '@/components/article-editor/EditorHeader'
import CoverImageUpload from '@/components/article-editor/CoverImageUpload'
import ArticleTitle from '@/components/article-editor/ArticleTitle'
import ArticleBody from '@/components/article-editor/ArticleBody'
import CreatorTagging from '@/components/article-editor/CreatorTagging'
import LivePreview from '@/components/article-editor/LivePreview'
import PublishSection from '@/components/article-editor/PublishSection'

export default function WritePage() {
  const [article, setArticle] = useState({
    title: '',
    body: '',
    coverImage: null,
    creators: [],
    series: null,
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const [showPreview, setShowPreview] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const navigate = useNavigate()

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const user = useAuthStore.getState().user
      const payload = {
        title: article.title,
        body: article.body,
        coverImage: article.coverImage,
        taggedCreators: article.creators.map((c: any) => c.id),
        authorId: user?._id || user?.id,
        status: 'published'
      }
      
      const res = await api.post('/articles', payload)
      // Redirect to the new article page
      navigate(`/articles/${res.data._id}`)
    } catch (err) {
      console.error('Failed to publish article:', err)
      alert('Failed to publish article. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      setArticle(prev => ({ ...prev, [field]: value, updatedAt: new Date() }))
    },
    []
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

            <div className="pt-4">
              <CreatorTagging
                creators={article.creators}
                onChange={(creators) => handleFieldChange('creators', creators)}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">

          {/* Live Preview */}
          {showPreview && (
            <div className="sticky top-8">
              <LivePreview article={article} />
            </div>
          )}

          {/* Publish Section */}
          <PublishSection 
            article={article} 
            onPublish={handlePublish}
            isLoading={isPublishing}
          />
        </div>
      </div>
    </div>
  )
}
