import { motion } from 'framer-motion'

export default function LuxuryBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base noise texture overlay (requires a global CSS utility or inline SVG, we'll use a very subtle CSS mix-blend) */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Blurred Gold blobs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#d4af37] rounded-full blur-[120px] mix-blend-screen"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
        className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#f9db79] rounded-full blur-[150px] mix-blend-screen"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 4, ease: "linear" }}
        className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-white rounded-full blur-[100px] mix-blend-screen"
      />
    </div>
  )
}
