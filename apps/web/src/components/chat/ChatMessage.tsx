'use client'

import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
}

interface ChatMessageProps {
  message: Message
  isLatest?: boolean
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('py-6', isLatest && 'animate-enter')}>
      <div className="flex gap-4">
        <div className="shrink-0 pt-0.5">
          <div
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
              isUser
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-foreground text-background'
            )}
          >
            {isUser ? '你' : 'S'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  )
}
