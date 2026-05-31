import { cn } from '@/lib/utils'
import type { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn('text-sm font-medium leading-none text-gray-700', className)}
      {...props}
    />
  )
}
