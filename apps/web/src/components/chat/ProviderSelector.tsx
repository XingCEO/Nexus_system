'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ProviderConfig } from '@/hooks/useChat'

interface ProviderSelectorProps {
  selectedProvider: string | null
  onSelectProvider: (provider: string) => void
  providerConfig: ProviderConfig | null
}

const PROVIDER_INFO: Record<string, { name: string; icon: string; color: string }> = {
  anthropic: { name: 'Claude', icon: '🟣', color: 'bg-purple-500' },
  openai: { name: 'GPT', icon: '🟢', color: 'bg-emerald-500' },
  gemini: { name: 'Gemini', icon: '🔵', color: 'bg-blue-500' },
  lmstudio: { name: 'LM Studio', icon: '🟣', color: 'bg-violet-500' },
  ollama: { name: 'Ollama', icon: '⚪', color: 'bg-zinc-500' },
}

export function ProviderSelector({
  selectedProvider,
  onSelectProvider,
  providerConfig,
}: ProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const availableProviders = providerConfig?.providers.filter(p => p.available) || []
  const currentProvider = selectedProvider ? PROVIDER_INFO[selectedProvider] : null

  if (availableProviders.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        無可用模型
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
          "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700",
          "border border-zinc-200 dark:border-zinc-700"
        )}
      >
        {currentProvider ? (
          <>
            <span className={cn("w-2 h-2 rounded-full", currentProvider.color)} />
            <span>{currentProvider.name}</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
            <span>選擇模型</span>
          </>
        )}
        <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 py-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              選擇 AI 模型
            </div>

            {/* Cloud Providers */}
            <div className="px-3 py-1 text-[10px] text-zinc-400 mt-2">雲端服務</div>
            {['anthropic', 'openai', 'gemini'].map((providerId) => {
              const provider = providerConfig?.providers.find(p => p.provider === providerId)
              const info = PROVIDER_INFO[providerId]
              const isAvailable = provider?.available
              const isSelected = selectedProvider === providerId

              return (
                <button
                  key={providerId}
                  onClick={() => {
                    if (isAvailable) {
                      onSelectProvider(providerId)
                      setIsOpen(false)
                    }
                  }}
                  disabled={!isAvailable}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 transition-colors",
                    isAvailable
                      ? "hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      : "opacity-50 cursor-not-allowed",
                    isSelected && "bg-zinc-100 dark:bg-zinc-800"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={cn("w-2.5 h-2.5 rounded-full", info.color)} />
                    <span className={cn(
                      "font-medium",
                      isAvailable ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400"
                    )}>
                      {info.name}
                    </span>
                  </div>
                  {isAvailable ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      已連線
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      需要 API Key
                    </span>
                  )}
                </button>
              )
            })}

            {/* Local Providers */}
            <div className="px-3 py-1 text-[10px] text-zinc-400 mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-2">本機服務</div>
            {['lmstudio', 'ollama'].map((providerId) => {
              const provider = providerConfig?.providers.find(p => p.provider === providerId)
              const info = PROVIDER_INFO[providerId]
              const isAvailable = provider?.available
              const isSelected = selectedProvider === providerId

              return (
                <button
                  key={providerId}
                  onClick={() => {
                    if (isAvailable) {
                      onSelectProvider(providerId)
                      setIsOpen(false)
                    }
                  }}
                  disabled={!isAvailable}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 transition-colors",
                    isAvailable
                      ? "hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      : "opacity-50 cursor-not-allowed",
                    isSelected && "bg-zinc-100 dark:bg-zinc-800"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={cn("w-2.5 h-2.5 rounded-full", info.color)} />
                    <span className={cn(
                      "font-medium",
                      isAvailable ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400"
                    )}>
                      {info.name}
                    </span>
                  </div>
                  {isAvailable ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      已連線
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      未運行
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
