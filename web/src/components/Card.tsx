import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  color?: 'yellow' | 'cyan' | 'pink' | 'green' | 'purple' | 'white'
  hover?: boolean
}

export default function Card({
  children,
  className,
  color = 'white',
  hover = false
}: CardProps) {
  const colorClasses = {
    yellow: 'bg-neo-yellow',
    cyan: 'bg-neo-cyan',
    pink: 'bg-neo-pink',
    green: 'bg-neo-green',
    purple: 'bg-neo-purple',
    white: 'bg-white',
  }

  return (
    <div
      className={clsx(
        'p-6 border-4 border-black neo-shadow',
        colorClasses[color],
        hover && 'transition-all duration-300 hover:neo-shadow-lg hover:-translate-x-2 hover:-translate-y-2',
        className
      )}
    >
      {children}
    </div>
  )
}
