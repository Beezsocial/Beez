import Logo from '@/components/ui/Logo'
import NavHeader from '@/components/ui/NavHeader'
import MockupCarousel from '@/components/ui/MockupCarousel'
import HeroSection from '@/components/ui/HeroSection'
import FeaturesSection from '@/components/ui/FeaturesSection'
import PricingSection from '@/components/ui/PricingSection'
import CtaSection from '@/components/ui/CtaSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy honeycomb-bg overflow-x-hidden">

      {/* ── NAV ── */}
      <NavHeader />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── APP MOCKUP CAROUSEL ── */}
      <section
        className="py-12 px-4 flex items-center justify-center overflow-visible"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <MockupCarousel />
      </section>

      {/* ── FEATURES ── */}
      <FeaturesSection />

      {/* ── PRICING ── */}
      <PricingSection />

      {/* ── SIGN-UP CTA ── */}
      <CtaSection />

      {/* ── FOOTER ── */}
      <footer
        className="py-8 px-4 sm:px-6 border-t border-white/5"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/25 text-xs">
          <Logo height={32} />
          <p>La ruche des entrepreneurs. © {new Date().getFullYear()}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/mentions-legales" className="hover:text-white/50 transition-colors">
              Mentions légales
            </a>
            <a href="/privacy" className="hover:text-white/50 transition-colors">
              Politique de confidentialité
            </a>
            <a href="/terms" className="hover:text-white/50 transition-colors">
              Conditions d'utilisation
            </a>
            <a href="/contact" className="hover:text-white/50 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
