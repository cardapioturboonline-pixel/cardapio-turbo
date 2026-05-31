'use client'

// Simple toast notification system using @base-ui/react/toast
import * as React from 'react'

// Simple in-page notification without external dependencies
let toastContainer: ((message: string, type?: 'success' | 'error' | 'info') => void) | null = null

export function setToastContainer(fn: typeof toastContainer) {
  toastContainer = fn
}

export function toast(message: string, options?: { description?: string }) {
  if (toastContainer) {
    toastContainer(options?.description || message, 'info')
  }
}
toast.success = (message: string) => toastContainer?.(message, 'success')
toast.error = (message: string) => toastContainer?.(message, 'error')

export function Toaster() {
  const [toasts, setToasts] = React.useState<Array<{ id: number; message: string; type: string }>>([])

  React.useEffect(() => {
    setToastContainer((message, type = 'info') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 3500)
    })
    return () => setToastContainer(null)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white min-w-[240px] max-w-[360px] transition-all ${
            t.type === 'success' ? 'bg-green-600' :
            t.type === 'error' ? 'bg-red-600' :
            'bg-gray-800'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
