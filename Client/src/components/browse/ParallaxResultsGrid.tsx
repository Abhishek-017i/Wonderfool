import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import SeriesCard from '@/components/browse/SeriesCard'
import type { Series } from '@/types/series'

interface ParallaxResultsGridProps {
  seriesData: Series[]
  viewMode: 'grid' | 'compact' | 'list'
}

export default function ParallaxResultsGrid({ seriesData, viewMode }: ParallaxResultsGridProps) {
  const [columnsCount, setColumnsCount] = useState(5)
  const [isMobile, setIsMobile] = useState(false)

  // Use window scroll directly so parallax continues across the whole page seamlessly
  const { scrollY } = useScroll()

  // Determine columns and mobile state
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768) // Disable parallax below md

      if (viewMode === 'compact') {
        if (width >= 1280) setColumnsCount(6)
        else if (width >= 1024) setColumnsCount(5)
        else if (width >= 640) setColumnsCount(4)
        else setColumnsCount(3)
      } else {
        // Grid mode
        if (width >= 1280) setColumnsCount(5)
        else if (width >= 1024) setColumnsCount(4)
        else if (width >= 640) setColumnsCount(3)
        else setColumnsCount(2)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [viewMode])

  // Distribute items into columns round-robin to preserve sort left-to-right, top-to-bottom
  const columns: Series[][] = Array.from({ length: columnsCount }, () => [])
  seriesData.forEach((item, i) => {
    columns[i % columnsCount].push(item)
  })

  return (
    <div className="flex items-start gap-4">
      {columns.map((colData, colIndex) => (
        <ParallaxColumn
          key={colIndex}
          colData={colData}
          colIndex={colIndex}
          columnsCount={columnsCount}
          viewMode={viewMode}
          isMobile={isMobile}
          scrollY={scrollY}
        />
      ))}
    </div>
  )
}

interface ParallaxColumnProps {
  colData: Series[]
  colIndex: number
  columnsCount: number
  viewMode: 'grid' | 'compact' | 'list'
  isMobile: boolean
  scrollY: MotionValue<number>
}

function ParallaxColumn({ colData, colIndex, columnsCount, viewMode, isMobile, scrollY }: ParallaxColumnProps) {
  // Checkerboard pattern: 
  // Even-indexed columns (0, 2, 4) move at base speed (1.0x).
  // Odd-indexed columns (1, 3, 5) move at a faster speed (1.35x).
  const multiplier = colIndex % 2 === 0 ? 1.0 : 1.35
  
  // Base parallax speed
  const baseSpeed = -0.05

  // Apply useTransform inside a dedicated component instance.
  // This guarantees each column gets its own independent hook state.
  const y = useTransform(scrollY, (val) => isMobile ? 0 : val * baseSpeed * multiplier)

  return (
    <motion.div
      style={{ y }}
      className="flex-1 flex flex-col gap-4"
    >
      {colData.map((series, i) => (
        <SeriesCard
          key={series._id}
          series={series}
          variant={viewMode === 'list' ? 'list' : viewMode}
          index={i * columnsCount + colIndex}
        />
      ))}
    </motion.div>
  )
}
