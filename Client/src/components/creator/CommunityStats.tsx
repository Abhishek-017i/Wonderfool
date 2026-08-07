import { Users, Star, BookOpen } from 'lucide-react'

interface CommunityStatsProps {
  followers: number
  avgRating: number
  totalWorks: number
}

export default function CommunityStats({
  followers,
  avgRating,
  totalWorks,
}: CommunityStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const statItems = [
    {
      label: 'Followers',
      value: formatNumber(followers),
      icon: <Users className="w-5 h-5 text-primary" />,
    },
    {
      label: 'Avg Rating',
      value: avgRating.toFixed(1),
      icon: <Star className="w-5 h-5 fill-primary text-primary" />,
    },
    {
      label: 'Total Works',
      value: totalWorks.toString(),
      icon: <BookOpen className="w-5 h-5 text-primary" />,
    },
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-card to-card/50 border border-border/50 shadow-sm hover:border-primary/30 transition-colors"
        >
          <div className="mb-3 p-3 rounded-full bg-primary/10">
            {stat.icon}
          </div>
          <div className="text-3xl font-bold font-cinzel text-foreground mb-1">
            {stat.value}
          </div>
          <div className="text-sm font-semibold font-cinzel text-muted-foreground uppercase tracking-widest">
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  )
}
