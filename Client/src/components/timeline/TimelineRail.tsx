import { ActivityEntry } from '../../types/activity'
import TimelineEntry from './TimelineEntry'

interface TimelineRailProps {
  groupedActivities: Record<string, ActivityEntry[]>
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
}

export default function TimelineRail({
  groupedActivities,
  expandedIds,
  onToggleExpand,
}: TimelineRailProps) {
  const dateGroups = Object.entries(groupedActivities)

  if (dateGroups.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Timeline vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-1/2" />

      {/* Entries grouped by date */}
      <div className="pl-8 md:pl-0">
        {dateGroups.map(([dateGroup, entries], groupIdx) => (
          <div key={dateGroup} className="mb-12">
            {/* Date Header */}
            <div className="mb-8">
              <div className="relative inline-block md:absolute md:left-1/2 md:-translate-x-1/2 md:w-auto">
                <h2 className="text-lg font-bold text-foreground bg-background px-4 py-2 rounded-full border border-border inline-block">
                  {dateGroup}
                </h2>
              </div>
            </div>

            {/* Entries for this date */}
            <div className="space-y-6">
              {entries.map((entry, entryIdx) => (
                <TimelineEntry
                  key={entry.id}
                  entry={entry}
                  isExpanded={expandedIds.has(entry.id)}
                  onToggle={() => onToggleExpand(entry.id)}
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
