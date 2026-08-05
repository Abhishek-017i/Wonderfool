import { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

function ScrollArea({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-x-auto overflow-y-hidden [&_::-webkit-scrollbar]:h-2 [&_::-webkit-scrollbar-track]:bg-transparent [&_::-webkit-scrollbar-thumb]:bg-border [&_::-webkit-scrollbar-thumb]:rounded-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { ScrollArea }
