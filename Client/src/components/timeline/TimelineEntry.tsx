import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Heart, MessageSquare, Star, Inbox, Clock, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ActivityEntry } from '../../types/activity'

interface TimelineEntryProps {
  entry: ActivityEntry
  isExpanded: boolean
  onToggle: () => void
  onRemove: () => void
  onUpdateActionType: (actionType: string) => void
  isFirst?: boolean
}

export default function TimelineEntry({ entry, isExpanded, onToggle, onRemove, onUpdateActionType, isFirst = false }: TimelineEntryProps) {
  const navigate = useNavigate()
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
      <div className={`absolute -left-8 md:-left-16 ${!isFirst ? 'top-12 md:top-14' : 'top-6 md:top-8'} w-3 h-3 rounded-full border-2 border-background bg-primary transform -translate-x-1.5`} />

      {/* Entry Card */}
      <Card
        className="bg-card border border-border p-4 md:p-6 cursor-pointer hover:shadow-md transition-all max-w-4xl"
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-4 flex-1">
            {/* Thumbnail */}
            <img
              src={entry.coverUrl}
              alt={entry.seriesTitle}
              loading="lazy"
              className="w-12 h-16 md:w-14 md:h-20 object-cover rounded-md flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/series/${entry.seriesId}`)
              }}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3
                  className="text-sm md:text-base font-semibold text-foreground truncate hover:text-primary transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/series/${entry.seriesId}`)
                  }}
                >
                  {entry.seriesTitle}
                </h3>
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
                <span className="text-xs text-muted-foreground">
                  {entry.date instanceof Date ? entry.date.toLocaleDateString() : new Date(entry.date).toLocaleDateString()} {entry.time}
                </span>
              </div>

              {/* Media Type Badge */}
              <span className="text-xs text-muted-foreground capitalize mb-2 block">
                {entry.mediaType === 'light-novel' ? 'Light Novel' : entry.mediaType}
              </span>

              {/* Note */}
              {entry.note && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Your Note</p>
                  <p className="text-sm text-foreground bg-background/50 rounded-md p-2 italic">
                    "{entry.note}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row md:flex-col gap-2 justify-end md:justify-start pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-border md:pl-4">
            <Button
              size="sm"
              variant="outline"
              className="border-border hover:bg-background text-xs h-8"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/series/${entry.seriesId}`)
              }}
            >
              View Details
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border hover:bg-background text-xs h-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-card border-border">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUpdateActionType('started') }} className="cursor-pointer">
                  <Clock className="mr-2" size={16} />
                  Watching
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUpdateActionType('completed') }} className="cursor-pointer">
                  <CheckCircle className="mr-2" size={16} />
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              variant="destructive"
              className="border-border text-xs h-8"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
