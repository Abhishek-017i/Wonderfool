import { motion } from 'framer-motion'

interface Achievement {
  icon: string
  label: string
}

interface AchievementsProps {
  achievements: Achievement[]
}

export default function Achievements({ achievements }: AchievementsProps) {
  if (achievements.length === 0) return null

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold font-cinzel text-foreground bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary w-fit">
        Milestones & Accolades
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex flex-col items-center justify-center p-4 text-center rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all shadow-sm group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {achievement.icon}
            </div>
            <div className="text-sm font-medium text-foreground text-balance">
              {achievement.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
