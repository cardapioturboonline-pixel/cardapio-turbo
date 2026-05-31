import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'bg-orange-500 text-white': variant === 'default',
          'bg-gray-100 text-gray-700': variant === 'secondary',
          'bg-red-100 text-red-700': variant === 'destructive',
          'border border-gray-300 text-gray-700 bg-transparent': variant === 'outline',
          'bg-green-100 text-green-700': variant === 'success',
        },
        className
      )}
      {...props}
    />
  )
}
