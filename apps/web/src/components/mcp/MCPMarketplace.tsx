'use client'

import { useState } from 'react'
import { MCPServerCard } from './MCPServerCard'
import { MCPInstalledList } from './MCPInstalledList'
import { cn } from '@/lib/utils'
import { UpgradePrompt } from '@/components/UpgradePrompt'
import { useUser } from '@/components/AuthGuard'
import { checkMcpToolLimit, enableMcpTool, disableMcpTool, LimitCheckResult } from '@/lib/usage'

interface MCPServer {
  id: string
  name: string
  description: string
  author: string
  category: string
  command: string
  args: string[]
  stars: number
  installed: boolean
}

const MOCK_SERVERS: MCPServer[] = [
  {
    id: 'filesystem',
    name: 'Filesystem',
    description: '讀寫本地檔案系統，支援目錄瀏覽、檔案搜尋',
    author: 'Anthropic',
    category: 'system',
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-filesystem'],
    stars: 12500,
    installed: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub 操作：PR、Issue、Repo 管理',
    author: 'Anthropic',
    category: 'dev',
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-github'],
    stars: 8900,
    installed: false,
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description: '瀏覽器自動化：截圖、表單填寫、網頁爬取',
    author: 'Anthropic',
    category: 'automation',
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-puppeteer'],
    stars: 6200,
    installed: false,
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'PostgreSQL 資料庫查詢與管理',
    author: 'Anthropic',
    category: 'database',
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-postgres'],
    stars: 5800,
    installed: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Slack 訊息發送與頻道管理',
    author: 'Community',
    category: 'communication',
    command: 'npx',
    args: ['-y', '@mcp/slack-server'],
    stars: 3200,
    installed: false,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Notion 頁面與資料庫操作',
    author: 'Community',
    category: 'productivity',
    command: 'npx',
    args: ['-y', '@mcp/notion-server'],
    stars: 4100,
    installed: false,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: '郵件讀取、發送與管理',
    author: 'Community',
    category: 'communication',
    command: 'npx',
    args: ['-y', '@mcp/gmail-server'],
    stars: 2800,
    installed: false,
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: '行事曆事件管理與排程',
    author: 'Community',
    category: 'productivity',
    command: 'npx',
    args: ['-y', '@mcp/gcal-server'],
    stars: 2400,
    installed: false,
  },
]

function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const iconClass = cn('w-4 h-4', className)

  switch (id) {
    case 'all':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'system':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'dev':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'database':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'automation':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'communication':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'productivity':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 9l-5 5-4-4-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
  }
}

const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'system', label: '系統' },
  { id: 'dev', label: '開發' },
  { id: 'database', label: '資料庫' },
  { id: 'automation', label: '自動化' },
  { id: 'communication', label: '通訊' },
  { id: 'productivity', label: '生產力' },
]

export function MCPMarketplace() {
  const { user } = useUser()
  const [limitError, setLimitError] = useState<LimitCheckResult | null>(null)
  const [servers, setServers] = useState(MOCK_SERVERS)
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed'>('marketplace')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filteredServers = servers.filter((server) => {
    if (category !== 'all' && server.category !== category) return false
    if (search) {
      const query = search.toLowerCase()
      return (
        server.name.toLowerCase().includes(query) ||
        server.description.toLowerCase().includes(query)
      )
    }
    return true
  })

  const installedServers = servers.filter((s) => s.installed)

  const handleInstall = (id: string) => {
    // 檢查 MCP 工具限制
    const limitCheck = checkMcpToolLimit(user)
    if (!limitCheck.allowed) {
      setLimitError(limitCheck)
      return
    }

    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, installed: true } : s))
    )
    enableMcpTool(id)
  }

  const handleUninstall = (id: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, installed: false } : s))
    )
    disableMcpTool(id)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-border/50">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={cn(
            'inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'marketplace'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6h18M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          市場
        </button>
        <button
          onClick={() => setActiveTab('installed')}
          className={cn(
            'inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'installed'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          已安裝 ({installedServers.length})
        </button>
      </div>

      {activeTab === 'marketplace' ? (
        <>
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="搜尋工具..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-border/50 bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors',
                    category === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  )}
                >
                  <CategoryIcon id={cat.id} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Server Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServers.map((server) => (
              <MCPServerCard
                key={server.id}
                server={server}
                onInstall={() => handleInstall(server.id)}
                onUninstall={() => handleUninstall(server.id)}
              />
            ))}
          </div>

          {filteredServers.length === 0 && (
            <div className="rounded-lg border border-dashed border-border/50 p-12 text-center">
              <p className="text-muted-foreground">找不到符合條件的工具</p>
            </div>
          )}
        </>
      ) : (
        <MCPInstalledList
          servers={installedServers}
          onUninstall={handleUninstall}
        />
      )}

      {/* Upgrade Prompt Modal */}
      {limitError && !limitError.allowed && user && (
        <UpgradePrompt
          limitResult={limitError}
          type="mcpTools"
          currentTier={user.tier}
          onClose={() => setLimitError(null)}
        />
      )}
    </div>
  )
}
