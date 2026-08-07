import { Card } from './ui/card'
import { Badge } from './ui/badge'

interface CreatorCardProps {
  id: string
  name: string
  avatarUrl: string
  role: string
}

export function CreatorCard({
  name,
  avatarUrl,
  role,
}: CreatorCardProps) {
  return (
    <Card className="p-4 bg-card hover:shadow-lg transition-shadow flex items-center gap-3 min-w-[240px]">
      <img
        src={avatarUrl}
        alt={name}
        loading="lazy"
        className="w-12 h-12 rounded-full flex-shrink-0"
      />
      <div className="flex flex-col gap-1 flex-1">
        <p className="font-semibold text-sm text-card-foreground truncate">
          {name}
        </p>
        <Badge variant="secondary" className="text-xs w-fit">
          {role}
        </Badge>
      </div>
    </Card>
  )
}
