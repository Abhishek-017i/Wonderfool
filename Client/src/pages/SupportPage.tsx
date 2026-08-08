import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HelpCircle, Mail, ShieldCheck, FileText, Phone, MessageSquare, Globe, AtSign, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { cn } from '@/lib/utils'

type TabType = 'faq' | 'contact' | 'privacy' | 'terms'

const FAQS = [
  {
    q: 'How is series data synchronized across Anime, Manga, and Light Novels?',
    a: 'Wonderfool aggregates series metadata from live database endpoints and verified AniList records. Information such as release status, volume counts, cover art, and staffing credits are updated dynamically as official sources release updates.'
  },
  {
    q: 'How does account authentication and data security work?',
    a: 'Your account is secured using Firebase Authentication paired with encrypted MongoDB storage. Credentials and personal session data are handled using industry-standard OAuth 2.0 and JWT protocols. We never store raw passwords.'
  },
  {
    q: 'How are series scores and popularity rankings calculated?',
    a: 'Series ratings combine user evaluations with weighted score averages. Popularity metrics reflect active community engagement, library additions, and recent readership activity over rolling 30-day windows.'
  },
  {
    q: 'What are the rules for publishing community articles and character studies?',
    a: 'Community submissions must be original work free of hate speech, targeted harassment, or explicit un-tagged spoilers. All community articles are peer-reviewed and moderated to ensure high publication quality.'
  },
  {
    q: 'How can creators update their profile portfolio or staff credits?',
    a: 'Verified creators and illustrators can claim their profile by contacting support. Once verified, creators gain access to showcase official social links, bio highlights, and tagged work adaptations.'
  },
  {
    q: 'How do I add an entry to my personal Wishlist or Tracked List?',
    a: 'Navigate to any series card or detail page and click "Add to Wishlist". You can view and manage all saved titles directly from your account Profile page under the Wishlist section.'
  },
  {
    q: 'What should I do if a series title has incorrect or missing chapter info?',
    a: 'You can reach out to our administration team via the Contact Us tab with the series ID and reference link. Data corrections are typically verified and applied within 24 to 48 hours.'
  }
]

