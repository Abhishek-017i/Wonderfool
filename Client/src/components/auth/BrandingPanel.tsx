export default function BrandingPanel() {
  return (
    <div
      className="hidden md:flex md:w-[45%] lg:w-[40%] flex-col justify-center items-center px-12 lg:px-16 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Diagonal stripe pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 15px, currentColor 15px, currentColor 30px)`,
        }}
      />

      {/* Soft radial glow behind content */}
      <div
        className="absolute -top-1/3 -right-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, rgba(243, 191, 95, 0.3), transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-xs flex flex-col gap-8">
        {/* Wordmark */}
        <div className="font-serif text-4xl lg:text-5xl font-bold text-accent tracking-tight">
          Wonderfool
        </div>

        {/* Brand Voice Tagline */}
        <p className="font-serif text-xl lg:text-2xl font-semibold leading-relaxed text-white/90">
          Your collection is waiting. Try not to get locked out again.
        </p>

        {/* Supporting line */}
        <p className="text-sm text-white/60 leading-relaxed">
          Track anime and manga. Read editorial coverage. All in one place.
        </p>
      </div>
    </div>
  )
}
