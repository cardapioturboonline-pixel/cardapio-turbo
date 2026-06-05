'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Bold, Heading2, Heading3, List, ListOrdered, Link2, Pilcrow, Undo, Redo } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const lastValue = useRef<string>('')

  // Set initial content once (and when external value changes from outside, e.g. loading a post)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (value !== lastValue.current && value !== el.innerHTML) {
      el.innerHTML = value || ''
      lastValue.current = value
    }
  }, [value])

  const sync = useCallback(() => {
    const el = ref.current
    if (!el) return
    const html = el.innerHTML
    lastValue.current = html
    onChange(html)
  }, [onChange])

  function exec(command: string, arg?: string) {
    ref.current?.focus()
    document.execCommand(command, false, arg)
    sync()
  }

  function format(tag: string) {
    exec('formatBlock', tag)
  }

  function addLink() {
    const url = prompt('Cole o endereço do link (ex: /register ou https://...):', '/register')
    if (url) exec('createLink', url)
  }

  const btn = 'flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-white transition-colors'

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1.5">
        <button type="button" onClick={() => format('h2')} className={btn} title="Título"><Heading2 className="h-4 w-4" /></button>
        <button type="button" onClick={() => format('h3')} className={btn} title="Subtítulo"><Heading3 className="h-4 w-4" /></button>
        <button type="button" onClick={() => format('p')} className={btn} title="Parágrafo normal"><Pilcrow className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-gray-300" />
        <button type="button" onClick={() => exec('bold')} className={btn} title="Negrito"><Bold className="h-4 w-4" /></button>
        <button type="button" onClick={() => exec('insertUnorderedList')} className={btn} title="Lista com marcadores"><List className="h-4 w-4" /></button>
        <button type="button" onClick={() => exec('insertOrderedList')} className={btn} title="Lista numerada"><ListOrdered className="h-4 w-4" /></button>
        <button type="button" onClick={addLink} className={btn} title="Inserir link"><Link2 className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-gray-300" />
        <button type="button" onClick={() => exec('undo')} className={btn} title="Desfazer"><Undo className="h-4 w-4" /></button>
        <button type="button" onClick={() => exec('redo')} className={btn} title="Refazer"><Redo className="h-4 w-4" /></button>
      </div>

      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        data-placeholder={placeholder || 'Escreva o conteúdo do artigo aqui...'}
        className="blog-content rte-editable min-h-[360px] max-h-[600px] overflow-y-auto px-4 py-3 focus:outline-none"
      />
    </div>
  )
}
