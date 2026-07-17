import { useNavigate } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import { Button } from '../ui/button'

export default function EmptyState() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Inbox className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No activities found</h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md">
          Your timeline appears to be empty. Start exploring and tracking your anime, manga, and light novel
          journey to see your activities here.
        </p>
        <Button
          onClick={() => navigate('/series')}
          className="bg-primary hover:bg-primary/90 text-background"
        >
          Browse Series
        </Button>
      </div>
    </div>
  )
}
