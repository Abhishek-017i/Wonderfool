import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Heart, MessageSquare, Star, Inbox } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { ActivityEntry } from '../../types/activity'

interface TimelineEntryProps {
  entry: ActivityEntry
  isExpanded: boolean
  onToggle: () => void
  isFirst?: boolean
}

export default function TimelineEntry({ entry, isExpanded, onToggle, isFirst = false }: TimelineEntryProps) {
  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'completed':
        return 'text-success bg-success/10'
      case 'started':
        return 'text-primary bg-primary/10'
      case 'rated':
        return 'text-secondary bg-secondary/10'
      case 'reviewed':
        return 'text-accent bg-accent/10'
      case 'added_note':
        return 'text-blue-500 bg-blue-500/10'
      default:
        return 'text-muted-foreground bg-muted-foreground/10'
    }
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'completed':
        return <Inbox className="w-4 h-4" />
      case 'started':
        return <Inbox className="w-4 h-4" />
      case 'rated':
        return <Star className="w-4 h-4" />
      case 'reviewed':
        return <MessageSquare className="w-4 h-4" />
      case 'added_note':
        return <Heart className="w-4 h-4" />
      default:
        return <Inbox className="w-4 h-4" />
    }
  }

  return (
    <div className={`relative ${!isFirst ? 'pt-6' : 'pt-0'}`}>
      {/* Dot on timeline */}
      <div className="absolute left-0 top-0 w-3 h-3 rounded-full border-2 border-background bg-primary transform -translate-x-1.5 md:left-1/2 md:-translate-x-1/2" />

      {/* Entry Card */}
      <Card
        className="bg-card border border-border p-4 md:p-6 cursor-pointer hover:shadow-md transition-all"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        aria-expanded={isExpanded}
      >
        {/* Compact View */}
        <div className="flex gap-4">
          {/* Thumbnail */}
          <img
            src={entry.coverUrl}
            alt={entry.seriesTitle}
            loading="lazy"
            className="w-12 h-16 md:w-14 md:h-20 object-cover rounded-md flex-shrink-0"
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm md:text-base font-semibold text-foreground truncate">
                {entry.seriesTitle}
              </h3>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Action Label */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getActionColor(
                  entry.actionType
                )}`}
              >
                {getActionIcon(entry.actionType)}
                {entry.actionLabel}
              </div>
              <span className="text-xs text-muted-foreground">{entry.time}</span>
            </div>

            {/* Progress */}
            {entry.progress && (
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium">
                    {entry.progress.current}/{entry.progress.total}
                  </span>
                </div>
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${(entry.progress.current / entry.progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Media Type Badge */}
            <span className="text-xs text-muted-foreground capitalize">
              {entry.mediaType === 'light-novel' ? 'Light Novel' : entry.mediaType}
            </span>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div
            className="mt-4 pt-4 border-t border-border space-y-4 animate-in fade-in-50 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Note */}
            {entry.note && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Your Note</p>
                <p className="text-sm text-foreground bg-background/50 rounded-md p-3 italic">
                  "{entry.note}"
                </p>
              </div>
            )}

            {/* Full Progress */}
            {entry.progress && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium text-muted-foreground">Progress</p>
                  <p className="text-sm font-semibold text-primary">
                    {Math.round((entry.progress.current / entry.progress.total) * 100)}%
                  </p>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${(entry.progress.current / entry.progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Link to={`/series/${entry.seriesId}`} className="flex-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-border hover:bg-background"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-border hover:bg-background"
                onClick={(e) => e.stopPropagation()}
              >
                Edit Entry
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
