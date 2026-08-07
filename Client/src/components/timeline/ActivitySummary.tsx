import { CheckCircle2, Flame, Clock } from 'lucide-react'
import { Card } from '../ui/card'

interface ActivitySummaryProps {
  stats: {
    completed: number
    streak: number
    hours: number
  }
}

export default function ActivitySummary({ stats }: ActivitySummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="bg-card border border-border p-6 hover:bg-opacity-80 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Completed This Month</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.completed}</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-success opacity-80" />
        </div>
      </Card>

      <Card className="bg-card border border-border p-6 hover:bg-opacity-80 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Current Streak</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.streak}</p>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
          </div>
          <Flame className="w-6 h-6 text-secondary opacity-80" />
        </div>
      </Card>
    </div>
  )
}
