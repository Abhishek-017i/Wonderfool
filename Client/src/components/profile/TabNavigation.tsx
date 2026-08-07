import { motion } from 'framer-motion'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'My Reviews' },
    { id: 'articles', label: 'My Articles' },
    { id: 'timeline', label: 'My Timeline' },
    { id: 'wishlist', label: 'My Wishlist' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="border-b border-border mb-8 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 sm:gap-6 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-4 text-sm font-semibold transition-colors duration-200 outline-none ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              
              {isActive && (
                <motion.div
                  layoutId="activeProfileTab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
