import { ArrowRight, Trash2 } from 'lucide-react'
import type { Article } from '../../data/mockData'
import { motion } from 'framer-motion'

interface ArticlesListProps {
  articles: any[]
}

export default function ArticlesList({ articles }: ArticlesListProps) {
  if (articles.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center">
        <p className="text-foreground font-medium mb-2">No articles published yet.</p>
        <p className="text-sm text-muted-foreground">Share your expertise and help others discover new insights.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {articles.map((article, idx) => (
        <motion.div 
          key={article._id || article.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -2, x: 4 }}
          className="glass-panel rounded-2xl p-5 luxury-shadow transition-all duration-300 group cursor-pointer border border-border hover:border-primary/50"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold font-serif text-foreground group-hover:text-primary transition-colors pr-6 leading-tight">
              {article.title}
            </h3>
            <button className="text-muted-foreground hover:text-destructive transition-colors p-1 flex-shrink-0 -mt-1 -mr-1 opacity-0 group-hover:opacity-100">
              <Trash2 size={16} />
            </button>
          </div>

          <p className="text-foreground/80 text-sm mb-4 line-clamp-2">
            {article.body || article.excerpt || ''}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <div className="flex gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : article.date}</span>
              <span>•</span>
              <span>{article.readTime || `${Math.max(1, Math.ceil((article.body || article.excerpt || '').length / 500))} min read`}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowRight size={16} className="text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
