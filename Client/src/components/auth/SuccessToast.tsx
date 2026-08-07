import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface SuccessToastProps {
  show: boolean
}

export default function SuccessToast({ show }: SuccessToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
    }
  }, [show])

  return (
    <div
      className={`fixed bottom-6 right-6 transition-all duration-300 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-sm">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <p className="font-medium text-sm">You&apos;re back. I was wondering when you&apos;d show up.</p>
      </div>
    </div>
  )
}
