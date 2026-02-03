'use client'

import { useState } from 'react'
import { Moon, Sun, RotateCcw } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogoMark } from '@/components/Logo'
import { cn } from '@/lib/utils'
import { signOut, getTierConfig } from '@/lib/auth'
import { useUser } from '@/components/AuthGuard'
import { ProviderSelector } from './ProviderSelector'
import type { ProviderConfig } from '@/hooks/useChat'

interface ChatHeaderProps {
  onClear: () => void
  selectedProvider: string | null
  onSelectProvider: (provider: string) => void
  providerConfig: ProviderConfig | null
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ChatHeader({ onClear, selectedProvider, onSelectProvider, providerConfig }: ChatHeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user } = useUser()

  const handleLogout = async () => {
    await signOut()
    setShowUserMenu(false)
    router.push('/')
  }

  const tierConfig = user ? getTierConfig(user.tier) : null

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-8">
        {/* Logo with embossing effect */}
        <Link href="/" className="group flex items-center gap-2.5 hover:opacity-90 transition-all duration-300">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-lg bg-foreground/5 blur-md scale-150 group-hover:bg-foreground/10 transition-all duration-300" />
            {/* Logo container with embossing */}
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-b from-foreground to-foreground/90 text-background flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)] group-hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)] transition-all duration-300">
              <LogoMark className="w-5 h-5" />
            </div>
          </div>
          <span className="text-sm font-semibold tracking-tight">超級系統</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/memories"
            className="px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-md transition-all duration-200"
          >
            記憶
          </Link>
          <Link
            href="/mcp"
            className="px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-md transition-all duration-200"
          >
            工具
          </Link>
          <Link
            href="/workflows"
            className="px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-md transition-all duration-200"
          >
            工作流
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Provider Selector */}
        <ProviderSelector
          selectedProvider={selectedProvider}
          onSelectProvider={onSelectProvider}
          providerConfig={providerConfig}
        />

        <div className="w-px h-5 bg-border/50" />

        <button
          onClick={onClear}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
          title="新對話"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
          title="切換主題"
        >
          <Sun className="w-4 h-4 dark:hidden" />
          <Moon className="w-4 h-4 hidden dark:block" />
        </button>

        {/* User Menu */}
        <div className="relative ml-2">
          {user ? (
            <>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 h-8 px-2 rounded-lg hover:bg-secondary/80 transition-all"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", tierConfig?.bgColor, tierConfig?.color)}>
                  {tierConfig?.name}
                </span>
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border/50 bg-background shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{user.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                        </div>
                      </div>
                      <div className={cn("mt-2 text-xs font-medium px-2 py-1 rounded inline-flex items-center gap-1", tierConfig?.bgColor, tierConfig?.color)}>
                        {user.tier === 'internal' && '🔓'} {tierConfig?.name}
                      </div>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <SettingsIcon className="w-4 h-4" />
                        設定
                      </Link>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
                        onClick={handleLogout}
                      >
                        <LogoutIcon className="w-4 h-4" />
                        登出
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="h-8 px-3 rounded-lg bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-all flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              登入
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
