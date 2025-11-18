import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-bold border-4 border-black transition-all duration-200 inline-flex items-center justify-center'

  const variantClasses = {
    primary: 'bg-neo-yellow hover:bg-neo-yellow/90 text-black',
    secondary: 'bg-neo-cyan hover:bg-neo-cyan/90 text-black',
    outline: 'bg-white hover:bg-black hover:text-white',
    ghost: 'bg-transparent border-0 hover:bg-black hover:text-white',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        'neo-shadow hover:neo-shadow-lg hover:-translate-x-1 hover:-translate-y-1',
        'active:translate-x-1 active:translate-y-1 active:shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
