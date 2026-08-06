import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault()
    if (location.pathname === '/') {
      const elem = document.getElementById(sectionId)
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      navigate('/')
      setTimeout(() => {
        const elem = document.getElementById(sectionId)
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    }
  }

  return (
    <footer className="w-full bg-card border-t py-12 px-4" style={{ borderTopColor: 'var(--border)' }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-bold text-primary mb-4 block">
              Wonderfool
            </Link>
            <p className="text-muted-foreground text-sm">
              Your ultimate platform for tracking and celebrating anime, manga, and creators.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/browse" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Browse All Series
                </Link>
              </li>
              <li>
                <a
                  href="/#top-anime"
                  onClick={(e) => handleSectionClick(e, 'top-anime')}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                >
                  Top Anime
                </a>
              </li>
              <li>
                <Link to="/browse?type=MANGA" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Manga &amp; Novels
                </Link>
              </li>
              <li>
                <a
                  href="/#new-releases"
                  onClick={(e) => handleSectionClick(e, 'new-releases')}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                >
                  New Releases
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/creators" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Creator Support
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Community Voices
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support?tab=faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/support?tab=contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/support?tab=privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/support?tab=terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-8" style={{ borderTopColor: 'var(--border)' }} />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {currentYear} Wonderfool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
