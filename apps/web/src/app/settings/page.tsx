'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { LogoMark } from '@/components/Logo'
import { cn } from '@/lib/utils'
import { AuthGuard, useUser } from '@/components/AuthGuard'
import { getTierConfig, logout } from '@/lib/auth'

type SettingsTab = 'profile' | 'api' | 'preferences' | 'memory' | 'danger'

function SettingsIcon({ id, className }: { id: string; className?: string }) {
  const iconClass = cn('w-5 h-5', className)

  switch (id) {
    case 'profile':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'api':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'preferences':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'memory':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
          <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
        </svg>
      )
    case 'danger':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    default:
      return null
  }
}

const TABS = [
  { id: 'profile', label: '個人資料' },
  { id: 'api', label: 'API 金鑰' },
  { id: 'preferences', label: '偏好設定' },
  { id: 'memory', label: '記憶管理' },
  { id: 'danger', label: '危險區域' },
] as const

function SettingsContent() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Modal states
  const [showClearMemoryModal, setShowClearMemoryModal] = useState(false)
  const [showDeleteHistoryModal, setShowDeleteHistoryModal] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [deleteAccountInput, setDeleteAccountInput] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const tierConfig = user ? getTierConfig(user.tier) : null

  // Form states
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
      })
    }
  }, [user])

  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
  })

  const [localLLM, setLocalLLM] = useState({
    provider: 'none' as 'none' | 'lmstudio' | 'ollama',
    lmstudioUrl: 'http://localhost:1234/v1',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3.2',
  })

  const [providerStatus, setProviderStatus] = useState<{
    lmstudio: boolean
    ollama: boolean
    ollamaModels: string[]
  }>({
    lmstudio: false,
    ollama: false,
    ollamaModels: [],
  })

  const [isCheckingProviders, setIsCheckingProviders] = useState(false)

  // 檢查本機 LLM 狀態
  const checkLocalProviders = async () => {
    setIsCheckingProviders(true)
    try {
      const res = await fetch('/api/chat')
      const data = await res.json()
      const providers = data.providers || []

      const lmstudio = providers.find((p: { provider: string; available: boolean }) => p.provider === 'lmstudio')
      const ollama = providers.find((p: { provider: string; available: boolean; models?: string[] }) => p.provider === 'ollama')

      setProviderStatus({
        lmstudio: lmstudio?.available || false,
        ollama: ollama?.available || false,
        ollamaModels: ollama?.models || [],
      })
    } catch (e) {
      console.error('Failed to check providers:', e)
    }
    setIsCheckingProviders(false)
  }

  useEffect(() => {
    checkLocalProviders()
  }, [])

  const [preferences, setPreferences] = useState({
    language: 'zh-TW',
    defaultModel: 'gpt-4',
    streamResponse: true,
    saveHistory: true,
  })

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleClearMemory = async () => {
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDeleting(false)
    setShowClearMemoryModal(false)
  }

  const handleDeleteHistory = async () => {
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDeleting(false)
    setShowDeleteHistoryModal(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteAccountInput !== user?.name) return
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app" className="flex items-center gap-2.5 hover:opacity-90 transition-all">
              <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                <LogoMark className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">超級系統</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm">設定</span>
            {tierConfig && (
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded", tierConfig.bgColor, tierConfig.color)}>
                {tierConfig.name}
              </span>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "h-9 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              saveSuccess
                ? "bg-green-500 text-white"
                : "bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
            )}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                儲存中...
              </>
            ) : saveSuccess ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已儲存
              </>
            ) : (
              '儲存變更'
            )}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-48 shrink-0">
            <ul className="space-y-1">
              {TABS.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                      activeTab === tab.id
                        ? 'bg-secondary text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    <SettingsIcon id={tab.id} className={activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">個人資料</h2>
                  <p className="text-sm text-muted-foreground mt-1">管理你的帳戶資訊</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-medium">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                    <button className="h-9 px-4 rounded-lg border border-border/50 text-sm hover:bg-secondary transition-all">
                      更換頭像
                    </button>
                  </div>

                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">姓名</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">電子郵件</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">API 金鑰</h2>
                  <p className="text-sm text-muted-foreground mt-1">設定 LLM 供應商的 API 金鑰</p>
                </div>

                {/* 本機 LLM 區塊 */}
                <div className="space-y-4 max-w-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">本機 LLM（免費）</h3>
                    <button
                      onClick={checkLocalProviders}
                      disabled={isCheckingProviders}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                    >
                      {isCheckingProviders ? (
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      重新偵測
                    </button>
                  </div>

                  {/* LM Studio */}
                  <div className={cn(
                    "p-4 rounded-xl border space-y-3",
                    providerStatus.lmstudio ? "border-green-500/50 bg-green-500/5" : "border-border/50"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          providerStatus.lmstudio ? "bg-green-500/20" : "bg-purple-500/10"
                        )}>
                          <svg viewBox="0 0 24 24" fill="none" className={cn("w-5 h-5", providerStatus.lmstudio ? "text-green-500" : "text-purple-500")}>
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium flex items-center gap-2">
                            LM Studio
                            {providerStatus.lmstudio && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-500">已連線</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">本機運行，完全免費</div>
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={localLLM.lmstudioUrl}
                      onChange={(e) => setLocalLLM({ ...localLLM, lmstudioUrl: e.target.value })}
                      placeholder="http://localhost:1234/v1"
                      className="w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {!providerStatus.lmstudio && (
                      <p className="text-xs text-muted-foreground">
                        請先啟動 LM Studio 並載入模型，然後點選「Start Server」
                      </p>
                    )}
                  </div>

                  {/* Ollama */}
                  <div className={cn(
                    "p-4 rounded-xl border space-y-3",
                    providerStatus.ollama ? "border-green-500/50 bg-green-500/5" : "border-border/50"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          providerStatus.ollama ? "bg-green-500/20" : "bg-cyan-500/10"
                        )}>
                          <svg viewBox="0 0 24 24" fill="none" className={cn("w-5 h-5", providerStatus.ollama ? "text-green-500" : "text-cyan-500")}>
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="4" fill="currentColor"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium flex items-center gap-2">
                            Ollama
                            {providerStatus.ollama && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-500">已連線</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {providerStatus.ollamaModels.length > 0
                              ? `${providerStatus.ollamaModels.length} 個模型可用`
                              : '本機運行，完全免費'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={localLLM.ollamaUrl}
                        onChange={(e) => setLocalLLM({ ...localLLM, ollamaUrl: e.target.value })}
                        placeholder="http://localhost:11434"
                        className="h-10 px-3 rounded-lg border border-border/50 bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      {providerStatus.ollamaModels.length > 0 ? (
                        <select
                          value={localLLM.ollamaModel}
                          onChange={(e) => setLocalLLM({ ...localLLM, ollamaModel: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {providerStatus.ollamaModels.map((model) => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={localLLM.ollamaModel}
                          onChange={(e) => setLocalLLM({ ...localLLM, ollamaModel: e.target.value })}
                          placeholder="llama3.2"
                          className="h-10 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      )}
                    </div>
                    {!providerStatus.ollama && (
                      <p className="text-xs text-muted-foreground">
                        請執行 <code className="px-1 py-0.5 rounded bg-secondary">ollama serve</code> 啟動服務
                      </p>
                    )}
                  </div>
                </div>

                {/* 雲端 API 區塊 */}
                <div className="space-y-4 max-w-lg pt-4 border-t border-border/50">
                  <h3 className="text-sm font-medium">雲端 API（需要金鑰）</h3>
                  <div className="p-4 rounded-xl border border-border/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-emerald-500">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium">OpenAI</div>
                        <div className="text-xs text-muted-foreground">GPT-4, GPT-3.5</div>
                      </div>
                    </div>
                    <input
                      type="password"
                      value={apiKeys.openai}
                      onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                      placeholder="sk-..."
                      className="w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-border/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-orange-500">
                          <path d="M12 2L2 19h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Anthropic</div>
                        <div className="text-xs text-muted-foreground">Claude 3.5, Claude 3</div>
                      </div>
                    </div>
                    <input
                      type="password"
                      value={apiKeys.anthropic}
                      onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                      placeholder="sk-ant-..."
                      className="w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-border/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Google AI</div>
                        <div className="text-xs text-muted-foreground">Gemini Pro, Gemini Ultra</div>
                      </div>
                    </div>
                    <input
                      type="password"
                      value={apiKeys.google}
                      onChange={(e) => setApiKeys({ ...apiKeys, google: e.target.value })}
                      placeholder="AIza..."
                      className="w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">偏好設定</h2>
                  <p className="text-sm text-muted-foreground mt-1">自訂你的使用體驗</p>
                </div>

                <div className="space-y-6 max-w-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">外觀主題</div>
                      <div className="text-xs text-muted-foreground mt-0.5">選擇淺色或深色模式</div>
                    </div>
                    <div className="flex gap-1 p-1 rounded-lg bg-secondary/50">
                      {['light', 'dark', 'system'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={cn(
                            'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                            theme === t ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {t === 'light' ? '淺色' : t === 'dark' ? '深色' : '系統'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">預設模型</div>
                      <div className="text-xs text-muted-foreground mt-0.5">新對話使用的 AI 模型</div>
                    </div>
                    <select
                      value={preferences.defaultModel}
                      onChange={(e) => setPreferences({ ...preferences, defaultModel: e.target.value })}
                      className="h-9 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="claude-3-opus">Claude 3 Opus</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                      <option value="gemini-pro">Gemini Pro</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">串流回應</div>
                      <div className="text-xs text-muted-foreground mt-0.5">即時顯示 AI 回應</div>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, streamResponse: !preferences.streamResponse })}
                      className={cn(
                        'w-11 h-6 rounded-full transition-colors',
                        preferences.streamResponse ? 'bg-foreground' : 'bg-secondary'
                      )}
                    >
                      <div className={cn(
                        'w-5 h-5 rounded-full bg-background shadow-sm transition-transform',
                        preferences.streamResponse ? 'translate-x-5' : 'translate-x-0.5'
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">保存對話歷史</div>
                      <div className="text-xs text-muted-foreground mt-0.5">自動儲存所有對話記錄</div>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, saveHistory: !preferences.saveHistory })}
                      className={cn(
                        'w-11 h-6 rounded-full transition-colors',
                        preferences.saveHistory ? 'bg-foreground' : 'bg-secondary'
                      )}
                    >
                      <div className={cn(
                        'w-5 h-5 rounded-full bg-background shadow-sm transition-transform',
                        preferences.saveHistory ? 'translate-x-5' : 'translate-x-0.5'
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">記憶管理</h2>
                  <p className="text-sm text-muted-foreground mt-1">管理 AI 的長期記憶</p>
                </div>

                <div className="space-y-4 max-w-lg">
                  <div className="p-4 rounded-xl border border-border/50 bg-card/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium">記憶使用量</div>
                      <div className="text-xs text-muted-foreground">128 / 1000 條</div>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full w-[12.8%] rounded-full bg-foreground" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-border/50 space-y-3">
                    <div className="text-sm font-medium">記憶類型分佈</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">對話摘要</span>
                        <span>56 條</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">用戶偏好</span>
                        <span>23 條</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">專案知識</span>
                        <span>49 條</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full h-10 rounded-lg border border-border/50 text-sm hover:bg-secondary transition-all">
                    匯出記憶
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-red-500">危險區域</h2>
                  <p className="text-sm text-muted-foreground mt-1">這些操作無法復原，請謹慎操作</p>
                </div>

                <div className="space-y-4 max-w-lg">
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">清除所有記憶</div>
                        <div className="text-xs text-muted-foreground mt-0.5">刪除 AI 的所有長期記憶</div>
                      </div>
                      <button
                        onClick={() => setShowClearMemoryModal(true)}
                        className="h-9 px-4 rounded-lg border border-red-500/50 text-sm text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        清除
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">刪除所有對話</div>
                        <div className="text-xs text-muted-foreground mt-0.5">刪除所有對話歷史記錄</div>
                      </div>
                      <button
                        onClick={() => setShowDeleteHistoryModal(true)}
                        className="h-9 px-4 rounded-lg border border-red-500/50 text-sm text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        刪除
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">刪除帳戶</div>
                        <div className="text-xs text-muted-foreground mt-0.5">永久刪除你的帳戶及所有資料</div>
                      </div>
                      <button
                        onClick={() => setShowDeleteAccountModal(true)}
                        className="h-9 px-4 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-all"
                      >
                        刪除帳戶
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Clear Memory Modal */}
      {showClearMemoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowClearMemoryModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-background rounded-2xl border border-border p-6 w-full max-w-md mx-4 shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-2">確認清除所有記憶？</h3>
            <p className="text-sm text-muted-foreground mb-6">
              此操作將永久刪除 AI 的所有長期記憶，包括對話摘要、用戶偏好和專案知識。此操作無法復原。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearMemoryModal(false)}
                className="h-10 px-4 rounded-lg border border-border text-sm hover:bg-secondary transition-all"
              >
                取消
              </button>
              <button
                onClick={handleClearMemory}
                disabled={isDeleting}
                className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    清除中...
                  </>
                ) : (
                  '確認清除'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete History Modal */}
      {showDeleteHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteHistoryModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-background rounded-2xl border border-border p-6 w-full max-w-md mx-4 shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-2">確認刪除所有對話？</h3>
            <p className="text-sm text-muted-foreground mb-6">
              此操作將永久刪除所有對話歷史記錄。此操作無法復原。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteHistoryModal(false)}
                className="h-10 px-4 rounded-lg border border-border text-sm hover:bg-secondary transition-all"
              >
                取消
              </button>
              <button
                onClick={handleDeleteHistory}
                disabled={isDeleting}
                className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    刪除中...
                  </>
                ) : (
                  '確認刪除'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isDeleting && setShowDeleteAccountModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-background rounded-2xl border border-border p-6 w-full max-w-md mx-4 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-red-500 mb-2">刪除帳戶</h3>
            <p className="text-sm text-muted-foreground mb-4">
              此操作將永久刪除你的帳戶及所有相關資料，包括：
            </p>
            <ul className="text-sm text-muted-foreground mb-4 list-disc list-inside space-y-1">
              <li>所有對話記錄</li>
              <li>AI 長期記憶</li>
              <li>工作流與自動化設定</li>
              <li>API 金鑰與設定</li>
            </ul>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
              <p className="text-sm text-red-500 font-medium">
                此操作無法復原！
              </p>
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium block mb-2">
                請輸入 <span className="font-bold text-foreground">{user?.name}</span> 以確認刪除
              </label>
              <input
                type="text"
                value={deleteAccountInput}
                onChange={(e) => setDeleteAccountInput(e.target.value)}
                placeholder={user?.name}
                className="w-full h-10 px-3 rounded-lg border border-red-500/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteAccountModal(false)
                  setDeleteAccountInput('')
                }}
                disabled={isDeleting}
                className="h-10 px-4 rounded-lg border border-border text-sm hover:bg-secondary transition-all disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteAccountInput !== user?.name}
                className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    刪除中...
                  </>
                ) : (
                  '永久刪除我的帳戶'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  )
}
