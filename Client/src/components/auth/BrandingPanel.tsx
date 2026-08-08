import React from 'react'

export default function BrandingPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-center items-start px-12 lg:px-16 absolute left-0 top-0 bottom-0 z-10 pointer-events-none w-[40%]"
    >
      {/* Content */}
      <div className="relative z-10 text-left w-full flex flex-col gap-8">
        {/* Wordmark */}
        <div className="font-serif text-4xl lg:text-5xl font-bold text-accent tracking-tight">
          Wonderfool
        </div>

        {/* Brand Voice Tagline */}
        <p className="font-serif text-xl lg:text-2xl font-semibold leading-relaxed text-foreground">
          Your collection is waiting. Try not to get locked out again.
        </p>

        {/* Supporting line */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          Track anime and manga. Read editorial coverage. All in one place.
        </p>
      </div>
    </div>
  )
}
