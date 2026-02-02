'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = input.trim()
    if (message && !disabled) {
      // 直接清除 DOM 和 state
      if (textareaRef.current) {
        textareaRef.current.value = ''
        textareaRef.current.style.height = '24px'
      }
      setInput('')
      onSend(message)
      // 確保焦點
      requestAnimationFrame(() => {
        textareaRef.current?.focus()
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = '24px'
      const newHeight = Math.min(textarea.scrollHeight, 200)
      textarea.style.height = `${newHeight}px`
    }
  }, [input])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])


  const hasContent = input.trim().length > 0

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={cn(
          'relative rounded-[20px] transition-all duration-300',
          'bg-white dark:bg-zinc-900',
          'border-2',
          isFocused
            ? 'border-zinc-900 dark:border-zinc-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_20px_-4px_rgba(255,255,255,0.05)]'
            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
        )}
        onClick={() => textareaRef.current?.focus()}
      >
        <div className="flex items-end">
          {/* 輸入區域 */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Message Nexus..."
            rows={1}
            className={cn(
              'flex-1 resize-none bg-transparent py-4 pl-5 pr-3',
              'text-[15px] leading-6',
              'text-zinc-900 dark:text-zinc-100',
              'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
              'focus:outline-none',
              'disabled:cursor-not-allowed'
            )}
            style={{ minHeight: '24px', maxHeight: '200px' }}
          />

          {/* 發送按鈕 */}
          <div className="p-2">
            <button
              type="submit"
              disabled={disabled || !hasContent}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
                hasContent
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:scale-105 active:scale-95 shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              )}
            >
              <svg
                className={cn('w-5 h-5 transition-transform', hasContent && '-translate-y-px')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 快捷鍵提示 */}
      <div className="flex items-center justify-center gap-4 mt-2.5 text-[11px] text-zinc-400 dark:text-zinc-500">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-[10px]">↵</kbd>
          <span>發送</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-[10px]">⇧↵</kbd>
          <span>換行</span>
        </span>
      </div>
    </form>
  )
}
