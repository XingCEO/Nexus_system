'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ChatHeader } from './ChatHeader'
import { useChat } from '@/hooks/useChat'
import { LogoMark } from '@/components/Logo'
import { UpgradePrompt } from '@/components/UpgradePrompt'
import { useUser } from '@/components/AuthGuard'

const prompts = [
  { text: '分析專案架構並給出優化建議', category: '分析' },
  { text: '幫我設計一個 REST API', category: '開發' },
  { text: '解釋這段程式碼的運作原理', category: '學習' },
  { text: '建立自動化部署工作流', category: '自動化' },
]

export function Chat() {
  const { user } = useUser()
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    regenerateLastMessage,
    limitError,
    clearLimitError,
    selectedProvider,
    setSelectedProvider,
    providerConfig,
  } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChatHeader
        onClear={clearMessages}
        selectedProvider={selectedProvider}
        onSelectProvider={setSelectedProvider}
        providerConfig={providerConfig}
      />

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center px-6"
            >
              {/* Centered welcome - Golden Ratio spacing */}
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 blur-2xl bg-foreground/5 rounded-full scale-150" />
                    <div className="relative w-20 h-20 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
                      <LogoMark className="w-12 h-12" />
                    </div>
                  </div>
                </motion.div>

                {/* Title - Golden Ratio: 34px title, 21px subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <h1 className="text-[34px] font-semibold tracking-tight mb-3">
                    有什麼我可以幫你的？
                  </h1>
                  <p className="text-[21px] text-muted-foreground leading-relaxed">
                    我能記住一切、自主行動、24/7 持續運作
                  </p>
                </motion.div>

                {/* Quick prompts - Golden Ratio: 13px category, 15px text */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-2 gap-3 mt-12 w-full max-w-xl"
                >
                  {prompts.map((prompt) => (
                    <button
                      key={prompt.text}
                      onClick={() => sendMessage(prompt.text)}
                      className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-border text-left transition-all duration-200"
                    >
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">{prompt.category}</span>
                      <p className="text-[15px] mt-1.5 text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{prompt.text}</p>
                    </button>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto py-8 px-6"
            >
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                  onRegenerate={() => regenerateLastMessage()}
                  onRegenerateWithModel={(model) => regenerateLastMessage(model)}
                />
              ))}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
          <p className="text-center text-[11px] text-muted-foreground/60 mt-3">
            超級系統可能產生不準確的資訊，請驗證重要內容
          </p>
        </div>
      </div>

      {/* Upgrade Prompt Modal */}
      {limitError && !limitError.allowed && user && (
        <UpgradePrompt
          limitResult={limitError}
          type="messages"
          currentTier={user.tier}
          onClose={clearLimitError}
        />
      )}
    </div>
  )
}
