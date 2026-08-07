import { ActivityEntry } from '../../types/activity'
import TimelineEntry from './TimelineEntry'

interface TimelineRailProps {
  groupedActivities: Record<string, ActivityEntry[]>
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onRemove: (id: string) => void
  onUpdateActionType: (id: string, actionType: string) => void
}

export default function TimelineRail({
  groupedActivities,
  expandedIds,
  onToggleExpand,
  onRemove,
  onUpdateActionType,
}: TimelineRailProps) {
  const dateGroups = Object.entries(groupedActivities)

  if (dateGroups.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Timeline vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      {/* Entries grouped by date */}
      <div className="pl-12 md:pl-20 md:pr-12">
        {dateGroups.map(([dateGroup, entries], groupIdx) => (
          <div key={dateGroup} className="mb-12">
            {/* Date Header */}
            <div className="mb-6 relative flex items-center">
              <div className="absolute -left-8 md:-left-16 w-8 md:w-16 h-px bg-border" />
              <h2 className="text-sm font-bold text-foreground bg-background px-4 py-1.5 rounded-full border border-border inline-block z-10 relative">
                {dateGroup}
              </h2>
            </div>

            {/* Entries for this date */}
            <div className="space-y-6">
              {entries.map((entry, entryIdx) => (
                <TimelineEntry
                  key={entry.id}
                  entry={entry}
                  isExpanded={expandedIds.has(entry.id)}
                  onToggle={() => onToggleExpand(entry.id)}
                  onRemove={() => onRemove(entry.id)}
                  onUpdateActionType={(actionType) => onUpdateActionType(entry.id, actionType)}
                  isFirst={groupIdx === 0 && entryIdx === 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* End of timeline message */}
      <div className="text-center py-12 mt-8 border-t border-border pt-8">
        <p className="text-muted-foreground text-sm">
          You&apos;ve reached the end of your timeline
        </p>
        <p className="text-xs text-muted-foreground mt-2">Start exploring more series to grow your collection</p>
      </div>
    </div>
  )
}
