import { Calendar, Briefcase, UserRound, Globe } from 'lucide-react'

interface CreatorInfoProps {
  activeYears: { start: number; end: number | 'present' }
  studios: string[]
  roles: string[]
  socials: { platform: string; url: string }[]
}

export default function CreatorInfo({
  activeYears,
  studios,
  roles,
  socials,
}: CreatorInfoProps) {
  const infoItems = [
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      label: 'Active Years',
      value: `${activeYears.start} – ${
        activeYears.end === 'present' ? 'Present' : activeYears.end
      }`,
    },
    {
      icon: <Briefcase className="w-5 h-5 text-primary" />,
      label: 'Studios',
      value: studios.join(', '),
    },
    {
      icon: <UserRound className="w-5 h-5 text-primary" />,
      label: 'Roles',
      value: roles.join(', '),
    },
    {
      icon: <Globe className="w-5 h-5 text-primary" />,
      label: 'Links',
      value: socials.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {socials.map(social => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent hover:underline transition-colors"
            >
              {social.platform}
            </a>
          ))}
        </div>
      ) : (
        'None'
      ),
    },
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {infoItems.map((item, index) => (
        <div
          key={index}
          className="p-5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              {item.icon}
            </div>
            <h3 className="text-sm font-semibold font-cinzel text-muted-foreground uppercase tracking-wider">
              {item.label}
            </h3>
          </div>
          <div className="text-foreground font-medium pl-1">
            {item.value}
          </div>
        </div>
      ))}
    </section>
  )
}
