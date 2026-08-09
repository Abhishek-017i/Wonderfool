import { motion } from 'framer-motion'

interface SpellLoaderProps {
  size?: number
  className?: string
}

export default function SpellLoader({ size = 80, className = '' }: SpellLoaderProps) {
  return (
    <div 
      className={`relative text-primary flex items-center justify-center ${className}`} 
      style={{ width: size, height: size, filter: 'drop-shadow(0 0 6px var(--primary))' }}
    >
      <svg width={size} height={size} viewBox="0 0 280 280" className="opacity-90">
        {/* Outer thin bounding ring */}
        <circle cx="140" cy="140" r="120" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        
        {/* Middle intricate runic ring */}
        <motion.circle 
          cx="140" cy="140" r="105" fill="none" stroke="currentColor" strokeWidth="1.5" 
          strokeDasharray="4 8 16 8 4 32" 
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ originX: "140px", originY: "140px" }}
        />
        
        {/* Inner counter-rotating dashed ring */}
        <motion.circle 
          cx="140" cy="140" r="95" fill="none" stroke="currentColor" strokeWidth="1" 
          strokeDasharray="2 4 2 12" 
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ originX: "140px", originY: "140px" }}
          opacity="0.6"
        />
        
        {/* Inner geometric accent (8-pointed star/diamond hybrid) */}
        <path d="M140 50 L155 125 L230 140 L155 155 L140 230 L125 155 L50 140 L125 125 Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <path d="M95 95 L140 120 L185 95 L160 140 L185 185 L140 160 L95 185 L120 140 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        
        {/* Center solid core and inner ring */}
        <circle cx="140" cy="140" r="25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />
        <circle cx="140" cy="140" r="10" fill="currentColor" opacity="0.9" />
      </svg>
      
      {/* Drifting particles orbiting the sigil */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-[10%] left-[50%] w-1 h-1 rounded-full bg-primary" style={{ filter: 'blur(0.5px)', boxShadow: '0 0 4px var(--primary)' }} />
        <div className="absolute bottom-[20%] right-[20%] w-1.5 h-1.5 rounded-full bg-primary" style={{ filter: 'blur(0.5px)', boxShadow: '0 0 4px var(--primary)' }} />
        <div className="absolute top-[30%] left-[20%] w-0.5 h-0.5 rounded-full bg-primary" style={{ filter: 'blur(0.5px)', boxShadow: '0 0 4px var(--primary)' }} />
        <div className="absolute bottom-[40%] left-[10%] w-1 h-1 rounded-full bg-primary" style={{ filter: 'blur(0.5px)', boxShadow: '0 0 4px var(--primary)' }} />
      </motion.div>
    </div>
  )
}
