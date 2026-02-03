'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { generateId } from '@super/shared/utils'
import { checkMessageLimit, incrementMessageCount, LimitCheckResult } from '@/lib/usage'
import { useUser } from '@/components/AuthGuard'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  isStreaming?: boolean
}

export interface ProviderInfo {
  provider: string
  available: boolean
  models?: string[]
}

export interface ProviderConfig {
  providers: ProviderInfo[]
  currentConfig: {
    provider: string
  }
}

export function useChat() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [limitError, setLimitError] = useState<LimitCheckResult | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [providerConfig, setProviderConfig] = useState<ProviderConfig | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // 載入可用的 providers
  useEffect(() => {
    async function loadProviders() {
      try {
        const response = await fetch('/api/chat')
        if (response.ok) {
          const data = await response.json()
          setProviderConfig(data)
          // 設定預設 provider
          if (data.currentConfig?.provider && data.currentConfig.provider !== 'none') {
            setSelectedProvider(data.currentConfig.provider)
          }
        }
      } catch (error) {
        console.error('Failed to load providers:', error)
      }
    }
    loadProviders()
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    // 檢查訊息限制
    const limitCheck = checkMessageLimit(user)
    if (!limitCheck.allowed) {
      setLimitError(limitCheck)
      return
    }

    // 清除之前的限制錯誤
    setLimitError(null)

    // 取消之前的請求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    // 新增用戶訊息
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: new Date(),
    }

    // 新增空的 AI 訊息（用於串流填充）
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
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
          stream: true,
          provider: selectedProvider,
          model: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const contentType = response.headers.get('content-type')

      // 串流模式
      if (contentType?.includes('text/event-stream')) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          let fullContent = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  // 串流結束
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, isStreaming: false }
                        : m
                    )
                  )
                  break
                }

                try {
                  const parsed = JSON.parse(data)
                  if (parsed.content) {
                    fullContent += parsed.content
                    // 即時更新訊息內容
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMessage.id
                          ? { ...m, content: fullContent }
                          : m
                      )
                    )
                  }
                  if (parsed.error) {
                    throw new Error(parsed.error)
                  }
                } catch (e) {
                  // 忽略解析錯誤
                }
              }
            }
          }
        }
      } else {
        // 非串流模式
        const data = await response.json()
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: data.content, isStreaming: false }
              : m
          )
        )
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return
      }

      console.error('Chat error:', error)

      // 錯誤時顯示錯誤訊息
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content: `抱歉，發生錯誤。請確認 LLM 服務正在運行。\n\n錯誤詳情：${(error as Error).message}`,
                isStreaming: false,
              }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [messages, user, selectedProvider, selectedModel])

  const clearMessages = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setMessages([])
  }, [])

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsLoading(false)
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    )
  }, [])

  const regenerateLastMessage = useCallback(async (model?: string) => {
    // 找到最後一個用戶訊息
    const lastUserMessageIndex = messages.map(m => m.role).lastIndexOf('user')
    if (lastUserMessageIndex === -1) return

    // 移除最後的 AI 回應
    const newMessages = messages.slice(0, lastUserMessageIndex + 1)
    setMessages(newMessages)

    // 取消之前的請求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    // 新增空的 AI 訊息
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      isStreaming: true,
    }

    setMessages([...newMessages, assistantMessage])
    setIsLoading(true)

    // 解析 model 參數，格式可能是 "provider:model" 或只是 "model"
    let useProvider = selectedProvider
    let useModel = model || selectedModel

    if (model && model.includes(':')) {
      const [p, m] = model.split(':')
      useProvider = p
      useModel = m
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
          provider: useProvider,
          model: useModel,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate message')
      }

      const contentType = response.headers.get('content-type')

      if (contentType?.includes('text/event-stream')) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          let fullContent = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, isStreaming: false }
                        : m
                    )
                  )
                  break
                }

                try {
                  const parsed = JSON.parse(data)
                  if (parsed.content) {
                    fullContent += parsed.content
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMessage.id
                          ? { ...m, content: fullContent }
                          : m
                      )
                    )
                  }
                } catch (e) {
                  // 忽略解析錯誤
                }
              }
            }
          }
        }
      } else {
        const data = await response.json()
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: data.content, isStreaming: false }
              : m
          )
        )
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') return

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content: `重新生成失敗：${(error as Error).message}`,
                isStreaming: false,
              }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [messages, selectedProvider, selectedModel])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    stopStreaming,
    regenerateLastMessage,
    limitError,
    clearLimitError: () => setLimitError(null),
    // Provider 相關
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    providerConfig,
  }
}
