import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import HeroCarousel from '@/components/HeroCarousel'
import SeriesGrid from '@/components/SeriesGrid'
import StoriesSection from '@/components/StoriesSection'
import Footer from '@/components/Footer'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Home() {
  const [topAnime, setTopAnime] = useState([])
  const [topManga, setTopManga] = useState([])
  const [topNovel, setTopNovel] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [carouselData, setCarouselData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [animeRes, mangaRes, novelRes, newRes, carouselRes] = await Promise.all([
          fetch(`${API_URL}/series?type=ANIME&sortBy=averageScore&limit=10`).then(r => r.json()),
          fetch(`${API_URL}/series?type=MANGA&sortBy=averageScore&limit=10`).then(r => r.json()),
          fetch(`${API_URL}/series?type=NOVEL&sortBy=averageScore&limit=10`).then(r => r.json()),
          fetch(`${API_URL}/series?sortBy=startDate&limit=10`).then(r => r.json()),
          fetch(`${API_URL}/series?type=ANIME&sortBy=popularity&limit=10`).then(r => r.json()),
        ])
        
        setTopAnime(animeRes.series || [])
        setTopManga(mangaRes.series || [])
        setTopNovel(novelRes.series || [])
        setNewReleases(newRes.series || [])
        
        // Use popular anime for carousel, fallback to top anime
        setCarouselData(carouselRes.series?.length > 0 ? carouselRes.series : (animeRes.series || []))
      } catch (err) {
        console.error('Failed to fetch home data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar />
      <HeroCarousel series={carouselData.slice(0, 10)} />
      <div id="top-anime">
        <SeriesGrid title="Top Anime" series={topAnime} linkTo="/browse?type=ANIME" linkText="View All Anime" />
      </div>
      <SeriesGrid title="Top Manga" series={topManga} alternateBg={true} linkTo="/browse?type=MANGA" linkText="View All Manga" />
      <SeriesGrid title="Top Light Novels" series={topNovel} linkTo="/browse?type=NOVEL" linkText="View All Novels" />
      <div id="new-releases">
        <SeriesGrid title="New Releases" series={newReleases} alternateBg={true} linkTo="/browse?sortBy=Newest" linkText="View New Releases" />
      </div>
      <StoriesSection />
      <Footer />
    </div>
  )
}
