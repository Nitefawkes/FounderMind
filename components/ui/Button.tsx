'use client'

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'cyber-button',
    secondary: 'border border-neon-pink text-neon-pink hover:bg-neon-pink/10',
    danger: 'border border-red-500 text-red-500 hover:bg-red-500/10',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
