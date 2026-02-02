'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LimitCheckResult } from '@/lib/usage'
import { MemberTier, tierConfigs } from '@/lib/auth'

interface UpgradePromptProps {
  limitResult: LimitCheckResult
  type: 'messages' | 'workflows' | 'agents' | 'mcpTools'
  currentTier: MemberTier
  onClose?: () => void
  inline?: boolean
}

const typeLabels = {
  messages: '每日訊息',
  workflows: '工作流',
  agents: 'Agent',
  mcpTools: 'MCP 工具',
}

const suggestedUpgrade: Record<MemberTier, MemberTier | null> = {
  free: 'pro',
  pro: 'enterprise',
  enterprise: null,
  internal: null,
}

export function UpgradePrompt({ limitResult, type, currentTier, onClose, inline = false }: UpgradePromptProps) {
  const [isVisible, setIsVisible] = useState(true)
  const nextTier = suggestedUpgrade[currentTier]
  const nextTierConfig = nextTier ? tierConfigs[nextTier] : null

  if (limitResult.allowed || !isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (inline) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
        <svg className="w-4 h-4 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <span className="text-amber-600 dark:text-amber-400">
          {typeLabels[type]}已達上限 ({limitResult.current}/{limitResult.limit})
        </span>
        {nextTierConfig && (
          <Link
            href="/pricing"
            className="ml-auto text-xs font-medium px-2 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          >
            升級至{nextTierConfig.name}
          </Link>
        )}
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative bg-background rounded-2xl border border-border p-6 w-full max-w-md shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{typeLabels[type]}已達上限</h3>
              <p className="text-sm text-muted-foreground">
                {limitResult.current} / {limitResult.limit}
              </p>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-muted-foreground mb-6">
            {limitResult.message}
          </p>

          {/* Upgrade suggestion */}
          {nextTierConfig && (
            <div className="p-4 rounded-xl border border-border/50 bg-card/30 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">升級至</span>
                <span className={cn("text-sm font-medium px-2 py-0.5 rounded", nextTierConfig.bgColor, nextTierConfig.color)}>
                  {nextTierConfig.name}
                </span>
              </div>
              <ul className="space-y-2">
                {nextTierConfig.features.slice(0, 3).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 h-10 px-4 rounded-lg border border-border text-sm hover:bg-secondary transition-all"
            >
              稍後再說
            </button>
            {nextTierConfig && (
              <Link
                href="/pricing"
                className="flex-1 h-10 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all flex items-center justify-center"
              >
                查看方案
              </Link>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * 用量指示器 - 顯示當前用量狀態
 */
interface UsageIndicatorProps {
  current: number
  limit: number | 'unlimited' | 'all'
  label: string
  className?: string
}

export function UsageIndicator({ current, limit, label, className }: UsageIndicatorProps) {
  const isUnlimited = limit === 'unlimited' || limit === 'all'
  const percentage = isUnlimited ? 0 : (current / (limit as number)) * 100
  const isNearLimit = !isUnlimited && percentage >= 80
  const isAtLimit = !isUnlimited && percentage >= 100

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
          "font-medium",
          isAtLimit && "text-red-500",
          isNearLimit && !isAtLimit && "text-amber-500"
        )}>
          {current} / {isUnlimited ? '∞' : limit}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-foreground"
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * 用量卡片 - 顯示完整用量資訊
 */
interface UsageCardProps {
  messages: LimitCheckResult
  workflows: LimitCheckResult
  agents: LimitCheckResult
  mcpTools: LimitCheckResult
  tier: MemberTier
  className?: string
}

export function UsageCard({ messages, workflows, agents, mcpTools, tier, className }: UsageCardProps) {
  const tierConfig = tierConfigs[tier]

  return (
    <div className={cn("p-4 rounded-xl border border-border/50 bg-card/30", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">使用量</span>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded", tierConfig.bgColor, tierConfig.color)}>
          {tierConfig.name}
        </span>
      </div>
      <div className="space-y-3">
        <UsageIndicator
          current={messages.current}
          limit={messages.limit}
          label="今日訊息"
        />
        <UsageIndicator
          current={workflows.current}
          limit={workflows.limit}
          label="工作流"
        />
        <UsageIndicator
          current={agents.current}
          limit={agents.limit}
          label="Agent"
        />
        <UsageIndicator
          current={mcpTools.current}
          limit={mcpTools.limit}
          label="MCP 工具"
        />
      </div>
    </div>
  )
}
