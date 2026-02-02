'use client'

import { useState, useCallback } from 'react'
import { generateId } from '@super/shared/utils'
import { checkMessageLimit, incrementMessageCount, LimitCheckResult } from '@/lib/usage'
import { useUser } from '@/components/AuthGuard'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
}

export function useChat() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [limitError, setLimitError] = useState<LimitCheckResult | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    // 檢查訊息限制
    const limitCheck = checkMessageLimit(user)
    if (!limitCheck.allowed) {
      setLimitError(limitCheck)
      return
    }

    // 清除之前的限制錯誤
    setLimitError(null)

    // 新增用戶訊息
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // 增加訊息計數
    incrementMessageCount()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.content,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)

      // 錯誤時顯示模擬回應（開發用）
      const mockResponse: Message = {
        id: generateId(),
        role: 'assistant',
        content: `收到你的訊息：「${content}」\n\n這是模擬回應。請設定 API 金鑰以連接真實的 AI 模型。`,
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, mockResponse])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    limitError,
    clearLimitError: () => setLimitError(null),
  }
}
