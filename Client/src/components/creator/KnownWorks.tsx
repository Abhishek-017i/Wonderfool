import { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import SeriesCard from '../browse/SeriesCard'
import EmptyState from '../browse/EmptyState'

interface KnownWorksProps {
  works: {
    id: string
    title: string
    coverUrl: string
    rating: number
    year: number
    genres: string[]
    role: string
  }[]
}

const ITEMS_PER_PAGE = 12

export default function KnownWorks({ works }: KnownWorksProps) {
  const [selectedRole, setSelectedRole] = useState('All')
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)

  const uniqueRoles = useMemo(() => {
    const roles = new Set(works.map(w => w.role).filter(Boolean))
    return ['All', ...Array.from(roles)]
  }, [works])

  const filteredWorks = useMemo(() => {
    if (selectedRole === 'All') return works
    return works.filter(w => w.role === selectedRole)
  }, [works, selectedRole])

  const displayedWorks = filteredWorks.slice(0, displayCount)
  const hasMore = displayCount < filteredWorks.length

  const renderWorksCarousel = (worksToRender: typeof displayedWorks) => {
    return (
      <div className="w-full relative">
        <div className="flex gap-4 pb-6 overflow-x-auto scrollbar-hide snap-x px-1">
          {worksToRender.map(work => (
            <div key={work.id} className="w-[160px] sm:w-[200px] flex-shrink-0 snap-start">
              <SeriesCard 
                series={{
                  id: work.id,
                  title: work.title,
                  cover: work.coverUrl, // Map coverUrl to cover
                  rating: work.rating,
                  status: work.role, // Use role as status badge for creator page
                  type: work.genres[0] || 'Unknown', // Use first genre as type
                  year: work.year,
                  synopsis: '',
                  genres: work.genres,
                  chapters: 0
                }}
                viewMode="grid"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (works.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold font-cinzel text-foreground bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary w-fit">
          Known Works
        </h2>
        <EmptyState
          title="No works found"
          message="Nothing here yet. Even I find that a little surprising."
        />
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold font-cinzel text-foreground bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary w-fit">
        Known Works
      </h2>

      {uniqueRoles.length > 1 && (
        <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
          <TabsList className="w-full sm:w-auto flex overflow-x-auto scrollbar-hide justify-start mb-6 p-1 bg-card rounded-xl">
            {uniqueRoles.map(role => (
              <TabsTrigger key={role} value={role} className="text-sm font-semibold tracking-wide">
                {role}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {uniqueRoles.map(role => (
            <TabsContent key={role} value={role} className="mt-2 outline-none">
              {displayedWorks.length > 0 ? (
                <div className="space-y-6">
                  {renderWorksCarousel(displayedWorks)}

                  {hasMore && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={() => setDisplayCount(prev => prev + ITEMS_PER_PAGE)}
                        variant="outline"
                        className="w-full sm:w-64 border-primary/50 hover:bg-primary/10 text-primary transition-all font-cinzel tracking-wider"
                      >
                        Load More Works
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState
                  title="No works in this category"
                  message="Nothing here yet. Even I find that a little surprising."
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {uniqueRoles.length === 1 && (
        <div className="space-y-6">
          {renderWorksCarousel(displayedWorks)}

          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setDisplayCount(prev => prev + ITEMS_PER_PAGE)}
                variant="outline"
                className="w-full sm:w-64 border-primary/50 hover:bg-primary/10 text-primary transition-all font-cinzel tracking-wider"
              >
                Load More Works
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
