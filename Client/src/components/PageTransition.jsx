import { motion } from 'framer-motion'

const maskHidden = "linear-gradient(to right, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 60%)"
const maskVisible = "linear-gradient(to right, rgba(0,0,0,0) -20%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%, rgba(0,0,0,0) 120%)"

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ 
        WebkitMaskImage: maskHidden,
        maskImage: maskHidden,
        opacity: 0 
      }}
      animate={{ 
        WebkitMaskImage: maskVisible,
        maskImage: maskVisible,
        opacity: 1 
      }}
      exit={{ 
        WebkitMaskImage: maskHidden,
        maskImage: maskHidden,
        opacity: 0 
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  )
}