export default function SupportPage() {
  const [params, setParams] = useSearchParams()
  const activeTab = (params.get('tab') as TabType) || 'faq'
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  const TABS = [
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
  ]

  const CONTACT_INFO = [
    { label: 'Email', value: 'teamwonderfool@gmail.com', icon: Mail, href: 'mailto:teamwonderfool@gmail.com' },
    { label: 'Phone Number', value: '+91 9316532780', icon: Phone, href: 'tel:+919316532780' },
    { label: 'Discord', value: 'discord.gg/wonderfool', icon: MessageSquare, href: 'https://discord.gg/wonderfool' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Wonderfool Support</p>
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-gradient mb-3">Support &amp; Help Center</h1>
          <p className="text-sm md:text-base text-muted-foreground font-serif italic">Find answers to technical questions, reach our team, or view terms.</p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 border-b border-border pb-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setParams({ tab: id })}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all border',
                activeTab === id
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto">
          {/* FAQs */}
          {activeTab === 'faq' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <h2 className="text-xl font-bold font-serif mb-4 text-foreground">Frequently Asked Questions</h2>
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm hover:text-primary transition-colors gap-3"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={cn('w-4 h-4 shrink-0 transition-transform text-muted-foreground', openFaq === i && 'rotate-180 text-primary')} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="px-4 pb-4 text-xs leading-relaxed text-muted-foreground border-t border-border/40 pt-3">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {/* CONTACT US (Single vertical stacked list) */}
          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold font-serif mb-1 text-foreground">
                  Contact Us
                </h2>
                <p className="text-xs text-muted-foreground">
                  Reach out through any of our official communication channels below.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {CONTACT_INFO.map((item, i) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3 text-primary font-bold text-sm">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>

                        <span>{item.label}</span>
                      </div>

                      <a
                        href={item.href}
                        target={item.label === 'Discord' ? '_blank' : undefined}
                        rel={
                          item.label === 'Discord'
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        className="text-sm font-semibold text-foreground font-mono bg-muted/60 px-4 py-2 rounded-lg border border-border/40 select-all sm:self-center w-full sm:w-auto text-left sm:text-right hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 break-all"
                      >
                        {item.value}
                      </a>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6 text-xs leading-relaxed text-muted-foreground shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-foreground font-serif mb-1">Privacy Policy</h2>
                <p className="text-xs text-muted-foreground italic">Last Updated: August 2026</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">1. Privacy Commitment</h3>
                <p>At Wonderfool, protecting your personal privacy and safeguarding your data integrity is fundamental to our platform design. This Privacy Policy details how we collect, process, utilize, and protect your personal information across all applications and APIs connected to our platform.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">2. Information We Collect</h3>
                <p>We collect information necessary to provide seamless series tracking, community interaction, and user account management:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Account Credentials:</strong> Email addresses, hashed authentication tokens, display names, and profile avatars provided during registration.</li>
                  <li><strong className="text-foreground">Library &amp; Preferences:</strong> Saved wishlists, series status tracking, custom ratings, and theme configurations.</li>
                  <li><strong className="text-foreground">User Contributions:</strong> Articles, comments, community post drafts, and interaction telemetry.</li>
                  <li><strong className="text-foreground">Technical Log Data:</strong> Device browser user-agents, IP logs, and system error telemetry used exclusively for security audits and performance diagnostics.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">3. How Information Is Used</h3>
                <p>Collected data is used strictly to power platform features, including generating custom library feeds, persisting user theme preferences, facilitating community discussions, preventing unauthorized access, and executing essential technical upgrades.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">4. Third-Party Integrations &amp; Security</h3>
                <p>Wonderfool utilizes Firebase Authentication for secure identity management and MongoDB Atlas for encrypted database persistence. Data is protected in transit via Transport Layer Security (TLS 1.3) and at rest with AES-256 encryption. We never sell, rent, or trade user personal data to advertisers or third-party brokers.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">5. Your Data Rights &amp; Deletion</h3>
                <p>You retain full ownership and control over your personal data. You may request a complete export of your user data or initiate permanent account deletion at any time by contacting our support team at <span className="font-mono text-foreground font-semibold">xyz@gmail.com</span>.</p>
              </div>
            </motion.div>
          )}

          {/* TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6 text-xs leading-relaxed text-muted-foreground shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-foreground font-serif mb-1">Terms of Service</h2>
                <p className="text-xs text-muted-foreground italic">Last Updated: August 2026</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">1. Acceptance of Terms</h3>
                <p>By registering, accessing, or utilizing the Wonderfool platform, you agree to be bound by these Terms of Service and all applicable digital distribution laws. If you do not agree with any part of these terms, you must refrain from using the platform.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">2. User Conduct &amp; Community Guidelines</h3>
                <p>Wonderfool maintains a zero-tolerance policy for harassment, hate speech, malicious spam, or unauthorized automated scraping. Users must respect fellow community members, creators, and platform staff. Failure to comply will result in immediate account suspension and revocation of platform privileges.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">3. Intellectual Property Rights</h3>
                <p>All official series artwork, character designs, logos, and promotional media displayed on Wonderfool remain the exclusive intellectual property of their original creators, publishers, and licensing entities. Wonderfool claims no ownership over official media assets.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">4. User Generated Content</h3>
                <p>By posting articles, reviews, or comments on Wonderfool, you retain ownership of your original written work while granting Wonderfool a worldwide, non-exclusive, royalty-free license to host, display, and distribute your content across our platform services.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">5. Limitation of Liability</h3>
                <p>Wonderfool is provided on an "as is" and "as available" basis without warranties of any kind. Wonderfool shall not be held liable for temporary service interruptions, third-party network outages, or inadvertent errors in external series data feeds.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground">6. Modifications &amp; Termination</h3>
                <p>We reserve the right to update or modify these terms at any time. Continued use of the platform following published changes constitutes acceptance of the revised Terms of Service.</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
