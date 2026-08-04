import { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import SeriesCard from '../browse/SeriesCard'
import EmptyState from '../browse/EmptyState'

interface KnownWorksProps {
  works: {
    seriesId: any
    designation?: string
  }[]
}

const ITEMS_PER_PAGE = 12

export default function KnownWorks({ works }: KnownWorksProps) {
  const [selectedRole, setSelectedRole] = useState('All')
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)

  const validWorks = useMemo(() => {
    return works.filter(w => w.seriesId && w.seriesId._id)
  }, [works])

  const uniqueRoles = useMemo(() => {
    const roles = new Set(validWorks.map(w => w.designation || 'Staff'))
    return ['All', ...Array.from(roles)]
  }, [validWorks])

  const filteredWorks = useMemo(() => {
    if (selectedRole === 'All') return validWorks
    return validWorks.filter(w => (w.designation || 'Staff') === selectedRole)
  }, [validWorks, selectedRole])

  const displayedWorks = filteredWorks.slice(0, displayCount)
  const hasMore = displayCount < filteredWorks.length

  const renderWorksCarousel = (worksToRender: typeof displayedWorks) => {
    return (
      <div className="w-full relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {worksToRender.map((work, idx) => {
            const series = work.seriesId
            const title = series.title?.english || series.title?.romaji || series.title?.native || 'Unknown'
            return (
              <div key={`${series._id}-${idx}`} className="w-full">
                <SeriesCard 
                  series={{
                    ...series,
                    status: work.designation || 'Staff',
                  }}
                  viewMode="grid"
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (validWorks.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold font-cinzel text-foreground drop-shadow-sm">
        Known Works
      </h2>

      {uniqueRoles.length > 1 && (
        <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
          <TabsList className="w-full sm:w-auto flex overflow-x-auto scrollbar-hide justify-start mb-6 p-1 bg-card rounded-xl border border-border">
            {uniqueRoles.map(role => (
              <TabsTrigger key={role} value={role} className="text-sm font-semibold tracking-wide data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
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
                    <div className="flex justify-center mt-8">
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
                  message="Nothing here yet."
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
            <div className="flex justify-center mt-8">
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
