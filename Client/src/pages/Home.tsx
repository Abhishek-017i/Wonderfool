import Navbar from '@/components/Navbar'
import HeroCarousel from '@/components/HeroCarousel'
import HorizontalScrollRow from '@/components/HorizontalScrollRow'
import StoriesSection from '@/components/StoriesSection'
import Footer from '@/components/Footer'
import { seriesData } from '@/data/series'

export default function Home() {
  // Separate series by category
  const topAnime = seriesData.slice(0, 7)
  const topMangaLightNovels = seriesData.slice(7, 14)
  const newReleases = seriesData.slice(14, 20)

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />
      <HorizontalScrollRow title="Top Anime" series={topAnime} />
      <HorizontalScrollRow title="Top Manga & Light Novels" series={topMangaLightNovels} />
      <HorizontalScrollRow title="New Releases" series={newReleases} />
      <StoriesSection />
      <Footer />
    </div>
  )
}



